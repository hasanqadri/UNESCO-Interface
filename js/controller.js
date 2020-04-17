var db = null

/**
 * Add an if-else statement here for when we are just testing mock data, then db will equal null
 * Otherwise, if testing with real data, do the following:
 * Change setupDBConnection() useMockData to false
 * Change setupDBConnection() firebaseConfig to the correct configuration posted on slack
 */
function controller() {
    db = setupDBConnection()
    if (db == null) {
        createWorldMap()
    } else {
        //We use a promise to retrieve the data, otherwise creatWorldMap() is called before the callback is complete
        populationDBCall().then(result => {
            console.log(result)
            createWorldMap(result)
        });
    }
}

//On change handler for the factors triggers this method
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

//on change handler for the view (world, region, country) triggers this method
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

//on change handler for the country or region specific views triggers this method
$( "#inputRegion" ).change(function() {
    alert(  $("#inputRegion").val());
    //Change view of the current data to country and display the currently selected country
    $("#country").show();
    $("#region").hide();
    $("#worldMap").hide();
});

function setupDBConnection() {
    useMockData = true
    if (useMockData) {
        return null
    } else {
        // Set the configuration for your app
        // TODO: See slack general for the config to be pasted below, do not push to github with this not removed
        const firebaseConfig = { //EDITED OUT FOR NOW
        };
        firebase.initializeApp(firebaseConfig);
        // Get a reference to the database service
        //How to retrieve data with firestore: https://firebase.google.com/docs/database/admin/retrieve-data
        //Example with retrieving population
        return firebase.firestore();
    }
}

/**
 * Example db call
 * Uses the global db connection to retrieve documents in the "DEM_DATA_NATIONAL" collection
 * Then it maps the documents matching the parameters to an array
 * This array is of objects like thus:
 *  [{INDICATOR_ID:"200101", YEAR:"2015", COUNTRY_ID:"USA"}, {...}, ...]
 */
async function populationDBCall() {
    //Get label
    var populationData = db.collection("DEM_DATA_NATIONAL")
        .where("INDICATOR_ID", "==", "200101")
        .where("YEAR", "==", "2015");
    //The above query gets population data for the year 2015
    let popData = await populationData.get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
            return querySnapshot.docs.map(function (documentSnapshot) {
                    return documentSnapshot.data(); //Each individual object (country's stat)
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    return popData
}

