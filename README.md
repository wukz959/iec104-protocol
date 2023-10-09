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

## Options

### autoReconnect 

By setting the autoReconnect option, you can automatically reconnect when the connection is disconnected

```ts
import { Protocol, Option } from 'iec104-protocol'
/*
If the connection is disconnected, the reconnection is automatically attempted every 10,000 ms by default. If the reconnection fails for 10 times, the reconnection interval changes to 60,000ms
*/
const option:Option = { autoReconnect: true}
const conn = new Protocol('198.123.0.1', 2404, (data) => {
    for (const tmp of data) {
        console.log(tmp)
    }
}, option)
conn.connect()

```

### quiet	

The code will output some debugging information by default, you can choose to disable it by setting the quiet option to true

```ts
import { Protocol, Option } from 'iec104-protocol'

const option:Option = { quiet: true }
const conn = new Protocol('198.123.0.1', 2404, (data) => {
    for (const tmp of data) {
        console.log(tmp)
    }
}, option)

conn.connect()

```

