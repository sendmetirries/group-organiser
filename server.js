// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const SECRET_KEY = 'supersecretkey'; // Change to your secure key
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password';

let namesList = [];
let groups = [];

// Admin login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Add names (Admin only)
app.post('/api/names', authenticate, (req, res) => {
  const { names } = req.body;
  if (!Array.isArray(names)) return res.status(400).json({ message: 'Names must be an array' });
  namesList = names.filter(n => typeof n === 'string' && n.trim().length > 0);
  groups = []; // reset groups when names updated
  res.json({ message: 'Names saved', count: namesList.length });
});

// Create groups (Admin only)
app.post('/api/groups', authenticate, (req, res) => {
  const { groupSize } = req.body;
  const size = parseInt(groupSize);
  if (!size || size < 1) return res.status(400).json({ message: 'Invalid group size' });
  groups = [];
  for (let i = 0; i < namesList.length; i += size) {
    groups.push(namesList.slice(i, i + size));
  }
  res.json({ message: 'Groups created', groups });
});

// Get all groups (Admin only)
app.get('/api/groups', authenticate, (req, res) => {
  res.json({ groups });
});

// User checks their group (public)
app.get('/api/groups/:name', (req, res) => {
  const name = req.params.name.trim().toLowerCase();
  if (!name) return res.status(400).json({ message: 'Name required' });

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (group.some(n => n.toLowerCase() === name)) {
      return res.json({ groupNumber: i + 1, group });
    }
  }
  res.status(404).json({ message: 'Name not found in any group' });
});

// 404 handler for other routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

