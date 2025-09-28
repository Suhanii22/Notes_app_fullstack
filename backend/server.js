const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));
app.use("/api/invite", require("./routes/invite"));
app.use("/api/tenants",require("./routes/tenants"));
app.use("/api/health",require("./routes/health"));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log('Server running on port PORT'));
