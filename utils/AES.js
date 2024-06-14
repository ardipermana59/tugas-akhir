const CryptoJS = require('crypto-js');

/**
 * Derives a valid AES key from the given input key by hashing it to a fixed length.
 * @param {string} key - The input key.
 * @returns {CryptoJS.lib.WordArray} - The derived key of valid length for AES (16 bytes).
 */
const deriveKey = (key) => {
    // Hash the key to get a 256-bit hash and take the first 16 bytes (128 bits) for AES-128
    const hashedKey = CryptoJS.SHA256(key);
    return CryptoJS.lib.WordArray.create(hashedKey.words.slice(0, 4)); // 16 bytes key for AES-128
};

/**
 * Encrypts data using AES encryption with CBC mode and PKCS7 padding.
 * @param {string} data - The plaintext data to encrypt.
 * @param {string} key - The input key of any length.
 * @returns {string} - The encrypted data encoded in Base64, with IV prepended.
 */
const encrypt = (data, key) => {
    const aesKey = deriveKey(key);
   
    // Generate a random Initialization Vector (IV) of 16 bytes (128 bits)
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt the data using AES with CBC mode and PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(data, aesKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Concatenate the IV and the ciphertext, then encode in Base64
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
};

/**
 * Decrypts AES-encrypted data using CBC mode and PKCS7 padding.
 * @param {string} encryptedData - The encrypted data in Base64 format, with IV prepended.
 * @param {string} key - The input key of any length.
 * @returns {string} - The decrypted plaintext data.
 */
const decrypt = (encryptedData, key) => {
    const aesKey = deriveKey(key);

    // Decode the Base64-encoded string to get the IV and ciphertext
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);

    // Extract the IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4));

    // Extract the ciphertext (remaining bytes)
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4));

    // Decrypt the ciphertext using AES with CBC mode and PKCS7 padding
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        aesKey,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    // Convert the decrypted WordArray to a UTF-8 string and return it
    return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
    encrypt,
    decrypt
};
