// User model - User.js

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

// Method to verify the password
userSchema.methods.verifyPassword = async function(candidatePassword) {
  try {
      // Use bcrypt to compare the candidatePassword with the hashed password stored in the database
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
  } catch (error) {
      throw new Error('Password verification failed');
  }
};
  
// Create a User model based on the user schema
const User = mongoose.model('User', userSchema);
  
module.exports = User;