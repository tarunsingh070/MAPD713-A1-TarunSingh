var SERVER_NAME = 'product-api'
var PORT = 8000;
var HOST = '127.0.0.1';

var getCounter = 0
var postCounter = 0

var restify = require('restify')

    // Get a persistence engine for the products
    , productsSave = require('save')('products')

    // Create the restify server
    , server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
    console.log('\nServer %s is listening at %s', server.name, server.url)
    console.log('\nEndpoints:')
    console.log('http://127.0.0.1:8000/products    method:GET')
    console.log('http://127.0.0.1:8000/products/:id    method:GET')
    console.log('http://127.0.0.1:8000/products    method:POST')
    console.log('http://127.0.0.1:8000/products/:id    method:PUT')
    console.log('http://127.0.0.1:8000/products    method:DELETE')
})

server
    // Allow the use of POST
    .use(restify.fullResponse())

    // Maps req.body to req.params so there is no switching between them
    .use(restify.bodyParser())

// Get all products in the system
server.get('/products', function (req, res, next) {

    console.log('\n> /products: received GET request')

    // Find every product within the product collection
    productsSave.find({}, function (error, products) {

        console.log('< /products: sending GET response')
        getCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // Return all of the products in the system
        res.send(products)
    })
})

// Get a single product by its product id
server.get('/products/:id', function (req, res, next) {

    console.log('\n> /products/%s: received GET request', req.params.id)

    // Find a single product by its id within save
    productsSave.findOne({ _id: req.params.id }, function (error, product) {

        console.log('> /products/%s: sending GET response', req.params.id)
        getCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (product) {
            // Send the product if no issues
            res.send(product)
        } else {
            // Send 404 header if the product doesn't exist
            res.send(404)
        }
    })
})

// Create a new product
server.post('/products', function (req, res, next) {

    console.log('\n> /products: received POST request')

    // Make sure name is defined
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('price must be supplied'))
    }

    var newProduct = {
        name: req.params.name,
        price: req.params.price
    }

    // Create the product using the persistence engine
    productsSave.create(newProduct, function (error, product) {

        console.log('> /products: sending POST response')
        postCounter++
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the product if no issues
        res.send(201, product)
    })
})

// Update a product by its id
server.put('/products/:id', function (req, res, next) {

    console.log('\n> /products/%s: received PUT request', req.params.id)

    // Make sure name is defined
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.price === undefined) {
        // If there are any errors, pass them to next in the JSON format
        return next(new restify.InvalidArgumentError('price must be supplied'))
    }

    var newProduct = {
        _id: req.params.id,
        name: req.params.name,
        price: req.params.price
    }

    // Update the product with the persistence engine
    productsSave.update(newProduct, function (error, product) {

        console.log('> /products/%s: sending PUT response', req.params.id)
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send(200, newProduct)
    })
})

// Delete product with the given id
server.del('/products', function (req, res, next) {

    console.log('\n> /products: received DELETE request')

    // Delete the product with the persistence engine
    productsSave.deleteMany({}, function (error, product) {

        console.log('> /products: sending DELETE response')
        console.log('Processed Requests count --> GET :%s, POST:%s', getCounter, postCounter)

        // If there are any errors, pass them to next in the JSON format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send(200, 'All Products deleted !')
    })
})