function addDivs(){
  var dummy = "<input class = \"field\" type=\"text\" name = \"name\"/>"+
"<input class = \"field\" type = \"text\" name = \"email\" />"+
  "<br />"+
  "<input class = \"field\" type=\"text\" name = \"name\"/>"+
"<input class = \"field\" type = \"text\" name = \"email\" />"+
  "<br />"+
  "<input class = \"field\" type=\"text\" name = \"name\"/>"+
"<input class = \"field\" type = \"text\" name = \"email\" />"+
  "<br />"+
  "<input class = \"field\" type=\"text\" name = \"name\"/>"+
"<input class = \"field\" type = \"text\" name = \"email\" />"+
  "<br />"+
  "<input class = \"field\" type=\"text\" name = \"name\"/>"+
"<input class = \"field\" type = \"text\" name = \"email\" />"+
  "<br />";
  
  document.getElementById('person').innerHTML+=dummy;
}

$( document ).ready(function() {
  console.log( "ready!" );
  document.getElementById("add").onclick = addDivs;
/*  document.getElementById("footer").style.position = "absolute";
  document.getElementById("footer").style.bottom = "0";*/
});
