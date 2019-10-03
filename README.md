# configurable-date-input-polyfill

[![Build Status](https://travis-ci.org/KreutzerCode/configurable-date-input-polyfill.svg?branch=master)](https://travis-ci.org/KreutzerCode/configurable-date-input-polyfill)
[![npm version](https://badge.fury.io/js/configurable-date-input-polyfill.svg)](https://badge.fury.io/js/configurable-date-input-polyfill)
[![dependencies Status](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill/status.svg)](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill)
[![devDependencies Status](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill/dev-status.svg)](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill?type=dev)

Just include this simple script and IE, Firefox, and OS X Safari will support `<input type="date">`, without any dependencies, not even jQuery!

The last Date-Input-Polyfill you will ever need. A fancy and lightweight date input with a high number of configuration options for all needs. Supports European and American formatting and many other localisations.

Forked from [date-input-polyfill](https://github.com/jcgertig/date-input-polyfill). Continuing as a separate project.


[VIEW DEMO HERE](https://kreutzercode.github.io/configurable-date-input-polyfill/)

## Features

* Easily Stylable. [These are the default styles](https://github.com/KreutzerCode/configurable-date-input-polyfill/blob/master/configurable-date-input-polyfill.scss),
which you may override with your own.
* Accessibility friendly with Keyboard Shortcuts. Full arrow controls `Up/Down/Left/Right` to increment/decrement the selected date.
`Esc` to hide the datepicker.
* Easy Localization. Specify the datepicker's locale by setting the
`lang` attribute of the `input` element. The Localisation is easy to extend with own items.
* Configure display format at will. Specify the display format by setting either the
`date-format` or `data-date-format` attribute of the `input` element.
* Configure Day Matrix Format. Specify the Format of the Day Matrix. By setting the 
`data-matrix-format` attribute, you can set the Matrix Format to Europe or US standards.
* Polyfill can be added with class `date-polyfill`.
* Polyfill works with `valueAsDate` and `valueAsNumber`.
[Learn more about these properties.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#property-valueasdate)
They behave as getters and setters.


## Install
`npm install --save configurable-date-input-polyfill`

Add to your project:

* **Webpack/Browserify:** `require('configurable-date-input-polyfill');`

    or alongside **Babel:** `import 'configurable-date-input-polyfill';`

* **Script Tag:** Copy `configurable-date-input-polyfill.dist.js` from `node_modules` and
include it anywhere in your HTML.
```html
<script src="configurable-date-input-polyfill.dist.js"></script>

<script src="node_modules/configurable-date-input-polyfill/configurable-date-input-polyfill.dist.js"></script>
```


* This package supports **AMD**.

## Localization
* You can easily set a specific locale for each date input. The default locale is `en`.
```html
<!--default-->
<input type="date" lang="en" />

<input type="date" lang="fr" />
```

## Formatting
* You can easily specify the display format by setting either the
`date-format` or `data-date-format` attribute of the `input` element.  The default format is `yyyy-mm-dd`. 
[Available options list.](https://github.com/felixge/node-dateformat#mask-options)
```html
<!--default-->
<input type="date" date-format="yyyy-mm-dd" />

<input type="date" data-date-format="mm/dd/yyyy" />

<input type="date" data-date-format="dd.mm.yyyy" />
```

## Matrix Formatting
Specify the Format of the DatePicker Matrix. With the data-matrix-format attribute you can change the Day starting the week between Saturday and Monday.
```html
<!--default-->
<input type="date" data-matrix-format="us" />

<!--europe-->
<input type="date" data-matrix-format="eu" />
```

## Browser support
#### Desktop
* Chrome
* Safari
* Firefox
* Opera
* Edge
* Internet Explorer 10+

#### Mobile
* iOS Safari 7+


## Contributing

### Build
Run `npm run build` to edit the Project

### Production
Run `npm run production` to do an optimization and minification to the final Project

