const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Database Pool: Connection established successfully.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database Pool Error:', err.message);
    console.error('Check your DB_HOST, DB_USER, etc. in Render Environment Variables.');
  });

module.exports = pool.promise();
