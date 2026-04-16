// meal plan routes
// POST /api/mealplans/generate  LLM-powered plan generation (Claude Haiku)
// POST /api/mealplans           save a generated plan to the user's account
// GET  /api/mealplans           all saved plans for the logged-in user
// GET  /api/mealplans/latest     most recent saved plan
// GET  /api/mealplans/:id        single plan by ID
// DELETE /api/mealplans/:id      delete a saved plan
const express   = require('express');
const router    = express.Router();
const path      = require('path');
const fs        = require('fs');
const Anthropic = require('@anthropic-ai/sdk');
const { protect }  = require('../middleware/authMiddleware');
const MealPlan  = require('../models/MealPlan');
const User      = require('../models/User');

// ── Spend tracking ─────────────────────────────────────────────────────────────
// hard cap at £2 to prevent runaway API costs
const SPEND_LIMIT_GBP  = 5.00;
// estimated cost per generation: ~600 input tokens + ~5000 output tokens with Haiku
// ($0.00015 input + $0.00625 output) ≈ $0.0064 ≈ £0.005
const COST_PER_GEN_GBP = 0.005;
const SPEND_FILE = path.join(__dirname, '../data/spend.json');

function getSpend() {
  try { return JSON.parse(fs.readFileSync(SPEND_FILE, 'utf8')).total ?? 0; }
  catch { return 0; }
}

function recordSpend(amount) {
  const total = +(getSpend() + amount).toFixed(4);
  try {
    fs.mkdirSync(path.dirname(SPEND_FILE), { recursive: true });
    fs.writeFileSync(SPEND_FILE, JSON.stringify({ total, updatedAt: new Date().toISOString() }, null, 2));
  } catch (e) { console.warn('Could not write spend file:', e.message); }
  return total;
}

