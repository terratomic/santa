// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var http       = require('http');
var bodyParser = require('body-parser');
var path       = require('path');

var app        = express();                 // define our app using express
var server = http.createServer(app);


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/',express.static( __dirname + '/client/' ) );

app.get(function (req, res) {
  res.render('client/index.html', {});
});

var port = process.env.PORT || 8000;        // set our port

var mongoose   = require('mongoose');
var Email = require('./models/email');
var Circle = require('./models/circle');

//========================================Job queue
var mongodb = require('mongodb');
var mongoDbQueue = require('mongodb-queue');

var con = 'mongodb://localhost:27017/santa';

var myQueue;
mongodb.MongoClient.connect(con, function(err, db) {
  myQueue = mongoDbQueue(db, 'my-queue');
})



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});



// START THE SERVER
// =============================================================================
app.listen(port,function(){
  console.log('Server running at '+port);
});
console.log('Magic happens on port ' + port);

//--------------------------SMPT EMAIL SERVER-----------------------------
/*
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// send mail with defined transport object

function sendMail(){
transporter.sendMail(mailOptions, function(error, info){
if(error){
return console.log(error);
}
console.log('Message sent: ' + info.response);
});
}
*/
app.post('/submit',function(req, res) {

  console.log(req.body.name);
  console.log(req.body.email);


  var circle = new Circle();
  circle.names = req.body.name;
  circle.emails = req.body.email;

  myQueue.add(circle, function(err, id) {
    // err handling ...
    console.log('Added message with id = %s', id)
  });
});
