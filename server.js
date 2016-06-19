'use strict'
let express  = require('express'),
	http = require('http'),
	sass = require('node-sass'),
	bodyParser = require('body-parser'),
	fs = require('fs')

const options = {
	includePushPull: true,

	sizeSmall: 600,
	sizeMedium: 992,
	sizeLarge: 1200,
	sizexLarge: 1400,

	containerWidthPercent: 90,
	containerWidthPixel: 1200,
	numCols: 1,

	outputStyle: {
		nested: 'nested',
		expanded: 'expanded',
		compact: 'compact', 
		compressed: 'compressed'
	}
}
const port = process.env.PORT || 3000

let app  = express()
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(express.static('./public'))

app.get('/', function( req, res, next){
  res.send('test')
})

app.post('/sasscompile', function (req, res, next) {

	options.includePushPull = req.body.includePushPull

	options.sizeSmall = req.body.sizeSmall
	options.sizeMedium = req.body.sizeMedium
	options.sizeLarge = req.body.sizeLarge
	options.sizexLarge = req.body.sizexLarge

	options.containerWidthPercent = req.body.containerWidthPercent
	options.numCols = req.body.numCols
	options.outputStyle = req.body.outputStyle

	// read sass file and change variables
	fs.readFile(__dirname + '/grid.sass', function (err, data) {
     if (err) next(err)
		// replace data and create temp file path
		data = data.toString().replace('smallScreenPixel', options.sizeSmall+'px').replace('mediumScreenPixel', options.sizeMedium+'px').replace('largeScreenPixel', options.sizeLarge+'px').replace('xlargeScreenPixel', options.sizexLarge+'px').replace('includexLarge', options.includexLarge).replace('includeLarge', options.includeLarge).replace('includeMedium', options.includeMedium).replace('includeSmall', options.includeSmall).replace('includePushPull', options.includePushPull).replace('containerWidthPercent', options.containerWidthPercent+"%").replace('numCols', options.numCols)

		let rand = Math.random()
		let filePath = './' + rand + '.sass'

		// write a temp file for sass to read
		fs.writeFile(filePath, data, (err) => {
			if (err) next(err)
			// compile sass file
			sass.render({
				file: filePath,
				outputStyle: req.body.outputStyle
				},
				function(err, result) { 
					if (err) next(err)
					// delete temp file no matter what
					fs.unlink(filePath, (err) => {
						if (err) next(err)
					})
					res.setHeader('Content-Type', 'application/octet-stream')
					res.setHeader('Content-disposition', 'attachment; filename=grid.css')
					res.writeHead(200)
					res.end(result.css.toString())
				}
			)
		})	
	})
})

app.use('*', function (err, req, res, next){
  console.log(err)
	fs.appendFile('./error.txt', err, (err) => {
		res.send("Sorry, something went wrong. I've been notified so I can fix it.")
	})
})


// create server object
let server = http.createServer(app)
// booting up server function
let boot = function() {
  server.listen(port, function() {
    console.log('Express server listening on port', port)
  })
}
// shutdown server function
let shutdown = function() {
  server.close()
}

// if main module then start server else pass to exports
if(require.main === module){
  boot()
} else {
  console.log('Running gridGenerator app as module')
  module.exports = {
    boot: boot,
    shutdown: shutdown,
    port: port,
    server: server,
    app: app
  }
}
