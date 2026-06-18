const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');

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

app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const dbResult = await pool.query(
      'INSERT INTO resumes (filename, content) VALUES ($1, $2) RETURNING *',
      [req.file.originalname, req.file.filename]
    );

    const fileBuffer = fs.readFileSync(req.file.path);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), req.file.originalname);

    const aiResponse = await fetch('http://ai-service:8000/process', {
      method: 'POST',
      body: formData,
    });
    const aiResult = await aiResponse.json();

    res.json({
      message: 'File uploaded, saved, and sent to AI service!',
      resume: dbResult.rows[0],
      aiAnalysis: aiResult,
    });
  } catch (err) {
    res.status(500).json({ message: 'Process failed', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
