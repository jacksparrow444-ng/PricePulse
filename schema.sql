CREATE DATABASE IF NOT EXISTS pricepulse_db;
USE pricepulse_db;

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
