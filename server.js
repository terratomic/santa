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
  if (err) {
    console.log("Error connecting to daabase ");
    return;
  }
  myQueue = mongoDbQueue(db, 'queue');
  console.log("Database connection ready");

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

  myQueue.add({name:req.body.name, email:req.body.email}, function(err, id) {
    // err handling ...
    if(err){
      console.log(err);
    }
    console.log('Added message with id = %s', id);
  });
});

//------------------Pairing of people
function pairing(job){
  var name = job.name;

  var num = name.length;

  //0 means not used, 1 means used
  var statuses = Array(num).fill(0);
  var indexes = Array(num).fill(0);

  for(var i = 0; i < num; i++)
  {
    var ind = -1;
    while(ind == -1 || ind == i || statuses[ind]==1)
    {
      ind = Math.random()*num;
    }

    indexes[i]=ind;
    statuses[ind] =1;
  }

  job.indexes = indexes;

  return job;
}


//------------------Periodic polling 1
var task_is_running1 = false;
setInterval(function(){
  if(!task_is_running1){
    task_is_running1 = true;
    myQueue.get(function(err,msg){
      if(!err)
        var job = pairing(msg, function(err){
          if(!err)
            myQueue2.add({name: job.name, email:job.email, indexes: job.indexes});
        });
    });
    task_is_running1 = false;
  }
}, time_interval_in_miliseconds);

//------------------Periodic polling 2


//------------------Emails to people
