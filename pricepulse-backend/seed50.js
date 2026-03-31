require('dotenv').config();
const db = require('./config/db');

const products = [
  { name: 'Classmate Notebook', category: 'Stationery', basePrice: 50 },
  { name: 'Cello Gripper Pen', category: 'Stationery', basePrice: 10 },
  { name: 'A4 Doms Paper Ream', category: 'Stationery', basePrice: 200 },
  { name: 'Faber-Castell Pencils', category: 'Stationery', basePrice: 35 },
  { name: 'Camel Watercolors', category: 'Stationery', basePrice: 120 },
  { name: 'Amul Butter 100g', category: 'Groceries', basePrice: 56 },
  { name: 'Aashirvaad Atta 5kg', category: 'Groceries', basePrice: 250 },
  { name: 'Tata Salt 1kg', category: 'Groceries', basePrice: 28 },
  { name: 'Maggi Noodles 280g', category: 'Groceries', basePrice: 50 },
  { name: 'Cadbury Dairy Milk', category: 'Groceries', basePrice: 20 },
  { name: 'Logitech Mouse', category: 'Electronics', basePrice: 400 },
  { name: 'SanDisk 32GB USB', category: 'Electronics', basePrice: 350 },
  { name: 'Samsung Earphones', category: 'Electronics', basePrice: 600 },
  { name: 'Dettol Handwash', category: 'Household', basePrice: 99 },
  { name: 'Colgate Toothpaste', category: 'Household', basePrice: 85 }
];

const locations = ['North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Noida', 'Gurugram'];
const stores = ['Reliance Fresh', 'Local Kirana', 'Big Bazaar', 'Blinkit', 'Zepto Hub', 'Stationery Point'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

const seedDatabase = async () => {
  try {
    for (let id = 101; id <= 150; id++) {
      // Pick a random product template or generate one
      const template = products[id % products.length];
      const prodName = `${template.name} - V${id}`;
      const prodCategory = template.category;
      
      await db.query(`INSERT IGNORE INTO products (id, name, category) VALUES (?, ?, ?)`, [id, prodName, prodCategory]);
      console.log(`Created product: ${prodName} (ID: ${id})`);

      // Inject 5-10 price entries for each
      const numEntries = getRandomInt(5, 10);
      for (let j = 0; j < numEntries; j++) {
        const volatility = getRandomFloat(-0.1, 0.1); // +/- 10%
        const price = (template.basePrice * (1 + volatility)).toFixed(2);
        const loc = locations[getRandomInt(0, locations.length - 1)];
        const store = stores[getRandomInt(0, stores.length - 1)];
        
        await db.query(
          `INSERT INTO price_entries (product_id, product_name, price, location, store_name, image_path) VALUES (?, ?, ?, ?, ?, ?)`,
          [id, prodName, price, loc, store, null]
        );
      }
      console.log(`  -> Added ${numEntries} price entries.`);
    }

    console.log("Successfully injected products 101 to 150!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
