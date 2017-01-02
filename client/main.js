$( document ).ready(function() {
    console.log( "ready!" );
    document.getElementById("submit").onclick = submit;
});

function submit(){
$( "#submit" ).click(function() {
  $.post('server.php', $('#form').serialize())
});
}
