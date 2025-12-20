const bcrypt = require('bcryptjs');
const fs = require('fs');

async function main() {
    const hash = await bcrypt.hash('Password123!', 10);
    fs.writeFileSync('hash.txt', hash.trim());
    console.log("Hash written to hash.txt");
}

main();
