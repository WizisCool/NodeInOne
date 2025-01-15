const express = require('express');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Ensure database directory exists
const dbPath = path.join(__dirname, 'database', 'database.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database connected successfully.');

    // Initialize tables if they do not exist
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                links TEXT NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 1
            )`);
    });
  }
});

// Middleware
app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set secure: true in production with HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Authentication routes
app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// API routes
// Get all subscriptions
app.get('/api/subscriptions', ensureAuthenticated, (req, res) => {
  db.all('SELECT * FROM subscriptions', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows.map(row => ({ ...row, links: JSON.parse(row.links), enabled: !!row.enabled })));
  });
});

// Add a new subscription
app.post('/api/subscriptions', ensureAuthenticated, (req, res) => {
  const { name, links } = req.body;
  const linksJSON = JSON.stringify(links || []);
  db.run(
    `INSERT INTO subscriptions (name, links) VALUES (?, ?)`,
    [name, linksJSON],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID, name, links: JSON.parse(linksJSON), enabled: true });
    }
  );
});

// Update a subscription
app.put('/api/subscriptions/:id', ensureAuthenticated, (req, res) => {
  const subscriptionId = req.params.id;
  const { name, links } = req.body;
  const linksJSON = JSON.stringify(links);
  db.run(
    'UPDATE subscriptions SET name = ?, links = ? WHERE id = ?',
    [name, linksJSON, subscriptionId],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(204).end();
    }
  );
});

// Toggle subscription status
app.put('/api/subscriptions/:id/status', ensureAuthenticated, (req, res) => {
  const subscriptionId = req.params.id;
  const { enabled } = req.body;
  db.run(
    'UPDATE subscriptions SET enabled = ? WHERE id = ?',
    [enabled ? 1 : 0, subscriptionId],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(204).end();
    }
  );
});

// Delete a subscription
app.delete('/api/subscriptions/:id', ensureAuthenticated, (req, res) => {
  const subscriptionId = req.params.id;
  db.run('DELETE FROM subscriptions WHERE id = ?', [subscriptionId], (err) => {
    if (err) return res.status(500).send(err.message);
    res.status(204).end();
  });
});

// Serve static files (for frontend integration)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Public API for direct subscription link
app.get('/subscriptions/:id', (req, res) => {
  const subscriptionId = req.params.id;
  db.get('SELECT links FROM subscriptions WHERE id = ? AND enabled = 1', [subscriptionId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send('Subscription not found or disabled');
    res.type('text/plain').send(JSON.parse(row.links).join('\n'));
  });
});

// Serve protected dashboard
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log('User:', req.user);
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.get('/api/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});


// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