// ── Claude client ──────────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/mealplans/generate
// builds a prompt from the user's household + prefs and asks Claude for a 7-day plan
router.post('/generate', protect, async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ message: 'ANTHROPIC_API_KEY not set in .env' });
  }

  // hard spend cap
  const currentSpend = getSpend();
  if (currentSpend >= SPEND_LIMIT_GBP) {
    return res.status(429).json({
      message: `API spend limit of £${SPEND_LIMIT_GBP} reached. Reset server/data/spend.json to continue.`,
    });
  }

  const { weeklyBudget = 60, householdSize = {}, dietaryPreferences = [], styles = [] } = req.body;
  const adults   = householdSize.adults   ?? 1;
  const children = householdSize.children ?? 0;
  const people   = adults + children;
  const perPersonPerMeal = people > 0
    ? (weeklyBudget / (people * 7 * 4)).toFixed(2)
    : (weeklyBudget / (7 * 4)).toFixed(2);

  const styleLine = styles.length ? styles.join(', ') : 'none';

  // map each dietary preference to concrete ingredient exclusions so Claude can't miss them
  const DIETARY_RULES = {
    'Dairy-free':   'NO milk, cheese, butter, cream, yoghurt, ghee, or any dairy product whatsoever',
    'Vegan':        'NO meat, poultry, fish, seafood, eggs, dairy, honey, or any animal-derived ingredient',
    'Vegetarian':   'NO meat, poultry, or fish — eggs and dairy are allowed',
    'Gluten-free':  'NO wheat, barley, rye, spelt, or any gluten-containing ingredient; use gluten-free alternatives',
    'Nut-free':     'NO peanuts, tree nuts, or nut-derived oils or products',
    'Halal':        'NO pork or alcohol; all meat must be halal-certified',
    'Kosher':       'NO pork or shellfish; do not mix meat and dairy in the same meal',
    'Low-sugar':    'NO added sugars, no honey, no syrups; use only naturally low-sugar ingredients',
  };

  const hardRestrictions = dietaryPreferences
    .filter((p) => DIETARY_RULES[p])
    .map((p) => `  - ${p}: ${DIETARY_RULES[p]}`)
    .join('\n');

  const prompt = `You are a UK meal planning assistant. Generate a complete 7-day meal plan.

Household: ${adults} adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}
Weekly budget: £${weeklyBudget} (~£${perPersonPerMeal}/person/meal)
Preferred styles: ${styleLine}
${hardRestrictions ? `\nHARD DIETARY RESTRICTIONS — every single meal and ingredient MUST comply:\n${hardRestrictions}\n` : ''}
Rules:
- NEVER use any ingredient that violates the hard dietary restrictions above
- Vary meals — no meal name repeated across the 7 days
- Keep ingredient lists to exactly 3–4 items per meal — no more
- For every ingredient include a realistic UK supermarket price (in £, e.g. 1.20) and assign it to one of: Tesco, Morrisons, Asda, Sainsbury's, Lidl, Aldi — vary the stores
- Steps: exactly 2 short sentences per meal — concise, actionable
${children > 0 ? '- Include child-friendly options, especially for lunch and dinner\n' : ''}- All calorie and nutrition values should be realistic per serving

Return ONLY a raw JSON object — no markdown fences, no extra text — in exactly this shape:
{
  "days": [
    {
      "day": "Sunday",
      "breakfast": {
        "name": "Banana Oat Pancakes",
        "side": "with maple syrup and fresh berries",
        "calories": 420,
        "nutrition": { "protein": 12, "carbs": 58, "fat": 14 },
        "ingredients": [
          { "name": "Oats", "quantity": "500g", "price": 1.10, "store": "Tesco" },
          { "name": "Bananas", "quantity": "5 pack", "price": 0.89, "store": "Asda" },
          { "name": "Eggs", "quantity": "6 pack", "price": 1.79, "store": "Morrisons" }
        ],
        "steps": [
          "Mash bananas with oats and eggs into a batter.",
          "Cook spoonfuls in a non-stick pan for 2 mins each side and serve with berries."
        ]
      },
      "lunch":   { "name": "...", "side": "...", "calories": 0, "nutrition": { "protein": 0, "carbs": 0, "fat": 0 }, "ingredients": [{ "name": "...", "quantity": "...", "price": 0.00, "store": "Tesco" }], "steps": [] },
      "dinner":  { "name": "...", "side": "...", "calories": 0, "nutrition": { "protein": 0, "carbs": 0, "fat": 0 }, "ingredients": [{ "name": "...", "quantity": "...", "price": 0.00, "store": "Asda" }], "steps": [] },
      "snacks":  { "name": "...", "side": "...", "calories": 0, "nutrition": { "protein": 0, "carbs": 0, "fat": 0 }, "ingredients": [{ "name": "...", "quantity": "...", "price": 0.00, "store": "Morrisons" }], "steps": [] }
    }
  ]
}
All 7 days in order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.`;

  try {
    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages:   [{ role: 'user', content: prompt }],
    });

    // warn if Claude hit the token limit mid-response (causes truncated JSON)
    if (message.stop_reason === 'max_tokens') {
      console.warn('Warning: response was truncated at max_tokens limit');
    }

    const raw = message.content[0]?.text || '';
    console.log('--- Claude raw response (first 300 chars) ---\n', raw.slice(0, 300));
    console.log('--- stop_reason:', message.stop_reason, '---');

    if (message.stop_reason === 'max_tokens') {
      return res.status(500).json({ message: 'Plan was too long to generate — try a smaller household or fewer details' });
    }

    // extract JSON by slicing from first { to last } — handles any preamble/postamble
    const firstBrace = raw.indexOf('{');
    const lastBrace  = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      console.error('No JSON braces found. Full raw:\n', raw);
      return res.status(500).json({ message: 'AI returned malformed JSON — please try again' });
    }
    const cleaned = raw.slice(firstBrace, lastBrace + 1);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON.parse failed. Cleaned string (first 800 chars):\n', cleaned.slice(0, 800));
      return res.status(500).json({ message: 'AI returned malformed JSON — please try again' });
    }

    // stamp each meal with its type
    const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const days = (parsed.days || []).map((d) => {
      const stamped = { day: d.day };
      MEAL_TYPES.forEach((t) => {
        if (d[t]) stamped[t] = { ...d[t], type: t };
      });
      return stamped;
    });

    const newTotal = recordSpend(COST_PER_GEN_GBP);
    console.log(`Plan generated. Est. spend: £${newTotal.toFixed(4)} / £${SPEND_LIMIT_GBP}`);

    res.json({ days, estimatedCost: COST_PER_GEN_GBP, totalSpend: newTotal });
  } catch (err) {
    console.error('Generate plan error:', err.message);
    res.status(500).json({ message: 'Failed to generate plan' });
  }
});

// POST /api/mealplans  save a generated plan to the user's account
router.post('/', protect, async (req, res) => {
  try {
    const { weeklyBudget, days } = req.body;
    const plan = await MealPlan.create({ user: req.user._id, weeklyBudget, days });
    await User.findByIdAndUpdate(req.user._id, { $push: { savedPlans: plan._id } });
    res.status(201).json(plan);
  } catch (err) {
    console.error('POST /mealplans error:', err);
    res.status(500).json({ message: 'Failed to save meal plan' });
  }
});

// GET /api/mealplans  all saved plans for the user, newest first
router.get('/', protect, async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error('GET /mealplans error:', err);
    res.status(500).json({ message: 'Failed to load meal plans' });
  }
});

// GET /api/mealplans/latest —most recent plan is used by dashboard widgets
router.get('/latest', protect, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plan || null);
  } catch (err) {
    console.error('GET /mealplans/latest error:', err);
    res.status(500).json({ message: 'Failed to load meal plan' });
  }
});

// GET /api/mealplans/:id  fetch one plan by ID used when loading from profile
router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    console.error('GET /mealplans/:id error:', err);
    res.status(500).json({ message: 'Failed to load meal plan' });
  }
});

// DELETE /api/mealplans/:id  remove a saved plan
router.delete('/:id', protect, async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedPlans: plan._id } });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    console.error('DELETE /mealplans/:id error:', err);
    res.status(500).json({ message: 'Failed to delete plan' });
  }
});

module.exports = router;
