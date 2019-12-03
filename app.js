const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

/*app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));*/
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Unable to connect to the database.', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({status: "ok", "message": "Welcome to node project"});
});

// Require Category routes
var categoryAPI = require('./api/controllers/CategoryController.js');
app.use('/category', categoryAPI);

// Require Product routes
var productAPI = require('./api/controllers/ProductController.js');
app.use('/product', productAPI);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = app;
