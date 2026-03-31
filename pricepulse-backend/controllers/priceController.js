const db = require('../config/db');

exports.submitPrice = async (req, res) => {
  const { product_id, product_name, price, location, store_name } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // 1. Auto-register product if it doesn't exist
    await db.query("INSERT IGNORE INTO products (id, name, category) VALUES (?, ?, 'New Entry')", [product_id, product_name]);

    // 2. Insert price entry
    const query = "INSERT INTO price_entries (product_id, product_name, price, location, store_name, image_path) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(query, [product_id, product_name, price, location, store_name, image_path]);

    res.status(200).json({ message: "Market Data Saved Successfully!" });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ error: "Internal Database Error" });
  }
};

exports.getAnalytics = async (req, res) => {
  const param = req.params.id;
  try {
    let query;
    let queryParams = [];

    if (!isNaN(param)) {
      // Search by Exact Product ID
      query = `
        SELECT pe.*, p.category, p.name as p_name 
        FROM price_entries pe
        LEFT JOIN products p ON pe.product_id = p.id
        WHERE pe.product_id = ? 
        ORDER BY CAST(pe.price AS DECIMAL(10,2)) ASC
      `;
      queryParams = [param];
    } else {
      // Search by Product Name (Fuzzy matching)
      query = `
        SELECT pe.*, p.category, p.name as p_name 
        FROM price_entries pe
        LEFT JOIN products p ON pe.product_id = p.id
        WHERE pe.product_id = (
            SELECT id FROM products 
            WHERE name LIKE ? 
            LIMIT 1
        )
        ORDER BY CAST(pe.price AS DECIMAL(10,2)) ASC
      `;
      queryParams = [`%${param}%`];
    }

    const [results] = await db.query(query, queryParams);

    if (results.length === 0) {
      return res.json({ total_samples: 0 });
    }

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
      raw_data: results
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSystemStats = async (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(DISTINCT id) FROM products) as total_products,
      (SELECT COUNT(*) FROM price_entries) as total_entries,
      (SELECT COUNT(DISTINCT location) FROM price_entries) as total_locations,
      (SELECT COUNT(DISTINCT store_name) FROM price_entries) as total_vendors
  `;
  try {
    const [results] = await db.query(query);
    res.json(results[0]);
  } catch (err) {
    console.error("Stats Error Detail:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState
    });
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  const q = req.query.q;
  if (!q || q.length < 2) return res.json([]);
  
  try {
    const query = `
      SELECT DISTINCT p.id, p.name, p.category 
      FROM products p
      INNER JOIN price_entries pe ON p.id = pe.product_id
      WHERE p.name LIKE ? OR p.id LIKE ?
      LIMIT 8
    `;
    const [results] = await db.query(query, [`%${q}%`, `%${q}%`]);
    res.json(results);
  } catch (err) {
    console.error("Suggestions Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
