const fs = require('fs');
const filepath = 'c:\\Users\\ncbni\\OneDrive\\Desktop\\PricePulse\\pricepulse-frontend\\src\\App.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const recovered = Buffer.from(content, 'latin1').toString('utf8');
const fixedTypo = recovered.replace(/DYI,\s*MODERATELY VOLATILE/gi, 'Moderately Volatile');
const finalFix = fixedTypo.replace(/ðŸŸ¡/g, '🟡').replace(/ðŸš¨/g, '🚨').replace(/ðŸ”´/g, '🔴');

fs.writeFileSync(filepath, finalFix, 'utf8');
console.log('Mojibake reversed successfully.');
