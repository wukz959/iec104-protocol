# IEC104-PROTOCOL

Only need to set a simple IP and PORT to achieve fast access and data analysis of 104 protocol

## Quick Start

```js
$ npm i iec104-protocol
```

## Examples

For the connection you need, you only need to set the ip and port to achieve fast data collection

```tsx
import {Protocol} from 'iec104-protocol'

/* 
Before starting the program, you need to set the host IP address on the host. The program does not provide the host IP address setting by default
*/
const conn1 = new Protocol('198.123.0.1', 2404, (data) => {
    for (const tmp of data) {
        console.log(tmp)
    }
})
conn1.connect()

const conn2 = new Protocol('198.123.0.2', 2404, (data) => {

    for (const tmp of data) {
        console.log(tmp)
    }
})
conn2.connect()

```



​	
