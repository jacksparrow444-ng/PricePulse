const mysql = require('mysql2/promise');
require('dotenv').config({ path: './pricepulse-backend/.env' });

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connected to database. Creating tables...');

  const schema = `
    CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        store_name VARCHAR(255) NOT NULL,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  // Split schema into individual queries because createConnection doesn't support multiple statements by default
  const queries = schema.split(';').filter(q => q.trim() !== '');
  
  for (const query of queries) {
    await connection.query(query);
    console.log('Executed query:', query.trim().substring(0, 50) + '...');
  }

  console.log('Tables created successfully.');
  await connection.end();
}

initDB().catch(console.error);
