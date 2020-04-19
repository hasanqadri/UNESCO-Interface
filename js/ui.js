/**
 * Add list of factors to selector form indicator_file.csv
 */
function addFactorsToSelector() {
    queue()
        .defer(d3.csv, 'data/indicator_file.csv')
        .await(ready);

    function ready(error, labels) {
        labels.forEach(label => {
            let labelIndicator = label["INDICATOR_ID"]
            let labelDocument = label["FILE"].split(",")[0]
            let labelName = label["DESCRIPTION"]
            $('#factor').append(`<option value="${labelIndicator + ',' + labelDocument}">${labelName}</option>`);    //Adds option to factor selector
        })
    }
}

//On change handlers functions
//on change handler for the country or region specific views triggers this method
$( "#year" ).change(function() {
    //Change view of the current data to country and display the currently selected country
    let view = $("#view").val();
    if (view == "World") {
        updateWorldMap();
    } else if (view === 'Region') {
        updateRegion();  //TODO I think Priya worked on this?
    } else if (view === 'Country') {
        updateCountry();  //TODO I think Priya worked on this?
    }
});

//On change handler for the factors triggers this method
$( "#factor" ).change(function() {
    //update data and transition colors
    let view = $("#view").val();
    console.log(view)
    if (view === 'World') {
        console.log("updateWorldMap() is called")
        updateWorldMap();
    } else if (view === 'Region') {
        updateRegion();  //TODO I think Priya worked on this?

    } else if (view === 'Country') {
        updateCountry();  //TODO I think Priya worked on this?
    }
});

//on change handler for the country or region specific views triggers this method
$( "#viewWorldButton" ).on('click', function() {
    //Change view of the current data to country and display the currently selected country
    $("#worldMap").show();
    $("#viewWorldButton").hide();
    $(".legend").show()
    $("#view").val("World")
    $("#region").hide();
    $("#country").hide();
    updateWorldMap()  //call this function whenever you want to switch to world map view
});

//on change handler for the view (world, region, country) triggers this method
$( "#view" ).change(function() {
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

    //If $( "#inputRegion" ).val() is in array of region names
        //call updateRegion()
        //$("#country").hide();
        //$("#region").show();
        //$("#worldMap").hide();
    //If $( "#inputRegion" ).val() is in array of country names
        //call updateCountry()
        //$("#country").show();
        //$("#region").hide();
        //$("#worldMap").hide();
});