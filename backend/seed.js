const mongoose = require('mongoose');
const User = require('./models/User');
const Tenant = require('./models/Tenant');
const bcrypt = require('bcryptjs');
require("dotenv").config();



// mongoose.connect('mongodb://localhost/notes-app');
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB for seeding"))
.catch((err) => console.error("MongoDB connection error:", err));

async function seed() {
  // Creating tenants
  const acme = await Tenant.create({ name: 'Acme', domain : "testing" });
  const globex = await Tenant.create({ name: 'Globex', domain :"testing" });

  // Creating users
const users = [
  { name: 'Admin Acme', email: 'admin@acme.test', password: 'password', role: 'admin', tenant: acme._id ,      plan : "pro"},
  { name: 'User Acme', email: 'user@acme.test', password: 'password', role: 'member', tenant: acme._id ,       plan : "free"},
  { name: 'Admin Globex', email: 'admin@globex.test', password: 'password', role: 'admin', tenant: globex._id, plan : "pro" },
  { name: 'User Globex', email: 'user@globex.test', password: 'password', role: 'member', tenant: globex._id,  plan : "free" }
];


async function hashUsers(usersArray) {
  const saltRounds = 10;

  // Hashing passwords for all users
  const hashedUsers = await Promise.all(
    usersArray.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      return { ...user, password: hashedPassword };
    })
  );

  return hashedUsers;
}

const hashedUsers = await hashUsers(users);

  await User.create(hashedUsers);

  
  mongoose.disconnect();
}

seed();
