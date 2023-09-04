// const fs = require('fs');
// const axios = require('axios');

// module.exports = function (Lib60870) {
//     // The Function Is Used To Asynchronously Append A Write File And Return A Promise
//     Lib60870.prototype.appendToFile = function appendToFile(filePath, data) {
//         return new Promise((resolve, reject) => {
//             fs.appendFile(filePath, JSON.stringify(data) + '\n', err => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//     }

//     // Accepts The Data And Sends It To The Specified Url Via A Post Request
//     Lib60870.prototype.sendData = function sendData(url, data) {
//         axios.post(url, data)
//             .then(response => {
//                 console.log('Response:', response.data);
//             })
//             .catch(error => {
//                 console.error('Error:', error.message);
//             });
//     }
// }

