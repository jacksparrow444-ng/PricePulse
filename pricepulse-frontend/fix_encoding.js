const fs = require('fs');
const filepath = 'c:\\Users\\ncbni\\OneDrive\\Desktop\\PricePulse\\pricepulse-frontend\\src\\App.jsx';
let content = fs.readFileSync(filepath, 'utf8');

// The file was read as Windows-1252 and saved as UTF-8. 
// We can reverse it by treating the UTF-8 string as latin1, converting to buffer, and parsing as utf8.
const recovered = Buffer.from(content, 'latin1').toString('utf8');

// Also addressing the DYI, MODERATELY VOLATILE typo.
const fixedTypo = recovered.replace(/DYI,\s*MODERATELY VOLATILE/gi, 'Moderately Volatile');
const finalFix = fixedTypo.replace(/ðŸŸ¡/g, '🟡').replace(/ðŸš¨/g, '🚨').replace(/ðŸ”´/g, '🔴');

fs.writeFileSync(filepath, finalFix, 'utf8');
console.log('Mojibake reversed successfully.');
