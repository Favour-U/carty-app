// this defines what a user looks like in our database
// mongoose takes this schema and enforces it every time we save a user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // for hashing passwords not as plain text for security

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true }, // unique stops duplicate accounts
  password: { type: String, required: true }, // stored as a hash, never the real password
  postcode: { type: String },                 // used later for finding nearby deals
  weeklyBudget: { type: Number },             // how much they want to spend per week
  householdSize: {
    adults:   { type: Number },
    children: { type: Number },
  },
  dietaryPreferences: [{ type: String }],     // e.g.'vegetarian', 'gluten-free'
  savedPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan' }], // links to meal plans
  createdAt: { type: Date, default: Date.now },
});

// this runs automatically before every .save() call
// if the password hasn't changed we skip it - stops re-hashing an already hashed password
// Mongoose 9: async hooks don't use next() - just return, the promise handles it
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10); // 10 salt rounds is the sweet spot for security vs speed
});

// called during login compares what they typed with the stored hash
// bcrypt handles the comparison so we never need to decrypt anything
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
