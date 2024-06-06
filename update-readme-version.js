const fs = require("fs");

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
// Read README.md
let readmeContent = fs.readFileSync("README.md", "utf-8");

// Get the version value
const version = packageJson.version;

// Version badge pattern
const badgePattern = /(\[npm\]\(https:\/\/img\.shields\.io\/badge\/npm-)(.+)(-blue\))/;

// Replace the version
readmeContent = readmeContent.replace(badgePattern, `$1${version}$3`);

// Write back to the README.md
fs.writeFileSync("README.md", readmeContent, "utf-8");
