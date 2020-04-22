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
            if (labelIndicator !== "NY.GDP.PCAP.CD") {
                $('#factor').append(`<option value="${labelIndicator + ',' + labelDocument}">${labelName}</option>`);    //Adds option to factor selector
            }
        })
    }
}

//On change handlers functions
//on change handler for the country or region specific views triggers this method
$( "#year" ).change(function() {
    //Change view of the current data to country and display the currently selected country
    let view = $("#view").val();
    updateWorldMap();
    $("#worldMap").show();
    $("#region").hide();
    $("#country").hide();
    change_chart();
});

//On change handler for the factors triggers this method
$( "#factor" ).change(function() {
    //update data and transition colors
    updateWorldMap();
    $("#worldMap").show();
    $("#region").hide();
    $("#country").hide();
    change_chart();
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