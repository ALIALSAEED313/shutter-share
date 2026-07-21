const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alialsaeed.p@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


// Sign up routes
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }

  if(req.body.password.length < 8) {
    return res.send("Password must be at least 8 characters long.")
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // validation logic

  const user = await User.create(req.body);
  res.redirect("/auth/sign-in");
});



// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});



router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/");
});


router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//forgot-password route
router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password.ejs");
});

router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.send("No account with that email exists, a reset link has been sent to the email address associated with that account.");
  }

  const token = crypto.randomBytes(20).toString('hex')
  user.resetPasswordToken = token
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save()

  const resetUrl = `${process.env.BASE_URL}/auth/reset-password/${token}`
  const mailOptions = {
    from: 'alialsaeed.p@gmail.com',
    to: user.email,
    subject: 'Password Reset',
html: `
      <h3>Password Reset</h3>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  }
  try{
    await transporter.sendMail(mailOptions)
  res.send("An email has been sent to the address associated with that account with further instructions.")
  }
  catch(err){
    console.error("Error sending email:", err)
    res.send("There was an error sending the email. Please try again later.")
  }
  


})

router.get("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.send("Password reset token is invalid or has expired.");
  }

  res.render("auth/reset-password.ejs", { token: req.params.token });
})

router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.send("Password reset token is invalid or has expired.");
  }

  if(req.body.password.length < 8) {
    return res.send("Password must be at least 8 characters long.")
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  user.password = hashedPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  res.redirect("/auth/sign-in")
})

module.exports = router;