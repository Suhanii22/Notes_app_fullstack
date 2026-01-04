
const express = require("express");
const Tenant = require("../models/Tenant");
const router = express.Router();
const auth = require('../middleware/auth'); 

// GET all tenants
router.get("/", auth, async (req, res) => {
 
    const tenants = await Tenant.find();
    res.json(tenants);
 
});

module.exports = router;
