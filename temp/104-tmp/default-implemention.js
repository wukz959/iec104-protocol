// const xlsx = require('xlsx');

// /**
//  * 
//  * @description 本文件为104协议解析数据时提供一些默认实现，但这不意味着这些函数符合您的项目需求，作者强烈建议您根据自己数据类型对方法进行重写
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
//  * 采集到的值不一定是您所需要的，所以需要对数据进行处理，此处提供一个默认实现，您可配置连接的SetASDUReceivedHandler时指定数据转换方式
//  * 但需要注意的是，您所设置的数据转换方式有可能将对当前连接产生的全部数据产生影响，若无把握，建议
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