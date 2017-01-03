/*
var express = require('express');
var app = express();

app.use(express.bodyParser());

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/client'));

app.post('form', function(request, response){
    console.log(request.query.name);
    console.log(request.query.email);
});

app.get('/', function(request, response) {
    response.render('client/index')
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
*/
//-----------------------------------------
/*
$( document ).ready(function() {
  console.log( "ready!" );
  document.getElementById("submit").onclick = submit;
});

function submit(){
  var http = require('http');

  var option = {
      hostname : "localhost" ,
      port : 8000 ,
      method : "POST",
      path : "/"
  }

      var request = http.request(option , function(resp){
         resp.on("data",function(chunck){
             console.log(chunck.toString());
         })
      })
      request.end();

  $( "#submit" ).click(function() {
    $.post('../server.js', function(data){
      alert("Data: " + data);
    });
  });

}

*/
