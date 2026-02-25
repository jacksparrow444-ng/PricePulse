const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/matri🔴for/g, 'matrix for');
code = code.replace(/matri🔴to/g, 'matrix to');

code = code.replace(/text: '\x1A  High Instability'/g, "text: '🚨 High Instability'");
code = code.replace(/trendDirection = '\x1A  Upward Trend'/g, "trendDirection = '📈 Upward Trend'");
code = code.replace(/text: '\x1A  Overpriced'/g, "text: '⚠️ Overpriced'");

code = code.replace(/Price \(\x1A\)/g, 'Price (₹)');
code = code.replace(/>\x1A<\/span>/g, '>₹</span>');
code = code.replace(/\x1A\{analytics\.fair_range\.low\}/g, '₹{analytics.fair_range.low}');
code = code.replace(/\x1A\{analytics\.fair_range\.high\}/g, '₹{analytics.fair_range.high}');
code = code.replace(/\x1A\{analytics\.min_price\}/g, '₹{analytics.min_price}');
code = code.replace(/\x1A\{analytics\.max_price\}/g, '₹{analytics.max_price}');
code = code.replace(/\x1ARs\. \{shop\.price\}/g, '₹{shop.price}');

code = code.replace(/\x1A/g, '₹');

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed src/App.jsx successfully');
