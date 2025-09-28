const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();

const cors = require('cors');

const allowedOrigins = ['http://localhost:5173', 'https://notes-app-fullstack-m18kp6fts-suhanii22s-projects.vercel.app/']; 

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy blocked this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));



// Handle preflight OPTIONS requests
app.options('*', cors());





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
