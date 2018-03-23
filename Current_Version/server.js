// PACKAGES
var express    = require('express');
var app        = express();
var path       = require('path');
var port       = process.env.PORT || 8080;
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var router     = express.Router();
var passport   = require('passport');
var keys       = require('./app/config/keys');
var appRoutes  = require('./app/routes/api')(router, keys);
var social     = require('./app/config/passport')(app, passport, keys);


// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

// BACKEND
mongoose.connect(keys.mongodb.dbURI, function(err) {
  if(err) {
    console.log('Not connected to db!');
  } else {
    console.log('Successfully connected to db');
  }
});

// FRONT END
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
});

app.listen(port, function() {
  console.log('Running the server on port ' + port);
});
