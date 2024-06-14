// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');
// const directory = path.join(__dirname, '../data');


// const generateHash = (data) => {
//     return crypto.createHash('sha256').update(data).digest('hex');
// }

// const filename = 'dataa.json';
// const ecryptedFile = 'ecrypted_data.json';
// const genesisData = {
//     index: uuidv4(),
//     timestamp: new Date().toISOString(),
//     data: null,
//     hash: '0000000000000000000000000000000000000000000000000000000000000000',
//     previous_hash: null
// };


// const readJSONFromFile = (filename) => {
//     const filePath = path.join(directory, filename);

//     try {
//         if (fs.existsSync(filePath)) {
//             const fileContent = fs.readFileSync(filePath, 'utf8');
//             return JSON.parse(fileContent);
//         } else {
//             return null;
//         }
//     } catch (error) {
//         return error;
//     }
// };
// function saveJSONToFile(data, filename) {
//     const filePath = path.join(directory, filename);

//     try {
//         const jsonContent = JSON.stringify(data, null, 2);
//         fs.writeFileSync(filePath, jsonContent, 'utf8');
//         return true
//     } catch (error) {
//         console.error('Error writing to the file:', error);
//     }
// }

// const readData = readJSONFromFile('data.json');
// if(typeof(readData) == 'object') {
//     console.log(Object.keys(readData).length)
// }   
// saveJSONToFile([genesisData], 'data.json');

// // const data = readJSONFromFile('data.json');
// // console.log(data);

// // Genesis Data
// // saveJSONToFile(directory, filename, genesisData, (err) => {
// //     if (err) {
// //         console.error('Error saving JSON to file');
// //     } else {
// //         console.log('JSON saved successfully');
// //     }
// // });

// // const jsonObject = {
// //     index: uuidv4(),
// //     timestamp: new Date().toISOString(),
// //     data: {
// //         id_pemilih: uuidv4(),
// //         id_paslon: uuidv4(),
// //     },
// //     previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
// //     hash: '0000000000000000000000000000000000000000000000000000000000000000',
// // };

// // Menghitung hash berdasarkan data saat ini
// // jsonObject.hashsha256 = generateHash(
// //     jsonObject.index +
// //     jsonObject.timestamp +
// //     jsonObject.data +
// //     jsonObject.previous_hashsha256
// // );


// // saveJSONToFile(directory, filename, genesisData, (err) => {
// //     if (err) {
// //         console.error('Error saving JSON to file');
// //     } else {
// //         console.log('JSON saved successfully');
// //     }
// // });
