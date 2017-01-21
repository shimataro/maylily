MayLily
===

distributable, serverless, and customizable unique ID number generator based on [Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010/)

## How to use
No external libraries or servers needed.
Just import and call `maylily()`!

### JavaScript
```js
var maylily = require("maylily");

// returns a Promise object
maylily()
    .then(function(id) {
        // do something...
    })
    .catch(function(err) {
        // err is instance of Error
    });
```

### ECMAScript 7 (async/await)
```js
import maylily from "maylily";
try {
    // returns a Promise object
    const id = await maylily();
    // do something...
}
catch(err) {
    // err is instance of Error
}
```

## How to customize

| name | description | default |
|------|-------------|---------|
| `timeBase` | base time in unixtime(millisec) | 946684800000 (2000-01-01T00:00:00Z) |
| `machineId` | identifier of machine; must be unique in service | 0 |
| `machineBits` | required bits to represent machineId | 2 |
| `generatorId` | identifier of generator; must be unique in machine | process ID |
| `generatorBits` | required bits to represent generatorId | 7 |
| `sequenceBits` | required bits to represent sequence | 5 |

Generated value is 53-bit integer.
```
 001011100000101111010101110101010111101 01 1101100 00010
                                                   |-----| sequence number (uses sequenceBits bits)
                                           |-------|       generatorId (uses generatorBits bits)
                                        |--|               machineId (uses machineBits bits)
|---------------------------------------|                  current time from timeBase in millisec (uses remaining bits)
```

example:
```js
// holds the change until next change
maylily({
    timeBase: Date.parse("2017-01-01T00:00:00Z"),   // if your service starts in 2017, this is enough.
    machineBits: 1,                                 // if required machines are up to 2, this is enough.
    generatorBits: 0                                // if running process is only 1, this is enough.
});
```

## Release note

* 2017-01-21 *version 1.0.0*
	* First release.
