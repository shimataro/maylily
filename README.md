# MayLily

[![Build Status (Windows)][image-build-windows]][link-build-windows]
[![Build Status (macOS)][image-build-macos]][link-build-macos]
[![Build Status (Linux)][image-build-linux]][link-build-linux]
[![Code Coverage][image-code-coverage]][link-code-coverage]
[![Release][image-release]][link-release]
[![Node.js version][image-engine]][link-engine]
[![License][image-license]][link-license]

[![NPM][image-npm]][link-npm]

distributable, serverless, and customizable unique ID generator based on [Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010/)

## Features

* distributable / scalable
* no external servers required
* customizable
* supports 2-36 radix
* supports multiple precision integer
* supports CommonJS, ES Modules, TypeScript

## How to install

Install by `npm`.

```bash
npm install -S maylily
```

## How to use

No external servers needed.
Just import and call `maylily()`!

### JavaScript

Traditional syntax.
This code will run on most JavaScript engine.

```javascript
var maylily = require("maylily");

(function() {
    // returns a Promise object
    maylily()
        .then(function(id) {
            // do something...
        })
        .catch(function(err) {
            // err is instance of Error
        });
}();
```

### ECMAScript 7

Modern syntax.
Async/await syntax is easy to read

```javascript
const maylily = require("maylily");

(async() => { // async syntax / arrow function
    try {
        const id = await maylily(); // await syntax
        // do something...
    }
    catch(err) {
        // err is instance of Error
    }
})();
```

### ES Modules / Babel / TypeScript (import, async/await)

VERY modern syntax!

```javascript
import maylily from "maylily"; // import syntax

(async() => {
    try {
        const id = await maylily();
        // do something...
    }
    catch(err) {
        // err is instance of Error
    }
})();
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
|------------------------------------------|                         current time from timeBase in millisec
                                           |---|                     machineId (uses machineBits bits)
                                               |----------|          generatorId (uses generatorBits bits)
                                                          |--------| sequence number (uses sequenceBits bits)
```

example:

```javascript
// keeps options until next change
maylily({
    timeBase: Date.parse("2017-01-01T00:00:00Z"),   // if your service starts in 2017, this is enough.
    machineBits: 1                                  // if required number machines are up to 2, this is enough.
});
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

[image-build-windows]: https://img.shields.io/appveyor/ci/shimataro/maylily/master.svg?label=Windows
[link-build-windows]: https://ci.appveyor.com/project/shimataro/maylily
[image-build-macos]: https://img.shields.io/travis/com/shimataro/maylily/master.svg?label=macOS
[link-build-macos]: https://travis-ci.com/shimataro/maylily
[image-build-linux]: https://img.shields.io/travis/com/shimataro/maylily/master.svg?label=Linux
[link-build-linux]: https://travis-ci.com/shimataro/maylily
[image-code-coverage]: https://img.shields.io/codecov/c/github/shimataro/maylily/master.svg
[link-code-coverage]: https://codecov.io/gh/shimataro/maylily
[image-release]: https://img.shields.io/github/release/shimataro/maylily.svg
[link-release]: https://github.com/shimataro/maylily/releases
[image-engine]: https://img.shields.io/node/v/adjuster.svg
[link-engine]: https://nodejs.org/
[image-license]: https://img.shields.io/github/license/shimataro/maylily.svg
[link-license]: ./LICENSE
[image-npm]: https://nodei.co/npm/maylily.svg?downloads=true&downloadRank=true&stars=true
[link-npm]: https://nodei.co/npm/maylily/
