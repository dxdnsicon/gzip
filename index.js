'use strict'

const gzip = require('./lib/gzip')
gzip({
    input:'./test/input',
    output:'./test/output/input.zip',
    ignore:[]
})