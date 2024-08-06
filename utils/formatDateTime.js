/**
 * Format date and time to 'YYYY-MM-DD HH:mm:ss' format.
 * @example
 * const date = new Date(); // 2024-06-19T16:30:59.331Z
 * const formattedDateTime = formatDateTime(date);
 * console.log(formattedDateTime); // Output: '2024-06-19 16:30:59'
 * 
 * @param {Date} date - The date object to format.
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

module.exports = {
    formatDateTime
}
