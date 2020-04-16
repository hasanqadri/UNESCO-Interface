function controller() {
    setupDBConnection();
	createWorldMap()
}

//On change for the factors triggers this method
$( "#factor" ).change(function() {
    alert( "Handler for factor called with " + $("#factor").val() + " chosen");
    //update data and transition colors
    if (view === 'World') {
        updateWorldMap();
    } else if (view === 'Region') {
        updateRegion();

    } else if (view === 'Country') {
        updateCountry();
    }
});

//on change for the view (world, region, country) triggers this method 
$( "#view" ).change(function() {
    alert( "Handler for view called with " + $("#view").val() + " chosen");
    let view = $("#view").val();
    //Change view of the current data
    if (view === 'World') {
        $("#worldMap").show();
        $("#region").hide();
        $("#country").hide();
    } else if (view === 'Region') {
        $("#region").show();
        $("#worldMap").hide();
        $("#country").hide();

    } else if (view === 'Country') {
        $("#country").show();
        $("#region").hide();
        $("#worldMap").hide();
    }

});

//on change for the country or region specific views triggers this method 
$( "#inputRegion" ).change(function() {
    alert(  $("#inputRegion").val());
    //Change view of the current data to country and display the currently selected country
    $("#country").show();
    $("#region").hide();
    $("#worldMap").hide();
});

function setupDBConnection() {
    var admin = require("firebase-admin");

    var serviceAccount = require("../../key/service-account-file.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dva-unesco.firebaseio.com"
    });
    var db = admin.database();
    var ref = db.ref("CLTE_COUNTRY");
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

