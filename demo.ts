import { Protocol, Lib, Data } from './src'

const conn1 = new Protocol('198.123.0.36', 2404, (data) => {

    for (let tmp of data) {
        console.log(tmp);
        
    }
})
conn1.connect()

const conn2 = new Protocol('198.123.0.1', 2404, (data) => {

    for (let tmp of data) {
        console.log(tmp);
    }
})
conn2.connect()


