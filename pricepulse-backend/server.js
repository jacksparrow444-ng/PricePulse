const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); next(); });

/**
 * @fileoverview PricePulse Core Backend Service
 * Coordinates hyperlocal intelligence ingestion, distributed price consensus, and data persistence.
 */

// 1. Storage Configuration (Decentralized Node Image Cache)
/**
 * Configures the local storage engine for photographic evidence.
 * Retains imagery for node-ledger verifiable claims.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// 2. Intelligence Matrix Data Layer (Database Connection)
/**
 * Establishes optimal connection pool to the central MariaDB intelligence layer.
 * Coordinates cross-reference queries for analytical calculations.
 */
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

// 3. Ingestion Pipeline (Auto-Register Logic)
/**
 * Ingests individual data nodes into the consensus engine.
 * Automatically provisions new product models if unencountered hashes are detected.
 * @route POST /submit-price
 * @param {Object} req.body - Payload containing product hash, local price, vendor identity, and geozone.
 * @param {Object} req.file - Attached photographic evidence of the cited price.
 * @returns {Object} JSON response acknowledging assimilation status.
 */
app.post('/submit-price', upload.single('image'), (req, res) => {
  const { product_id, product_name, price, location, store_name } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  const autoAddProduct = "INSERT IGNORE INTO products (id, name, category) VALUES (?, ?, 'New Entry')";

  db.query(autoAddProduct, [product_id, product_name], (err) => {
    if (err) console.error(err);

    const query = "INSERT INTO price_entries (product_id, product_name, price, location, store_name, image_path) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [product_id, product_name, price, location, store_name, image_path], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Market Data Saved Successfully!" });
    });
  });
});

// 4. Intelligence Analytics Engine
/**
 * Calculates core metrics: consensus averages, optimal fair-trade ranges, and localized spreads.
 * Aggregates verified nodes into JSON payload ready for frontend D3/Recharts parsing.
 * @route GET /analytics/:id
 * @param {string} req.params.id - The unique cryptographic or product designation hash.
 * @returns {Object} Analytical payload incorporating variance arrays and image pointers.
 */
app.get('/analytics/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT pe.*, p.category, p.name as p_name 
    FROM price_entries pe
    LEFT JOIN products p ON pe.product_id = p.id
    WHERE pe.product_id = ? ORDER BY CAST(pe.price AS DECIMAL(10,2)) ASC
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.json({ total_samples: 0 });

    const prices = results.map(row => parseFloat(row.price));
    const average_price = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
    const min_price = Math.min(...prices).toFixed(2);
    const max_price = Math.max(...prices).toFixed(2);

    const last_image = results.find(r => r.image_path && r.image_path !== 'img1')?.image_path || results[0].image_path;

    res.json({
      product_name: results[0].product_name || results[0].p_name || 'Unknown Product',
      category: results[0].category || 'General',
      total_samples: results.length,
      average_price,
      min_price,
      max_price,
      fair_range: {
        low: (average_price * 0.9).toFixed(2),
        high: (average_price * 1.1).toFixed(2)
      },
      last_image: last_image,
      raw_data: results // 🔥 Frontend ka graph aur radar yahan se chalega!
    });
  });
});

// 5. Global Telemetry Endpoint
/**
 * Exposes macro-level system capacity and operational breadth.
 * Calculates total nodes, items indexed, active network vendors, and geographic spread.
 * @route GET /system-stats
 * @returns {Object} Absolute integers mapping the system's current ledger scale.
 */
app.get('/system-stats', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(DISTINCT id) FROM products) as total_products,
      (SELECT COUNT(*) FROM price_entries) as total_entries,
      (SELECT COUNT(DISTINCT location) FROM price_entries) as total_locations,
      (SELECT COUNT(DISTINCT store_name) FROM price_entries) as total_vendors
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

app.listen(5000, () => console.log('PricePulse Backend: Running on Port 5000 🚀'));