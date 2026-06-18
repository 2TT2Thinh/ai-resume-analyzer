const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'resume_db',
});

app.get('/', (req, res) => {
  res.send('Hello from Express Backend!');
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.post('/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully!',
    filename: req.file.originalname,
    savedAs: req.file.filename,
    size: req.file.size,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
