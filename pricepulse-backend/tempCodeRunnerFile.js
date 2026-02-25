const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Photo Storage Configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 2. Static Folder for Evidence Photos
app.use('/uploads', express.static('uploads'));

// 3. Database Connection (MariaDB/XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pricepulse_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MariaDB successfully!');
});

// 4. Submit Price + Evidence Photo
app.post('/submit-price', upload.single('image'), (req, res) => {
  const { product_id, product_name, price, location, store_name } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  const query = "INSERT INTO price_entries (product_id, product_name, price, location, store_name, image_path) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.query(query, [product_id, product_name, price, location, store_name, image_path], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Market Data & Evidence Saved Successfully!" });
  });
});

// 5. Intelligent Analytics + Latest Evidence Lookup
app.get('/analytics/:id', (req, res) => {
  const query = `
    SELECT 
      AVG(price) as average_price, 
      MIN(price) as min_price, 
      MAX(price) as max_price, 
      COUNT(*) as total_samples,
      (SELECT image_path FROM price_entries WHERE product_id = ? AND image_path IS NOT NULL ORDER BY created_at DESC LIMIT 1) as last_image
    FROM price_entries 
    WHERE product_id = ?`;

  db.query(query, [req.params.id, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    
    const stats = results[0];
    const avg = parseFloat(stats.average_price) || 0;

    // Fair Price Range Calculation (Average ± 10%)
    res.send({
      average_price: avg.toFixed(2),
      min_price: (parseFloat(stats.min_price) || 0).toFixed(2),
      max_price: (parseFloat(stats.max_price) || 0).toFixed(2),
      total_samples: stats.total_samples || 0,
      last_image: stats.last_image, // Frontend image tag ke liye
      fair_range: {
        low: (avg * 0.9).toFixed(2),
        high: (avg * 1.1).toFixed(2)
      }
    });
  });
});

// 6. Product Verification Endpoint
app.get('/product-info/:id', (req, res) => {
  const query = "SELECT name FROM products WHERE id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0] || { name: "Unregistered Product" });
  });
});

app.listen(5000, () => console.log('PricePulse Backend: Running on Port 5000 🚀'));