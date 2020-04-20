var db = null;

/**
 * Add an if-else statement here for when we are just testing mock data, then db will equal null
 * Otherwise, if testing with real data, do the following:
 * Change setupDBConnection() useMockData to false
 * Change setupDBConnection() firebaseConfig to the correct configuration posted on slack
 * this method is only called at the initiation of the app - make calls to genericDBCall directly elsewhere in the app
 */
function controller() {
    addFactorsToSelector();
    db = setupDBConnection();
    if (db == null) {
        createWorldMap()
    } else {
        //We use a promise to retrieve the data, otherwise creatWorldMap() is called before the callback is complete
        let year = $("#year").val();
        let indicator_id = $("#factor").val().split(",")[0]; //Id for population
        let document_id = $("#factor").val().split(",")[1];
        genericDBCall(year, indicator_id, document_id).then(result => {
            //console.log(result);
            createWorldMap(result)
        });

        ind_id = "GER.02"
        ind_2 = "CR.2"
        doc_id = "SDG_DATA_NATIONAL"
        corrDBCall(ind_id, 'correlation').then(
            c_result => {
            console.log(c_result);
            add_bar_chart(c_result)
            genericDBCall('2018', ind_id, doc_id).then(res_1 => {
                genericDBCall('2018', ind_2, doc_id).then(res_2 => {
                add_scatter_chart(res_1, res_2)
            });
            });
        });
    }
}

function setupDBConnection() {
    useMockData = false    //TODO Change this variable based off using mock or real data
    if (useMockData) {
        return null
    } else {
        // Set the configuration for your app
        // TODO: See slack general for the config to be pasted below, do not push to github with this not removed
        const firebaseConfig = {}
        firebase.initializeApp(firebaseConfig);
        // Get a reference to the database service
        //How to retrieve data with firestore: https://firebase.google.com/docs/database/admin/retrieve-data
        //Example with retrieving population
        return firebase.firestore();
    }
}

/**
 * Example db call
 * Uses the global db connection to retrieve documents in some collection
 * Then it maps the documents matching the parameters to an array
 * This array is of objects like thus:
 *  [{INDICATOR_ID:"200101", YEAR:"2015", COUNTRY_ID:"USA"}, {...}, ...]
 * @param year the year of the data wanted
 * @param indicator_id This is the set of data wanted for a particular year
 * @param document_id This is the collection for the query
 */
async function genericDBCall(year, indicator_id, document_id) {
    console.log(year, indicator_id, document_id)
    var collection = db.collection(document_id)
        .where("INDICATOR_ID", "==", indicator_id)
        .where("YEAR", "==", year);
    //The above query gets population data for the year 2015
    let data = await collection.get().then(function(querySnapshot) {
        console.log(querySnapshot.size);
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

    return data
}

async function corrDBCall(indicator_id, document_id) {
    console.log(indicator_id, document_id)
    var collection = db.collection(document_id)
        .where("INDICATOR_ID", "==", indicator_id);
    //The above query gets population data for the year 2015
    let data = await collection.get().then(function(querySnapshot) {
        console.log(querySnapshot.size);
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

    return data
}


async function lineChartDBCall(indicator_id, document_id, country) {
    var collection = db.collection(document_id)
        .where("INDICATOR_ID", "==", indicator_id)
        .where("COUNTRY_ID", "==", country);
    //The above query gets population data for the year 2015
    let data = await collection.get().then(function(querySnapshot) {
        console.log(querySnapshot.size);
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

    return data
}
