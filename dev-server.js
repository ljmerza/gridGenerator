'use strict'

let express = require('express')
let path = require('path')

let app = express()


app.use(express.static('./public'))


app.listen(3000)
console.log('node server listening on port 3000')