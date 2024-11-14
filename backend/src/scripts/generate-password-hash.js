// backend/scripts/generate-password-hash.js
const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'Password@123'; // The password we want to use
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    console.log('Generated hash:', hash);
}

generateHash();