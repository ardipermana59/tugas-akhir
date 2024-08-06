const CryptoJS = require('crypto-js')

/**
 * Generates a SHA-256 hash of the given data.
 * @param {string} data - The input data to hash.
 * @returns {string} - The SHA-256 hash of the input data, encoded in hexadecimal.
 */
const generateHash = (data) => {
    // Compute the SHA-256 hash of the input data
    const hash = CryptoJS.SHA256(JSON.stringify(data))

    // Convert the hash to a hexadecimal string
    return hash.toString(CryptoJS.enc.Hex)
}

/**
 * Verifies if a given hash matches the hash of the input data.
 * @param {string} data - The input data to hash and verify.
 * @param {string} hashToVerify - The hash to compare against.
 * @returns {boolean} - True if the hash of the input data matches hashToVerify, false otherwise.
 */
const verifyHash = (data, hashToVerify) => {
    // Generate hash of the input data
    const generatedHash = generateHash(data)

    // Compare generated hash with the provided hash to verify
    return generatedHash === hashToVerify
}

module.exports = {
    generateHash,
    verifyHash
}
