const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

const privateKey = fs.readFileSync(
  '/etc/letsencrypt/live/backend.wurdle.eu/privkey.pem',
  'utf8'
);
const certificate = fs.readFileSync(
  '/etc/letsencrypt/live/backend.wurdle.eu/fullchain.pem',
  'utf8'
);
const credentials = { key: privateKey, cert: certificate };

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'wurdle',
  password: 'computer',
  database: 'clicker',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Route to handle click increment and color update
app.post('/click', (req, res) => {
  const { user, amount, color } = req.body;
  if (!user || typeof amount !== 'number' || !color) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const timestamp = Date.now();

  // First, check if the user already exists
  db.query('SELECT * FROM clicks WHERE user = ?', [user], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      // If the user does not exist, insert the new user with their color
      const insertQuery =
        'INSERT INTO clicks (user, userclicks, lastActive, color) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [user, amount, timestamp, color], (err) => {
        if (err) {
          console.error('Error inserting new user:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.json({ clicks: amount });
      });
    } else {
      // If the user exists, update their clicks and color
      const updateQuery = `UPDATE clicks
      SET userclicks = userclicks + ?, lastActive = ?, color = ?
      WHERE user = ?`;
      db.query(updateQuery, [amount, timestamp, color, user], (err) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        db.query(
          'SELECT userclicks FROM clicks WHERE user = ?',
          [user],
          (err, results) => {
            if (err) {
              console.error('Error fetching updated clicks:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ clicks: results[0].userclicks });
          }
        );
      });
    }
  });
});

// Route to fetch the user's click count and color
app.get('/status', (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'User parameter is required' });
  }

  db.query(
    'SELECT userclicks, color FROM clicks WHERE user = ?',
    [user],
    (err, results) => {
      if (err) {
        console.error('Error fetching user status:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        clicks: results[0].userclicks,
        color: results[0].color || '#000000',
      });
    }
  );
});

// Route to fetch the total number of clicks for all users
app.get('/totalClicks', (req, res) => {
  db.query(
    'SELECT COALESCE(SUM(userclicks), 0) AS totalClicks FROM clicks',
    (err, results) => {
      if (err) {
        console.error('Error fetching total clicks:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ totalClicks: results[0].totalClicks });
    }
  );
});

// Route to fetch the leaderboard
app.get('/leaderboard', (req, res) => {
  db.query(
    'SELECT user, userclicks, lastActive, color FROM clicks ORDER BY userclicks DESC LIMIT 10',
    (err, results) => {
      if (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const leaderboard = results.map((row) => ({
        user: row.user,
        userclicks: row.userclicks,
        lastActive: row.lastActive,
        color: row.color || '#000000',
      }));

      res.json({ leaderboard });
    }
  );
});

// Route to fetch the click strength
app.get('/clickStrength', (req, res) => {
  db.query('SELECT clickstrength FROM upgrades;', (err, results) => {
    if (err) {
      console.error('Error fetching click strength:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const clickStrength = results[0]?.clickstrength || 1;
    res.json({ clickStrength });
  });
});

// Start the server
https.createServer(credentials, app).listen(port, () => {
  console.log(`Server running on https://backend.wurdle.eu:${port}`);
});
