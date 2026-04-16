// handles reading and updating the logged-in user's profile
// all routes here are protected  you need a valid token to use them
const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/profile fetch the current user's profile
// protect runs first and attaches the user to req.user, so just send it back
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile update profile fields
// only updates fields that were actually sent  won't wipe things that weren't included
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, postcode, weeklyBudget, householdSize, dietaryPreferences } = req.body;

    // fetch the full user doc so we can update and re-save it
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // only overwrite a field if it was included in the request body
    if (name) user.name = name;
    if (postcode !== undefined) user.postcode = postcode;
    if (weeklyBudget !== undefined) user.weeklyBudget = weeklyBudget;
    if (householdSize !== undefined) user.householdSize = householdSize;
    if (dietaryPreferences !== undefined) user.dietaryPreferences = dietaryPreferences;

    // password can't be changed here that would need its own separate route
    const updated = await user.save();

    // send back the updated profile (no password field)
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      postcode: updated.postcode,
      weeklyBudget: updated.weeklyBudget,
      householdSize: updated.householdSize,
      dietaryPreferences: updated.dietaryPreferences,
    });
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
