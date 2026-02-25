const fs = require('fs');
let c = fs.readFileSync('c:/Users/ncbni/OneDrive/Desktop/PricePulse/pricepulse-frontend/src/App.jsx', 'utf8');

// 1. REVERSE THE CORRUPTED TAILWIND & JS CLASSES
c = c.replace(/fle🔴/g, 'flex ');
c = c.replace(/ma🔴/g, 'max ');
c = c.replace(/Ma🔴/g, 'Max ');
c = c.replace(/p🔴/g, 'px ');
c = c.replace(/inde🔴/g, 'index ');
c = c.replace(/Inde🔴/g, 'Index ');

// 2. FIX THE CURRENCY & MOJIBAKE
// Replace the weird currency blobs
c = c.replace(/ï¿½ ï¿½/g, 'Rs. ');
// Remove any stray ï¿½
c = c.replace(/ï¿½/g, '');

// Fix Market Classifications
c = c.replace(/xx Stable Market/g, '🟢 Stable Market');
c = c.replace(/x  High Instability/g, '🔴 High Instability');
c = c.replace(/xx Moderately Volatile/g, '🟡 Moderately Volatile');

// Fix Trend Directions
c = c.replace(/~ Stable Trend/g, '➡ Stable Trend');
c = c.replace(/x  Upward Trend/g, '📈 Upward Trend');
c = c.replace(/  \+\$\{/g, '▲ +${'); // Fix the template literal trend percent

// Fix Confidence Math
c = c.replace(/\(verified_nodes \/ 30\)   100/g, '(verified_nodes / 30) * 100');

// Fix Ledger Badges
c = c.replace(/xx Fair/g, '🟡 Fair');
c = c.replace(/xa Extreme Outlier/g, '🚨 Extreme Outlier');
c = c.replace(/x  Overpriced/g, '🔴 Overpriced');
c = c.replace(/= Best Deal/g, '🟢 Best Deal');

// Tooltip Fix
c = c.replace(/Â±/g, '±');

// Deduplicate any repeated Rs. 
c = c.replace(/Rs\. Rs\./g, 'Rs.');

fs.writeFileSync('c:/Users/ncbni/OneDrive/Desktop/PricePulse/pricepulse-frontend/src/App.jsx', c, 'utf8');
console.log('App.jsx has been safely reconstructed.');
