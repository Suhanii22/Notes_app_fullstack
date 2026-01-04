const express = require('express');
const router = express.Router();
const Tenant = require("../models/Tenant");
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); 

//  /api/invite
router.post("/", auth, async (req, res) => {
  
    const { name, email, role, tenant: tenantId, plan, password } = req.body;

    if (!name || !email || !role || !tenantId || !plan || !password) {
      return res.json({ message: "All fields are required" });
    }

     const tenantDoc = await Tenant.findById(tenantId);
    if (!tenantDoc) {
      return res.json({ message: "Invalid tenant" });
    }

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      role,
      tenant: tenantDoc._id,
      plan,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User created successfully" });

  
});


module.exports = router;
