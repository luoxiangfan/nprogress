# nprogress
[nprogress](https://github.com/rstacruz/nprogress) rewrite with typescript

## Installation

Use `npm` to install.

```sh
$ npm install nprogress-es
```

## Basic usage

Simply use `.start()` and `.done()` to control the start and end.

```typescript
import Progress from 'nprogress-es'
import 'nprogress-es/dist/nprogress.css'

Progress.start()
Progress.done()
```

You can also use `.set()`.

```typescript
Progress.set(0) // same as Progress.start()
Progress.set(100) // same as Progress.end()
```