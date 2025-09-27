const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'member' }, // admin or member
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  plan: { type: String, default: 'free' }
});

module.exports = mongoose.model('User', userSchema);
