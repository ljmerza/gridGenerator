'use strict'
let express  = require('express'),
	http = require('http'),
	sass = require('node-sass'),
	bodyParser = require('body-parser'),
	fs = require('fs')

const options = {
	includeSmall: false,
	includeMedium: false,
	includeLarge: false,
	includexLarge: false,

	includePushPull: false,

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
const port = process.env.PORT || 8080

let app  = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res, next) {
	res.send('')
})

app.get('/sasscompile', function (req, res, next) {
	// change options based on user input
	options.includeSmall = req.body.includeSmall
	options.includeMedium = req.body.includeMedium
	options.includeLarge = req.body.includeLarge
	options.includexLarge = req.body.includexLarge
	options.includePushPull = req.body.includePushPull
	options.sizeSmall = req.body.sizeSmall
	options.sizeMedium = req.body.sizeMedium
	options.sizeLarge = req.body.sizeLarge
	options.sizexLarge = req.body.sizexLarge
	options.containerWidthPercent = req.body.containerWidthPercent
	options.containerWidthPixel = req.body.containerWidthPixel
	options.numCols = req.body.numCols
	options.outputStyle = req.body.outputStyle

	// read sass file and change variables
	fs.readFile('./grid.sass', function (err, data) {

		// replace data and create temp file path
		data = data.toString().replace('smallScreenPixel', options.sizeSmall+'px').replace('mediumScreenPixel', options.sizeMedium+'px').replace('largeScreenPixel', options.sizeLarge+'px').replace('xlargeScreenPixel', options.sizexLarge+'px').replace('includexLarge', options.includexLarge).replace('includeLarge', options.includeLarge).replace('includeMedium', options.includeMedium).replace('includeSmall', options.includeSmall).replace('includePushPull', options.includePushPull).replace('containerWidthPixel', options.containerWidthPixel+'px').replace('containerWidthPercent', options.containerWidthPercent+"%").replace('numCols', options.numCols)
		let filePath = './' + Math.random() + '.sass'

		// write a temp file for sass to read
		fs.writeFile(filePath, data, err => {
			if (err) return err

			// compile sass file
			sass.render({
				file: filePath,
				outputStyle: req.body.outputStyle || options.outputStyle.compressed
				},
				function(err, result) { 
					// delete temp file no matter what
					fs.unlink(filePath, (err) => {
						if (err) return err
					})
					if (err) return err

					// if no errors then send file
					res.send(result.css.toString())
				}
			)
		})	
	})
})

// create server object
let server = http.createServer(app)
// booting up server function
let boot = function() {
	server.listen(port, function() {
		console.log('Express server listening on port ', port)
	})
}
// shutdown server function
let shutdown = function() {
	server.close()
}

// if main module then start server else pass to exports
if(! require.parent){
	boot()
} else {
	console.log('Running ap as module')
	module.exports = {
		boot: boot,
		shutdown: shutdown,
		port: port,
		server: server,
		app: app
	}
}
