const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const auth = require('../middleware/auth'); 


const User = require("../models/User");


router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    // console.log(req.body)

    const user = await User.findOne({ email}).populate("tenant");

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const plan = user.role === "admin" ? "pro" : user.plan;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials2" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      tenant: user.tenant ? user.tenant.name : null,
      plan: plan
      
    });

 
});



// Change password
router.put('/change-password', auth, async (req, res) => {
 
    const { currentPassword, newPassword } = req.body;
    const user = req.user; 

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.json({ error: 'Current password is incorrect' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
   
    user.password = hashedNew;
    await user.save();

    res.json({ message: 'Password updated successfully' });
 
});

module.exports = router;
