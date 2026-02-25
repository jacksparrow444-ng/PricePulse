const fs = require('fs');

const appPath = 'c:\\Users\\ncbni\\OneDrive\\Desktop\\PricePulse\\pricepulse-frontend\\src\\App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

// The file might contain corrupted UTF-8 or raw bytes.
// We will forcefully replace any â‚¹ or plain ₹ with &#8377;
app = app.replace(/â‚¹/g, '&#8377;');
app = app.replace(/₹/g, '&#8377;');

// Fix the DYI typo
app = app.replace(/DYI,\s*MODERATELY VOLATILE/gi, 'Moderately Volatile');
app = app.replace(/ðŸŸ¡ Moderately Volatile/gi, '🟡 Moderately Volatile');
app = app.replace(/ðŸŸ¢ Stable Market/gi, '🟢 Stable Market');
app = app.replace(/ðŸ”´ High Instability/gi, '🔴 High Instability');
app = app.replace(/ðŸš¨ Extreme Outlier/gi, '🚨 Extreme Outlier');
app = app.replace(/ðŸ”´ Overpriced/gi, '🔴 Overpriced');
app = app.replace(/ðŸŸ¡ Fair/gi, '🟡 Fair');

// Replace any leftover mojibake emoji blobs
app = app.replace(/ðŸŸ¢/g, '🟢');
app = app.replace(/ðŸ”´/g, '🔴');
app = app.replace(/ðŸŸ¡/g, '🟡');
app = app.replace(/âž¡/g, '➡');
app = app.replace(/ðŸ“ˆ/g, '📈');
app = app.replace(/â–²/g, '▲');

fs.writeFileSync(appPath, app, 'utf8');
console.log("App.jsx has been sanitized.");

// Set up server.js header injection
const serverPath = 'c:\\Users\\ncbni\\OneDrive\\Desktop\\PricePulse\\pricepulse-backend\\server.js';
let server = fs.readFileSync(serverPath, 'utf8');

if (!server.includes('charset=utf-8')) {
    server = server.replace(
        "app.use(express.json());",
        "app.use(express.json());\napp.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); next(); });"
    );
}

// Ensure DB string casting to decimal handles the 160.00 discrepancy
server = server.replace(
    "ORDER BY pe.price ASC",
    "ORDER BY CAST(pe.price AS DECIMAL(10,2)) ASC"
);

fs.writeFileSync(serverPath, server, 'utf8');
console.log("server.js has been sanitized.");
