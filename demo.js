
var glob = require('glob')
var path = require('path')
var PAGE_PATH = path.resolve(__dirname, './src/pages')


var files = glob.sync(PAGE_PATH + '/*/*.js')
console.log(files)
