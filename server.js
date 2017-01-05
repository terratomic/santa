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

//========================================Job queue
var mongodb = require('mongodb');
var mongoDbQueue = require('mongodb-queue');

var con = 'mongodb://localhost:27017/santa';

mongodb.MongoClient.connect(con, function(err, db) {
  if (err) {
    console.log("Error connecting to daabase ");
    return;
  }

  var pQueue = mongoDbQueue(db, 'pQueue'); //pairing queue
  var eQueue = mongoDbQueue(db, 'eQueue'); //emailing queue

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

  app.post('/submit',function(req, res) {

    console.log(req.body.name);
    console.log(req.body.email);

    pQueue.add({name:req.body.name, email:req.body.email}, function(err, id) {
      // err handling ...
      if(err){
        console.log(err);
      }
      console.log('Added message with id = %s', id);
    });
  });


  //------------------Pairing of people
  function pairing(job,callback){
    try {
      var num = job.name.length;

      //0 means not used, 1 means used
      var statuses = Array(num).fill(0);
      var indexes = Array(num).fill(0);

      for(var i = 0; i < num; i++)
      {
        var ind = -1;
        while(ind == -1 || ind == i || statuses[ind]==1)
        ind = Math.floor(Math.random()*num);

        indexes[i]=ind;
        statuses[ind] =1;
      }
      console.log(indexes);
      job.indexes = indexes;
      callback(null,job);
    } catch(e) {
      callback(e,job);
    }
  }


  //------------------Periodic polling 1
  var task_is_running1 = false;
  var time_interval_in_milliseconds = 100;
  setInterval(function(){
    if(!task_is_running1){
      task_is_running1 = true;
      pQueue.get(function(err,msg){
        if(err)
        console.log("pQueue get error");
        else{
          if(!msg)
          return;
          /*console.log(msg);*/
          pairing(msg.payload, function(err,job){
            if(err)
            console.log("perr:" +err);
            else{
              console.log("acking"+msg.id);
              pQueue.ack(msg.ack,function(err, id){
                if(err)
                {
                  console.log("id:" + id+ err);
                }
              });
              console.log("equeue add");
              eQueue.add({name: job.name, email:job.email, indexes: job.indexes},function(err){
                if(err)
                console.log("eQueue error");
              });
            }
          });
        }
      });
      task_is_running1 = false;
    }
  }, time_interval_in_milliseconds);


  //------------------SMPT email server
  var nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

  //------------------Emails to people

  function sendEmail(job,onError){
    try{

      var num = job.name.length;

      for(i = 0; i < num; i++)
      {
        var senderName = job.name[i];
        var sender = job.email[i];
        var recipientName = job.name[job.indexes[i]];
/*
        // setup e-mail data with unicode symbols
        var mailOptions = { //TODO CREATE MASTER EMAIL
          from: String,//'"Fred Foo ?" <foo@blurdybloop.com>', // sender address
          to: sender,//'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
          subject: 'Santa', // Subject line
          text: String,//senderName+', Your person is ' + recipientName, // plaintext body
          html: String // html body
        };
*/
        var mailOptions;
        //TODO mail options from
        mailOptions.to = sender;
        mailOptions.subject = 'santa';
        mailOptions.text = senderName+', Your person is ' + recipientName;
        mailOptions.html = '<b>'+mailOptions.text+'</b>';

          console.log(mailOptions);
          //TODO
        // send mail with defined transport object
        //        transporter.sendMail(mailOptions, function(error, info){
        //          if(error){
        //            return console.log(error);
        //      }
        //    console.log('Message sent: ' + info.response);
        //});
      }

      return;
    }catch(e) {
      onError(e);
    }
  }


  //------------------Periodic polling 2
  //TODO
  var task_is_running2 = false;
  setInterval(function(){
    if(!task_is_running2){
      task_is_running2 = true;
      eQueue.get(function(err,msg){
        if(err)
          console.log("eQueue get error");
        else{
          if(!msg)
            return;
  //        console.log(msg);
          sendEmail(msg.payload, function(err){
            if(err)
              console.log("perr:" +err);
            else{
              console.log("eq acking"+msg.id);
              eQueue.ack(msg.ack,function(err, id){
                if(err)
                  console.log("id:" + id+ err);
              });
            }
          });
        }
      });
      task_is_running2 = false;
    }
  }, time_interval_in_milliseconds);
});
