const express = require('express')
const port = 5000
//const helmet = require('helmet')
const router = require('./routes/controller.js')
 
const app = express()
//app.use(helmet())
 
app.use('/',router)
 
app.listen(port,() => {
	console.log('Listening to port ' + port);
})