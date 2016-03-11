# nodep-date-input-polyfill
Just include this simple script and IE, Firefox, and OS X Safari will support `<input type="date">`, without any dependencies, not even jQuery!

Support dynamically created inputs, so can be used in single page applications.

Forked from [html5-simple-date-input-polyfill](https://www.npmjs.com/package/html5-simple-date-input-polyfill). Continuing as a separate project.

## Install
`npm install --save nodep-date-input-polyfill`

Add to your project:

* **Webpack/Browserify:** `require('nodep-date-input-polyfill');`

    or alongside **Babel:** `import 'nodep-date-input-polyfill';`

* **Script Tag:** Copy `nodep-date-input-polyfill.dist.js` from `node_modules` and
include it anywhere in your HTML.

## Features
* **Easily Stylable:** [These are the default styles](https://github.com/brianblakely/nodep-date-input-polyfill/blob/master/nodep-date-input-polyfill.scss),
which you may override with your own.

* **Polyfills `valueAsDate` and `valueAsNumber`:**
[Learn more about these properties.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#property-valueasdate)
They behave as getters and setters.

* **Keyboard Shortcuts:** `Esc` will hide the datepicker. `Up/Down` will
decrement/increment the date by one day.

## Contributing

### Local Development
Run `webpack-dev-server --host $IP --port $PORT`

### Build
Run `webpack --devtool=none`
