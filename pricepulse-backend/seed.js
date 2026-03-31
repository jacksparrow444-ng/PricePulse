require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedDatabase() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log('🌱 Connected to database. Ensuring tables exist...');

    // 0. ENSURE TABLES EXIST
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL
        )
    `);

    await db.query(`
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
        )
    `);

    console.log('🌱 Starting Data Injection Simulation...');

    // 1. CLEAR EXISTING DATA
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE price_entries');
    await db.query('TRUNCATE TABLE products');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🧹 Cleaned existing ledgers.');


    // 2. DEFINE PRODUCTS
    const products = [
        { id: 101, name: 'Fortune Mustard Oil (1L)', category: 'Grocery', base: 145 },
        { id: 102, name: 'Paracetamol 500mg (Strip)', category: 'Medicine', base: 15 },
        { id: 103, name: 'Notebook A4 200 Pages', category: 'Stationery', base: 60 },
        { id: 104, name: 'Maggi Noodles (70g)', category: 'Grocery', base: 14 },
        { id: 105, name: 'Amul Milk (1L)', category: 'Grocery', base: 66 },
        { id: 106, name: 'India Gate Basmati Rice (5kg)', category: 'Grocery', base: 550 },
        { id: 107, name: 'Dettol Antiseptic Liquid (100ml)', category: 'Medicine', base: 35 },
        { id: 108, name: 'LPG Cylinder Refill (14.2kg)', category: 'Utilities', base: 820 },
        { id: 109, name: 'Aashirvaad Atta (5kg)', category: 'Grocery', base: 220 },
        { id: 110, name: 'Classmate Pen (Pack of 5)', category: 'Stationery', base: 50 }
    ];

    // Insert Products
    for (const p of products) {
        await db.query('INSERT INTO products (id, name, category) VALUES (?, ?, ?)', [p.id, p.name, p.category]);
    }
    console.log(`📦 Seeded ${products.length} Products.`);

    // 3. DEFINE LOCATIONS & VENDORS
    const locations = ['Mullana', 'Ambala Cantt', 'Saha', 'Yamunanagar'];

    const vendorPrefixes = ['Shri Ram', 'Gupta', 'Aggarwal', 'Verma', 'Sharma', 'Singla', 'Garg', 'Jain'];
    const vendorSuffixes = ['General Store', 'Provisions', 'Medical Hall', 'Supermart', 'Traders', 'Pharma', 'Book Depot'];

    function getRandomVendor(category) {
        const pre = vendorPrefixes[Math.floor(Math.random() * vendorPrefixes.length)];
        if (category === 'Medicine') return `${pre} Medical Hall`;
        if (category === 'Stationery') return `${pre} Book Depot`;
        if (category === 'Utilities') return `${pre} Gas Agency`;
        const suf = vendorSuffixes[Math.floor(Math.random() * 2)]; // General Store or Provisions
        return `${pre} ${suf}`;
    }

    // 4. GENERATE 150+ ENTRIES WITH VARIANCE
    let entriesCount = 0;

    for (const p of products) {
        // Generate 15-20 entries per product
        const numEntries = Math.floor(Math.random() * 6) + 15;

        for (let i = 0; i < numEntries; i++) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const vendor = getRandomVendor(p.category);

            // Location-based variance multiplier
            let locMultiplier = 1.0;
            if (loc === 'Ambala Cantt') locMultiplier = 1.05; // Cantt is slightly expensive
            if (loc === 'Saha') locMultiplier = 0.95; // Saha is cheaper industrial area

            // Random variance +- 5%
            const randomV = (Math.random() * 0.1) - 0.05;

            let finalPrice = p.base * locMultiplier * (1 + randomV);
            finalPrice = Math.round(finalPrice * 2) / 2; // Round to nearest 0.5

            // OUTLIER INJECTION (Fraud Demo)
            // If it's Mustard Oil (101) and we are on the 5th entry, blast an outlier!
            if (p.id === 101 && i === 4) {
                finalPrice = 210.00; // Extreme Outlier!
                console.log(`🚨 INJECTED FRAUD OUTLIER: Mustard Oil at ₹210 (Vendor: ${vendor})`);
            }

            await db.query(
                'INSERT INTO price_entries (product_id, product_name, price, location, store_name, image_path) VALUES (?, ?, ?, ?, ?, ?)',
                [p.id, p.name, finalPrice.toFixed(2), loc, vendor, null]
            );
            entriesCount++;
        }
    }

    console.log(`✅ Successfully injected ${entriesCount} price entries across the matrix!`);

    await db.end();
    console.log('🔌 Database connection closed.');
}

seedDatabase().catch(console.error);
