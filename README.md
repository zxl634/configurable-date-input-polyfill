# configurable-date-input-polyfill

[![Build Status](https://travis-ci.org/KreutzerCode/configurable-date-input-polyfill.svg?branch=master)](https://travis-ci.org/KreutzerCode/configurable-date-input-polyfill)
[![Monthly downloads](https://img.shields.io/npm/dm/configurable-date-input-polyfill.svg)](https://img.shields.io/npm/dm/configurable-date-input-polyfill)
[![NPM version](https://badge.fury.io/js/configurable-date-input-polyfill.svg)](https://badge.fury.io/js/configurable-date-input-polyfill)
[![Dependencies Status](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill/status.svg)](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill)
[![DevDependencies Status](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill/dev-status.svg)](https://david-dm.org/KreutzerCode/configurable-date-input-polyfill?type=dev)

The last date-input polyfill you will ever need. A fancy and lightweight date input with a high number of configuration options for all needs. Supports any calendar format and contains a large amount of localizations.

Just include this simple script and IE, Firefox, and OS X Safari will support `<input type="date">`, without any dependencies, not even jQuery!

Forked from [date-input-polyfill](https://github.com/jcgertig/date-input-polyfill). Continuing as a separate project.


[VIEW DEMO HERE](https://kreutzercode.github.io/configurable-date-input-polyfill/)

## Features

* Easily Stylable. [These are the default styles](https://github.com/KreutzerCode/configurable-date-input-polyfill/blob/master/configurable-date-input-polyfill.scss),
which you may override with your own.
* Accessibility friendly with Keyboard Shortcuts. Full arrow controls `Up/Down/Left/Right` to increment/decrement the selected date.
`Esc` to hide the datepicker.
* Easy Localization. Specify the datepicker's locale by setting the
`lang` attribute of the `input` element. The Localisation is easy to extend with own items.
* Limit the range to choose from by setting the `min` and `max` attributes.
* Configure display format at will. Specify the display format by setting either the
`date-format` or `data-date-format` attribute of the `input` element.
* Configure the first day of the week. By setting the `data-first-day` attribute you 
can set the calendar matrix format to any standard. Value of this attribute can be `sa`,`su` or `mo`.
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
* You can easily set a specific locale for each date input. [The list of available languages](https://github.com/KreutzerCode/configurable-date-input-polyfill/blob/master/localisations.js) can easily be extended by your own.
```html
<!--default dont need to be specified-->
<input type="date" lang="en" />

<input type="date" lang="fr" />
```

## Min and Max attributes
* Set the range to choose from differently for every input you faced with by setting the `min` and `max` attributes.
```html
<!--default dont need to be specified-->
<input type="date" min="1800" max="2200"/>

<!--custom-->
<input type="date" min="2000" max="2030" />
```

## Formatting
* You can easily specify the display format by setting either the
`date-format` or `data-date-format` attribute of the `input` element.  The default format is `yyyy-mm-dd`. 
[Available options list.](https://github.com/felixge/node-dateformat#mask-options)
```html
<!--default dont need to be specified-->
<input type="date" date-format="yyyy-mm-dd" />

<input type="date" data-date-format="mm/dd/yyyy" />

<input type="date" data-date-format="dd.mm.yyyy" />
```

## First day of the Week (Matrix Formatting)
* Specify the first day of the Week. With the data-first-day attribute you can change the day starting the week between Saturday, Sunday and Monday.
```html
<!--default dont need to be specified-->
<input type="date" data-first-day="su" />

<!--europe-->
<input type="date" data-first-day="mo" />

<!--egypt-->
<input type="date" data-first-day="sa" />
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
* Samsung Internet 11+


## Contributing

### Build
Run `npm run build` to edit the Project

### Production
Run `npm run production` to do an optimization and minification to the final Project

