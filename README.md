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
import NProgress from 'nprogress-es'
import 'nprogress-es/dist/nprogress.css'

NProgress.start()
NProgress.done()
```

You can also use `.set()`.

```typescript
NProgress.set(0) // same as NProgress.start()
NProgress.set(100) // same as NProgress.end()
```