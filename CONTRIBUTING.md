# Contributing

[Create a new issue](https://github.com/gidztech/simple-list-item-range-selector/issues) if you think something is broken,
you have feature request, or just a have a question.

Create a pull request if you have any changes you would like to make. It is worth checking with me a head of time.

## Build
- Run `npm install` to install dependencies
- Run `npn run build` to build the app. This uses webpack to bundle a minified UMD module that is transpiled to ES5

## Build Demo
- Run `npn run build-demo` to build the demo. This is used for running the tests and the public demo

## Development
- Run `npm run dev` to run a webpack hot reload dev server using a sample page found in the `dev` folder

## Tests
- Run `npm run test` to run all the tests. This script does three things: 
1. Build the demo
2. Transpile the test scripts to ES5 to run in PhantomJS v2.1 (to be omitted once PhantomJS 2.5 is released)
3. Run PhantomFlow tests
