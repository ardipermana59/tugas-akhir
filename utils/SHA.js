const CryptoJS = require('crypto-js');

/**
 * Generates a SHA-256 hash of the given data.
 * @param {string} data - The input data to hash.
 * @returns {string} - The SHA-256 hash of the input data, encoded in hexadecimal.
 */
const generateHash = (data) => {
    // Compute the SHA-256 hash of the input data
    const hash = CryptoJS.SHA256(data);

    // Convert the hash to a hexadecimal string
    return hash.toString(CryptoJS.enc.Hex);
}

module.exports = {
    generateHash
};
