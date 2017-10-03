var SERVER_NAME = 'game-api'
var PORT = 8000;
var HOST = '127.0.0.1';

var getCounter = 0
var postCounter = 0

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

// Get all games in the system
server.get('/games', function (req, res, next) {

    console.log('\n> /games: received GET request')

    // Find every game within the game collection
    gamesSave.find({}, function (error, games) {

        console.log('< /games: sending GET response')
        getCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // Return all of the games in the system
        res.send(games)
    })
})

// Get a single game by its game id
server.get('/games/:id', function (req, res, next) {

    console.log('\n> /games/%s: received GET request', req.params.id)

    // Find a single game by its id within save
    gamesSave.findOne({ _id: req.params.id }, function (error, game) {

        console.log('> /games/%s: sending GET response', req.params.id)
        getCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (game) {
            // Send the game if no issues
            res.send(game)
        } else {
            // Send 404 header if the game doesn't exist
            res.send(404)
        }
    })
})

// Create a new game
server.post('/games', function (req, res, next) {

    console.log('\n> /games: received POST request')

    // Make sure name is defined
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('price must be supplied'))
    }

    var newGame = {
        name: req.params.name,
        price: req.params.price
    }

    // Create the game using the persistence engine
    gamesSave.create(newGame, function (error, game) {

        console.log('> /games: sending POST response')
        postCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the game if no issues
        res.send(201, game)
    })
})

// Update a game by its id
server.put('/games/:id', function (req, res, next) {

    console.log('\n> /games/%s: received PUT request', req.params.id)

    // Make sure name is defined
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('price must be supplied'))
    }

    var newGame = {
        _id: req.params.id,
        name: req.params.name,
        price: req.params.price
    }

    // Update the game with the persistence engine
    gamesSave.update(newGame, function (error, game) {

        console.log('> /games/%s: sending PUT response', req.params.id)
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send(200, newGame)
    })
})

// Delete game with the given id
server.del('/games', function (req, res, next) {

    console.log('\n> /games: received DELETE request')

    // Delete the game with the persistence engine
    gamesSave.deleteMany({}, function (error, game) {

        console.log('> /games: sending DELETE response')
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send(200, 'All Games deleted !')
    })
})