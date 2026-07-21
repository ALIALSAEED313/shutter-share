const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required' ],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  profileName:{
    type: String,
    minlength: 2,
    maxlength: 100
  },
  resetPasswordToken:{
    type: String,
  },
  resetPasswordExpires:{
    type: Date,
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;