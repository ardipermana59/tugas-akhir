const CryptoJS = require('crypto-js')

/**
 * Derives a valid AES key from the given input key by hashing it to a fixed length.
 * @returns {CryptoJS.lib.WordArray} - The derived key of valid length for AES (16 bytes).
 */
const deriveKey = (key) => {
    if (!key) {
        return null
    }

    // Hash the key to get a 256-bit hash and take the first 16 bytes (128 bits) for AES-128
    const hashedKey = CryptoJS.SHA256(key)

    return CryptoJS.lib.WordArray.create(hashedKey.words.slice(0, 4)) // 16 bytes key for AES-128
}

/**
 * Encrypts data using AES encryption with CBC mode and PKCS7 padding.
 * @param {string} data - The plaintext data to encrypt.
 * @returns {string} - The encrypted data encoded in Base64, with IV prepended.
 * 
 * @example
 * const plaintext = 'Hello, world!';
 * const encryptedData = encrypt(plaintext);
 * console.log(encryptedData); // Output: 'wZ2nQzaGewTff5mUyF4YbA==:N9sD4d8ahmPx6B... (Base64 string)'
 */
const encrypt = (data, key) => {
    const aesKey = deriveKey(key)

    if (!aesKey) {
        return null
    }

    // Generate a random Initialization Vector (IV) of 16 bytes (128 bits)
    const iv = CryptoJS.lib.WordArray.random(16)

    // Encrypt the data using AES with CBC mode and PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), aesKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

    // Concatenate the IV and the ciphertext, then encode in Base64
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64)
}

/**
 * Decrypts AES-encrypted data using CBC mode and PKCS7 padding.
 * @param {string} encryptedData - The encrypted data in Base64 format, with IV prepended.
 * @returns {string} - The decrypted plaintext data.
 * 
 * @example
 * const encryptedData = 'wZ2nQzaGewTff5mUyF4YbA==:N9sD4d8ahmPx6B... (Base64 string)';
 * const decryptedData = decrypt(encryptedData);
 * console.log(decryptedData); // Output: 'Hello, world!'
 */
const decrypt = (encryptedData, key) => {
    try {
        const aesKey = deriveKey(key)
        if (!aesKey) {
            return null
        }

        // Decode the Base64-encoded string to get the IV and ciphertext
        const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData)

        // Extract the IV (first 16 bytes)
        const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4))

        // Extract the ciphertext (remaining bytes)
        const ciphertext = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4))

        // Decrypt the ciphertext using AES with CBC mode and PKCS7 padding
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            aesKey,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        )

        // Convert the decrypted WordArray to a UTF-8 string
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

        // Check if the decrypted text is valid
        if (decryptedText) {
            return JSON.parse(decryptedText)
        } else {
            throw new Error('Decryption failed: incorrect key or corrupted data')
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    encrypt,
    decrypt
}
