var documentIdWithGender = []
var regionlist=[
    "SDG: Africa (Northern)",
    "SDG: Africa (Sub-Saharan)",
    "SDG: Asia (Central and Southern)",
    "SDG: Asia (Eastern)",
    "SDG: Asia (South-eastern)",
    "SDG: Asia (Southern)",
    "SDG: Asia (Western)",
    "SDG: Europe",
    "SDG: Latin America and the Caribbean",
    "SDG: Northern America",
    "SDG: Oceania",
    "SDG: Oceania (Australia/New Zealand)",
    "SDG: Small Island Developing States",
    "SDG: Western Asia and Northern Africa"
]


function createBarChart(dataSet3, regionMap) {

    var margin = {top: 50, right: 75, bottom: 75, left: 75}
        , width = 960 - margin.left - margin.right
        , height = 500 - margin.top - margin.bottom;
    let finalData = []
    dataSet3.sort((a, b) => (a.COUNTRY_ID > b.COUNTRY_ID) ? 1 : -1)

    console.log(dataSet3)
    console.log(regionMap)
    dataSet3.forEach(d => {
       if ((Object.keys(regionMap).includes(d.COUNTRY_ID))) {
            finalData.push(d)
       }
    });

    let dataM = [];
    let dataF = [];

    /**
    for (i = 0; i < csv.length; i++) {

        // console.log(regionmap[csv[i]["COUNTRY_ID"]])

        // console.log(csv[i])
        if (csv[i]["YEAR"] == year && regionmap[csv[i]["COUNTRY_ID"]] == region) {
            console.log(csv[i]["COUNTRY_ID"]);
            obj = {};
            obj["COUNTRY_ID"] = csv[i]["COUNTRY_ID"];
            obj["VALUE"] = csv[i]["VALUE"];

            if (csv[i]["INDICATOR_ID"].includes("M")) {
                dataM.push(obj)
            }
            else {
                dataF.push(obj)
            }
        }
    }
     **/
    // console.log(dataM)
    console.log("We got here")
    console.log(regionMap)
    console.log(finalData)
    let svg_bar = d3.select("#region")
        .attr("class", "barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var barPadding = 0.25;
        yScale = d3.scaleLinear().range([height, 0]),
            xScale = d3.scaleBand().range([0, width]).padding(barPadding);

    xScale.domain(finalData.map(function (d) {
        return d.COUNTRY_ID;
    }));
    yScale.domain([0, d3.max(finalData, function(d) { return +d["VALUE"]; })]);

    svg_bar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text").attr("y", 0).attr("x", 9).attr("dy", ".35em").attr("transform", "rotate(90)").style("text-anchor", "start");

    svg_bar.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg_bar.selectAll("rect" + 0)
        .data(finalData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", '#2fd5de')
        .attr("x", function (d) {
            return xScale(d.COUNTRY_ID);
        })
        .attr("y", function (d) {
            return yScale(d.VALUE);
        })
        .attr("width", function (d) {
            return xScale.bandwidth();
        })
        .attr("height", function (d) {
            return yScale(0) - yScale(d.VALUE);
        })
        .on('mouseover',function(d){
            d3.select(this)
                .style('opacity', .5)
                .style('stroke-width', .3);
        })
        .on('mouseout', function(d){
            d3.select(this)
                .style('opacity', 1)
                .style('stroke-width',3);
        })
        .on('click', function(d) {
                $("#region").hide()
                $("#country").show()
                $("#view").val("Country")
                console.log(d)
                updateLineChart(d)
        });

    /**
     svg_bar.selectAll("rect" + 1)
         .data(dataF)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("fill", '#d25c4d')
         .attr("x", function (d) {
             return xScale(d.COUNTRY_ID);
         })
         .attr("y", function (d) {
             return yScale(d.VALUE);
         })
         .attr("width", function (d) {
             return xScale.bandwidth();
         })
         .attr("height", function (d) {
             return yScale(0) - yScale(d.VALUE);
         });
    **/
    svg_bar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .text($("#factor option:selected").html());

    svg_bar.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.bottom / 2) + ")")
        .style("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Country");
}


function updateBarChart(data) {
    let year = $("#year").val();
    let indicator_id = $("#factor").val().split(",")[0];
    let document_id = $("#factor").val().split(",")[1];
    let regionmap = {};
    let currRegion = undefined
    //let document_id = "SDG_REGION";
    barChartLabelRegionDBCall("SDG_REGION", data.id).then(dataSet => {
        console.log(dataSet)
        dataSet.forEach(row => {
            regionlist.forEach(elem => {
                if(elem == row.REGION_ID.trim()) {
                    currRegion = row.REGION_ID
                }
                console.log('nxt')
            })
        });
        console.log(currRegion)
        barChartLabelCountryDBCall("SDG_REGION", currRegion).then(dataSet2 => {
            regionmap.region = currRegion
            dataSet2.forEach(d => {
                regionmap[d.COUNTRY_ID] = d.REGION_ID
            });
            if (document_id in documentIdWithGender) {
                console.log('shouldnt be here plz')
            } else {
                console.log(year, indicator_id, document_id)
                genericDBCall(year, indicator_id, document_id).then(dataSet3 => {
                    $("#worldMap").empty();
                    $("#region").empty();
                    $(".legend").empty();
                    $(".d3-tip").remove();
                    createBarChart(dataSet3, regionmap);
                });
            }
        });
    });
}