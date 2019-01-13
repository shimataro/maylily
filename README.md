# MayLily

[![Build Status (Windows)][image-build-windows]][link-build-windows]
[![Build Status (macOS)][image-build-macos]][link-build-macos]
[![Build Status (Linux)][image-build-linux]][link-build-linux]
[![Release][image-release]][link-release]
[![Node.js version][image-engine]][link-engine]
[![License][image-license]][link-license]

distributable, serverless, and customizable unique ID generator based on [Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010/)

[![NPM](https://nodei.co/npm/maylily.svg?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/maylily/)

## How to install

Install by `npm`.

```bash
npm install -S maylily
```

## How to use

No external servers needed.
Just import and call `maylily()`!

### JavaScript

```javascript
var maylily = require("maylily").default;

function main() {
    // returns a Promise object
    maylily()
        .then(function(id) {
            // do something...
        })
        .catch(function(err) {
            // err is instance of Error
        });
}

main();
```

### ECMAScript 7 (async/await)

```javascript
import maylily from "maylily";

async function main() {
    try {
        // returns a Promise object
        const id = await maylily();
        // do something...
    }
    catch(err) {
        // err is instance of Error
    }
}

main();
```

## How to customize

| name | description | default |
|------|-------------|---------|
| `radix` | radix of generated ID (2-36) | 10 |
| `timeBase` | base time in unixtime(millisec) | 946684800000 (2000-01-01T00:00:00Z) |
| `machineId` | identifier of machine; must be unique in service | 0 |
| `machineBits` | required bits to represent machineId | 3 |
| `generatorId` | identifier of generator; must be unique in machine | process ID |
| `generatorBits` | required bits to represent generatorId | 10 |
| `sequenceBits` | required bits to represent sequence | 8 |

Generated value is stringified multiple precision integer (in specified radix).

```
 000001011100000101111010101110101010111101 001 1101101010 00000110
                                                          |--------| sequence number (uses sequenceBits bits)
                                               |----------|          generatorId (uses generatorBits bits)
                                           |---|                     machineId (uses machineBits bits)
|------------------------------------------|                         current time from timeBase in millisec
```

example:

```javascript
// holds the change until next change
maylily({
    timeBase: Date.parse("2017-01-01T00:00:00Z"),   // if your service starts in 2017, this is enough.
    machineBits: 1                                  // if required number machines are up to 2, this is enough.
});
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

[image-build-windows]: https://img.shields.io/appveyor/ci/shimataro/maylily/master.svg?label=Windows
[link-build-windows]: https://ci.appveyor.com/project/shimataro/maylily
[image-build-macos]: https://img.shields.io/travis/shimataro/maylily/master.svg?label=macOS
[link-build-macos]: https://travis-ci.org/shimataro/maylily
[image-build-linux]: https://img.shields.io/travis/shimataro/maylily/master.svg?label=Linux
[link-build-linux]: https://travis-ci.org/shimataro/maylily
[image-release]: https://img.shields.io/github/release/shimataro/maylily.svg
[link-release]: https://github.com/shimataro/maylily/releases
[image-engine]: https://img.shields.io/node/v/adjuster.svg
[link-engine]: https://nodejs.org/
[image-license]: https://img.shields.io/github/license/shimataro/maylily.svg
[link-license]: ./LICENSE
