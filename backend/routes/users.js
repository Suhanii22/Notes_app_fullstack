const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.json({ error: "Access denied" });
    }

    const users = await User.find({ tenant: req.user.tenant }).select("-password"); //pass excluded
   
    res.json(users);
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch users" });
  }
});

// Upgrade user plan
router.put("/:id/upgrade", auth, async (req, res) => {
 
  
    if (req.user.role !== "admin") {
      return res.json({ error: "Forbidden" });
    }

    const user = await User.findById(req.params.id);

    if (!user) return res.json({ error: "User not found" });

    if (user.tenant.toString() !== req.user.tenant.toString()) {
      return res.json({ error: "Cannot upgrade user of another tenant" });
    }

    user.plan = "pro";
    await user.save();

    res.json({ message: "User upgraded", user });

});


module.exports = router;
