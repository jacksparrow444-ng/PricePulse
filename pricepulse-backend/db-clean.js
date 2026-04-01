require('dotenv').config();
const db = require('./config/db');

async function deepClean() {
  console.log('Deep cleaning database - fixing cross-product contamination...\n');

  // Step 1: Find all (product_id, product_name) pairs and their correct mapping
  const [products] = await db.query('SELECT id, name FROM products ORDER BY id');
  
  let totalDeleted = 0;
  for (const prod of products) {
    // Delete any price_entry where product_id matches but product_name does NOT match
    // (these are wrong entries from old seed / cross-contamination)
    const [result] = await db.query(
      'DELETE FROM price_entries WHERE product_id = ? AND product_name != ?',
      [prod.id, prod.name]
    );
    if (result.affectedRows > 0) {
      console.log('  Fixed ID:' + prod.id + ' [' + prod.name + '] - removed ' + result.affectedRows + ' wrong-name entries');
      totalDeleted += result.affectedRows;
    }
  }
  console.log('\nCross-contamination fixed: ' + totalDeleted + ' bad entries removed');

  // Step 2: Remove any remaining extreme outliers
  const [r2] = await db.query(`
    DELETE pe FROM price_entries pe
    JOIN (
      SELECT product_id, AVG(price) as avg_p
      FROM price_entries
      GROUP BY product_id
    ) stats ON pe.product_id = stats.product_id
    WHERE pe.price < stats.avg_p * 0.35
       OR pe.price > stats.avg_p * 2.8
  `);
  console.log('Remaining outliers removed: ' + r2.affectedRows);

  // Final summary
  const [[final]] = await db.query(`
    SELECT COUNT(*) as entries FROM price_entries
  `);

  const [summary] = await db.query(`
    SELECT pe.product_id, p.name, COUNT(*) as c,
      ROUND(MIN(price),2) as mn, ROUND(AVG(price),2) as av, ROUND(MAX(price),2) as mx,
      ROUND((MAX(price)-MIN(price))/AVG(price)*100,1) as swing
    FROM price_entries pe
    LEFT JOIN products p ON pe.product_id = p.id
    GROUP BY pe.product_id, p.name
    ORDER BY p.id ASC
    LIMIT 20
  `);

  console.log('\nFinal Product Summary:');
  summary.forEach(r =>
    console.log('  ID:' + String(r.product_id).padEnd(4) +
      (r.name || '?').substring(0, 30).padEnd(32) +
      ' entries=' + String(r.c).padStart(2) +
      ' min=Rs.' + String(r.mn).padStart(7) +
      ' avg=Rs.' + String(r.av).padStart(7) +
      ' max=Rs.' + String(r.mx).padStart(7) +
      ' swing=' + r.swing + '%')
  );
  console.log('\nTotal entries remaining: ' + final.entries);
  console.log('Deep clean complete!');
  process.exit(0);
}

deepClean().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
