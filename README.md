# Filename Incrementer

Tools to Increment filenames.

## Usage

Install with npm:

```
npm install filename-incrementer
```

Example:

```javascript
var incr = require('filename-incrementer');

// Get filename with incremented value.
incr.getNewName('path/filename-###.ext')
  .then(name => console.log(name));

// logs: 'filename-3.ext', assuming there was already a filename-2.ext in that directory
```

## Methods

Almost all methods accept the two same parameters:
* `{string} path` - Path to files, with '###' (or pattern described in `incrPattern`) where the incrementer is set, e.g. '/path/filename-###.ext'.
* `{string} [incrPattern]` - If for one reason you want to use a different pattern than '###' to match the incrementer's place in the filename, you provide it here.

Exampels below assume the following file structure:

```
directory
   |- example-3.ext
   |- example-4.ext
   |- file-3.ext
   |- file-4.ext
   |- test-1.ext
   |- test-2.ext
   |- test-3.ext
```

The first two methods will probably be the most usefull ones:

### getNew

Get incremented value for files matching the pattern.

Signature:

`getNew(path: string, incrPattern: string = '###'): Promise<number>`

Examples:

```javascript
incr.getNew('directory/file-###.ext')
  .then(value => console.log(value));

// logs: 5


incr.getNew('directory/test-@@.ext', '@@')
  .then(value => console.log(value));

// logs: 4
```

### getNewName

Get filename with incremented value.

Signature:

`getNewName(path: string, incrPattern: string = '###'): Promise<string>`

Examples:

```javascript
incr.getNewName('directory/file-###.ext')
  .then(name => console.log(name));

// logs: 'file-5.ext'


incr.getNewName('directory/test-@@.ext', '@@')
  .then(name => console.log(name));

// logs: 'test-4.ext'
```

### getMax

Get max. incrementer value for files matching the pattern.

Signature:

`getMax(path: string, incrPattern: string = '###'): Promise<number>`

Examples:

```javascript
incr.getMax('directory/file-###.ext')
  .then(value => console.log(value));

// logs: 4


incr.getMax('directory/test-@@.ext', '@@')
  .then(value => console.log(value));

// logs: 3
```

### getMin

Get min. incrementer value for files matching the pattern.

Signature:

`getMin(path: string, incrPattern: string = '###'): Promise<number>`

Example:

```javascript
incr.getMin('directory/example-###.ext')
  .then(value => console.log(value));

// logs: 3
```

### getFiles

Get file paths matching the pattern.

Signature:

`getFiles(path: string, incrPattern: string = '###'): Promise<string[]>`

Example:

```javascript
incr.getFiles('directory/example-###.ext')
  .then(files => console.log(files));

// logs: [
//   'directory/example-3.ext',
//   'directory/example-4.ext'
// ]
```

### getFilesMap

Get map of paths matching the pattern and their incrementer value.

Signature:

`getFilesMap(path: string, incrPattern: string = '###'): Promise<{[path: string]: number}>`

Example:

```javascript
incr.getFiles('directory/example-###.ext')
  .then(map => console.log(map));

// logs: {
//   'directory/example-3.ext': 3,
//   'directory/example-4.ext': 4
// }
```

### getMatchPattern

Get glob or regexp matching pattern.

Signature:

`getMatchPattern(type: 'glob'|'regexp', path: string, incrPattern: string = '###'): string`

Examples:

```javascript
let ptrn1 = incr.getMatchPattern('glob', 'directory/file-###.ext');

console.log(ptrn1);

// logs: 'directory/file-+([0-9]).ext'


let ptrn2 = incr.getMatchPattern('regexp', 'directory/test-@@.ext', '@@');

console.log(ptrn2);

// logs: '^directory/test\-([0-9]+)\.ext$'
```
