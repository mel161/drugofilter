// var template = require('pug-loader!./../_item.pug')
// => returns file.pug content as template function

// var template = require('./../_item.pug')

var template = require('./../_item.pug')

var locals = { name: 'Timothy' }

var html = template(locals)
// => the rendered HTML

console.log(html)
