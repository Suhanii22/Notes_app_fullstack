
const express = require("express");
const Tenant = require("../models/Tenant");
const router = express.Router();

// GET all tenants
router.get("/", async (req, res) => {
 
    const tenants = await Tenant.find();
    res.json(tenants);
 
});

module.exports = router;
