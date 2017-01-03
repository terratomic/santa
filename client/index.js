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

/*  $( "#submit" ).click(function() {
    $.post('../server.js', function(data){
      alert("Data: " + data);
    });
  });
  */
}
