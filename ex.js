const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

// Fungsi untuk mengenkripsi data menggunakan AES-256 dalam mode CBC
function encryptData(data, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// Fungsi untuk menghasilkan hash SHA-256 dari data
function generateHash(data) {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// Fungsi untuk mengenkripsi data transaksi dalam format JSON
function encryptTransactionData(transactionData, key) {
    const jsonData = JSON.stringify(transactionData);
    return encryptData(jsonData, key);
}

// Fungsi untuk membuat blok baru dalam blockchain
function createBlock(pemilih_id, data, previous_hash, key) {
    const encryptedData = encryptTransactionData(data, key);
    const block = {
        id: uuidv4(),
        pemilih_id: pemilih_id,
        data: encryptedData,
        previous_hash: previous_hash,
        created_at: new Date().toISOString()
    };
    const blockString = JSON.stringify(block, Object.keys(block).sort());
    block.hash = generateHash(blockString);
    return block;
}

// Membuat genesis block
function createGenesisBlock() {
    const block = {
        id: uuidv4(),
        pemilih_id: null,
        data: null,
        previous_hash: null,
        created_at: new Date().toISOString()
    };
    const blockString = JSON.stringify(block, Object.keys(block).sort());
    block.hash = generateHash(blockString);
    return block;
}

// Contoh penggunaan
const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
const genesisBlock = createGenesisBlock();
console.log("Genesis Block:");
console.log(genesisBlock);

const previous_hash = genesisBlock.hash;
const data = { "kandidat_id": "ed21e21e-dd85-408b-9fae-98c897397ab6" };
console.log("Data sebelum enkripsi:");
console.log(data);

const block = createBlock("bba62a03-b577-4969-9583-61d4ebcc476c", data, previous_hash, key);
console.log("Block baru dengan data terenkripsi:");
console.log(block);
