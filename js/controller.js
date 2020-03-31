function controller() {
	createWorldMap()
}


//On change for the factors triggers this method
$( "#factor" ).change(function() {
  alert( "Handler for factor called with " + $("#factor").val() + " chosen");
  //update data and transition colors
});

//on change for the view (world, region, country) triggers this method 
$( "#view" ).change(function() {
  alert( "Handler for view called with " + $("#view").val() + " chosen");
  //Change view of the current data
});

//on change for the country or region specific views triggers this method 
$( "#inputRegion" ).change(function() {
  alert(  $("#inputRegion").val());
  //Change view of the current data
});