require('dotenv').config();
const db = require('./config/db');

const RED   = '\x1b[31m';
const YEL   = '\x1b[33m';
const GRN   = '\x1b[32m';
const CYN   = '\x1b[36m';
const RST   = '\x1b[0m';
const BOLD  = '\x1b[1m';

async function runDiagnostics() {
  console.log(`\n${BOLD}${CYN}══════════════════════════════════════════════${RST}`);
  console.log(`${BOLD}${CYN}   PRICEPULSE DATABASE DIAGNOSTICS REPORT   ${RST}`);
  console.log(`${BOLD}${CYN}══════════════════════════════════════════════${RST}\n`);

  // ─── 1. Summary ────────────────────────────────────────────────────
  const [[stats]] = await db.query(`
    SELECT 
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM price_entries) as total_entries,
      (SELECT COUNT(*) FROM price_entries WHERE price <= 0) as zero_prices,
      (SELECT COUNT(*) FROM price_entries WHERE price IS NULL) as null_prices
  `);
  console.log(`${BOLD}[1] Overall Summary${RST}`);
  console.log(`   Total Products  : ${stats.total_products}`);
  console.log(`   Total Entries   : ${stats.total_entries}`);
  console.log(`   Zero/Neg Prices : ${stats.zero_prices > 0 ? RED + stats.zero_prices + RST : GRN + 0 + RST}`);
  console.log(`   NULL Prices     : ${stats.null_prices > 0  ? RED + stats.null_prices + RST : GRN + 0 + RST}\n`);

  // ─── 2. Zero / Negative prices ─────────────────────────────────────
  const [badPrices] = await db.query(`
    SELECT id, product_id, product_name, price, location, store_name
    FROM price_entries WHERE price <= 0 LIMIT 20
  `);
  console.log(`${BOLD}[2] Zero / Negative Price Entries${RST}`);
  if (badPrices.length === 0) {
    console.log(`   ${GRN}✓ None found${RST}`);
  } else {
    badPrices.forEach(r => 
      console.log(`   ${RED}✗ ID:${r.id}  Product:${r.product_name}  Price:${r.price}  Store:${r.store_name}${RST}`)
    );
  }
  console.log();

  // ─── 3. Products with HIGH price variance (outliers) ──────────────
  const [variance] = await db.query(`
    SELECT 
      pe.product_id,
      p.name,
      COUNT(*) as entries,
      MIN(price) as min_p,
      MAX(price) as max_p,
      AVG(price) as avg_p,
      STDDEV(price) as std_p,
      ((MAX(price) - MIN(price)) / AVG(price) * 100) as volatility_pct
    FROM price_entries pe
    LEFT JOIN products p ON pe.product_id = p.id
    GROUP BY pe.product_id, p.name
    HAVING volatility_pct > 25
    ORDER BY volatility_pct DESC
    LIMIT 20
  `);
  console.log(`${BOLD}[3] Products with HIGH Price Variance (>25% swing)${RST}`);
  if (variance.length === 0) {
    console.log(`   ${GRN}✓ No anomalies detected${RST}`);
  } else {
    variance.forEach(r => {
      const flag = r.volatility_pct > 50 ? RED : YEL;
      console.log(`   ${flag}⚠  [ID:${r.product_id}] ${r.name}`);
      console.log(`       Min=₹${parseFloat(r.min_p).toFixed(2)}  Max=₹${parseFloat(r.max_p).toFixed(2)}  Avg=₹${parseFloat(r.avg_p).toFixed(2)}  Swing=${parseFloat(r.volatility_pct).toFixed(1)}%  Entries=${r.entries}${RST}`);
    });
  }
  console.log();

  // ─── 4. Clear outlier individual entries (price > 3× avg) ─────────
  const [outliers] = await db.query(`
    SELECT pe.id, pe.product_id, pe.product_name, pe.price, pe.store_name,
           stats.avg_p
    FROM price_entries pe
    JOIN (
      SELECT product_id, AVG(price) as avg_p
      FROM price_entries
      GROUP BY product_id
    ) stats ON pe.product_id = stats.product_id
    WHERE pe.price > stats.avg_p * 3 OR pe.price < stats.avg_p * 0.3
    ORDER BY pe.product_id
    LIMIT 30
  `);
  console.log(`${BOLD}[4] Individual Outlier Entries (price > 3× or < 0.3× product average)${RST}`);
  if (outliers.length === 0) {
    console.log(`   ${GRN}✓ No extreme outliers found${RST}`);
  } else {
    outliers.forEach(r => {
      const ratio = (parseFloat(r.price) / parseFloat(r.avg_p)).toFixed(2);
      console.log(`   ${RED}✗ Entry#${r.id}  [${r.product_name}]  Price=₹${r.price}  Avg=₹${parseFloat(r.avg_p).toFixed(2)}  Ratio=${ratio}×  Store:${r.store_name}${RST}`);
    });
    console.log(`\n   ${YEL}→ To delete these outliers, run:${RST}`);
    console.log(`   ${CYN}   node db-clean.js${RST}`);
  }
  console.log();

  // ─── 5. Products with mismatched names ────────────────────────────
  const [nameMismatch] = await db.query(`
    SELECT pe.product_id, p.name as product_table_name, pe.product_name as entry_name, COUNT(*) as count
    FROM price_entries pe
    LEFT JOIN products p ON pe.product_id = p.id
    WHERE p.name IS NOT NULL AND pe.product_name != p.name
    GROUP BY pe.product_id, pe.product_name
    ORDER BY pe.product_id
    LIMIT 20
  `);
  console.log(`${BOLD}[5] Name Mismatches (entry name ≠ product table name)${RST}`);
  if (nameMismatch.length === 0) {
    console.log(`   ${GRN}✓ All names consistent${RST}`);
  } else {
    nameMismatch.forEach(r =>
      console.log(`   ${YEL}▲ ID:${r.product_id}  Table:"${r.product_table_name}"  Entry:"${r.entry_name}"  (${r.count} entries)${RST}`)
    );
  }
  console.log();

  // ─── 6. All products price summary table ──────────────────────────
  const [allStats] = await db.query(`
    SELECT 
      pe.product_id as ID,
      p.name as Product,
      COUNT(*) as Entries,
      ROUND(MIN(price),2) as Min,
      ROUND(AVG(price),2) as Avg,
      ROUND(MAX(price),2) as Max,
      ROUND((MAX(price)-MIN(price))/AVG(price)*100,1) as Swing
    FROM price_entries pe
    LEFT JOIN products p ON pe.product_id = p.id
    GROUP BY pe.product_id, p.name
    ORDER BY Swing DESC
  `);
  console.log(`${BOLD}[6] Full Product Price Summary (sorted by price swing)${RST}`);
  console.log(`   ${'ID'.padEnd(5)} ${'Product'.padEnd(35)} ${'E'.padEnd(4)} ${'Min'.padEnd(10)} ${'Avg'.padEnd(10)} ${'Max'.padEnd(10)} ${'Swing%'}`);
  console.log(`   ${'─'.repeat(85)}`);
  allStats.forEach(r => {
    const swingColor = r.Swing > 50 ? RED : r.Swing > 25 ? YEL : GRN;
    console.log(`   ${String(r.ID).padEnd(5)} ${(r.Product||'?').substring(0,34).padEnd(35)} ${String(r.Entries).padEnd(4)} ₹${String(r.Min).padEnd(9)} ₹${String(r.Avg).padEnd(9)} ₹${String(r.Max).padEnd(9)} ${swingColor}${r.Swing}%${RST}`);
  });

  console.log(`\n${BOLD}${CYN}══════════════════════════════════════════════${RST}`);
  console.log(`${BOLD}Diagnostics Complete.${RST}\n`);
  process.exit(0);
}

runDiagnostics().catch(err => {
  console.error('DB Error:', err.message);
  process.exit(1);
});
