// const xlsx = require('xlsx');

// /**
//  * 
//  * @description This document provides some default implementations for parsing data by the 104 protocol, but this does not mean that these functions meet the needs of your project, and the authors strongly recommend that you rewrite the methods according to your own data types
//  * 
//  */

// /**
//  * read the excel file under the specified path, for each row of data, specify the column name as the key for that row of data. 
//  * and combine the remaining columns into a json as the value of the key, such as {'16385': {name: '1#voltage', 'offset':0 }, '16386': ...}, 
//  * the function here is the default implementation,it is highly recommended to customize the function that meets your project
//  * @param {*} filePath 
//  * @param {*} key key of row data
//  * @returns 
//  */
// function fileMap(filePath, key) {
//     // read the excel file
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0]; // suppose the first worksheet is read
//     const worksheet = workbook.Sheets[sheetName];

//     // convert to json format
//     const jsonData = xlsx.utils.sheet_to_json(worksheet);

//     // process the data for each row
//     const multipleMap = {};

//     jsonData.forEach(row => {
//         const tmp = row[key];
//         delete row[key];

//         // create a new object with additional columns as values for the row
//         const rowValues = {};
//         Object.keys(row).forEach(column => {
//             rowValues[column] = row[column];
//         });

//         // add to the result object
//         multipleMap[tmp] = rowValues;
//     });

//     return multipleMap
// }

// /**
//  * @param {*} value 
//  * @param {*} row 
//  * @returns 
//  */
// function calculateValue(value, row) {
//     return value
// }
// /**
//  * default mapping，to distinguish multiple data source ip addresses
//  * it is recommended to modify the hostNameMapperRule() to suit your own needs
//  */
// class hostNameMapper{
//     constructor(hostName){
//         this.hostName = hostName;
//     }
//     hostName
//     hostNameMapperRule(){
//         //127.0.0.1 - 40
//         let arr = this.hostName.split('.')
//         return arr[3]
//     }
// }

// module.exports = {
//     fileMap: fileMap,
//     hostNameMapper: hostNameMapper
// }