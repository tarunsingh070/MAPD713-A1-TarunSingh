var SERVER_NAME = 'game-api'
var PORT = 8000;
var HOST = '127.0.0.1';

var restify = require('restify')

    // Get a persistence engine for the games
    , gamesSave = require('save')('games')

    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
    console.log('\nServer %s is listening at %s', server.name, server.url)
    console.log('\nEndpoints:')
    console.log('http://127.0.0.1:8000/games    method:GET')
    console.log('http://127.0.0.1:8000/games/:id    method:GET')
    console.log('http://127.0.0.1:8000/games    method:POST')
    console.log('http://127.0.0.1:8000/games/:id    method:PUT')
    console.log('http://127.0.0.1:8000/games    method:DELETE')
})

server
// Allow the use of POST
.use(restify.fullResponse())

// Maps req.body to req.params so there is no switching between them
.use(restify.bodyParser())