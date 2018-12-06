# nim-loader
A [Webpack][webpack-home] loader for the [Nim][nim-home] language.

# How do I use it?
First of all, make sure that you have [Nim installed][nim-installation].  
Then install [nim-loader]:
```sh
npm install nim-loader
```
Next, configure your `webpack.config.js` to use this loader:
```js
module: {
  ...
  rules: [
    ...
    {
      test: /\.nim$/,
      use: [
        {
          loader: 'nim-loader',
          options: {
            flags: ['--nim-compiler-flags']
          }
        }
      ]
    }
    ...
  ]
  ...
}
```
Of course, `options` is optional. If you don't want advanced behavior you can
use the terse syntax:
```js
module: {
  ...
  rules: [
    ...
    {
      test: /\.nim$/,
      loader: 'nim-loader'
    }
    ...
  ]
  ...
}
```
Finally, `import` your Nim file from your Javascript code.
```js
import nimModule from './path/to/nim/file/module.nim'
nimModules.exportedFunction("With arguments")
```
# Caveats
While Nim has native concepts of exporting functions and modules, these do not
translate to the Javascript compile target. Instead, you are encouraged to use
CommonJS module exports. This requires that your Nim code "imports" the `module` object. Doing so looks like this:
```nim
import jsffi
var module {. importc, nodecl .}: JsObject
...
module.exports = exportObject
```
where `exportObject` is of type `JsObject`. Note that `modules.exports` is
already initialized to an empty object, so you can also do something like:
```nim
...
module.exports.someFunction = functionImpl
module.exports.someValue = nimValue
...
```
to register your exports one-by-one.

# Examples
If you're still confused, hopefully the [examples][nim-loader-demo] can help.

[webpack-home]: https://webpack.js.org/
[nim-home]: https://nim-lang.org/
[nim-installation]: https://nim-lang.org/install.html
[nim-loader]: https://github.com/bmollot/nim-loader
[nim-loader-demo]: https://github.com/bmollot/nim-loader-demo