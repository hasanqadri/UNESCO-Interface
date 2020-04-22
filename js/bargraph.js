var documentIdWithGender = [];
var regionlist = [
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
];

function createBarChart(regionMap, currCountry, mData, fData) {
    $("#sub-title").text($("#factor option:selected").html() + ": " + regionMap.region.replace('SDG: ','') );
    $("#head-title").text("Regional Distribution");

    const tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => `<strong>Value: </strong><span class='details'>${d.grpValue}<br></span>`);

    let finalData = []
    let finalDataF = []

    mData.sort((a, b) => (a.COUNTRY_ID > b.COUNTRY_ID) ? 1 : -1)
    mData.forEach(d => {
        if ((Object.keys(regionMap).includes(d.COUNTRY_ID))) {
            finalData.push(d)
        }
    });

    //Preprocess data
    let groupData = [];
    console.log(fData)
    if (fData == undefined) {
        finalData.forEach(elem => {
            groupData.push({key: elem.COUNTRY_ID, values: [{grpName:'Country', grpValue:elem.VALUE, grpCountry: elem.COUNTRY_ID}]})
        });
    } else {
        fData.sort((a, b) => (a.COUNTRY_ID > b.COUNTRY_ID) ? 1 : -1)
        fData.forEach(d => {
            if ((Object.keys(regionMap).includes(d.COUNTRY_ID))) {
                finalDataF.push(d)
            }
        });

        finalData.forEach(elem => {
            groupData.push({key: elem.COUNTRY_ID, values: [{grpName:'Male', grpValue:elem.VALUE, grpCountry: elem.COUNTRY_ID}]})
        });
        finalDataF.forEach(elem => {
            groupData.forEach(d => {
                if (d.key == elem.COUNTRY_ID) {
                    d.values.push({grpName:'Female', grpValue: elem.VALUE, grpCountry: elem.COUNTRY_ID})
                }
            })
        });
    }

    console.log(groupData)

    var margin = {top: 20, right: 65, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;



    var x0  = d3.scaleBand().rangeRound([0, width], .5);
    var x1  = d3.scaleBand();
    var y   = d3.scaleLinear().rangeRound([height, 0]);

    var xAxis = d3.axisBottom().scale(x0)
        .tickValues(groupData.map(d=>d.key));

    var yAxis = d3.axisLeft().scale(y);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select('#region')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var categoriesNames = groupData.map(function(d) { return d.key; });
    var rateNames       = groupData[0].values.map(function(d) { return d.grpName; });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(2," + height + ")")
        .call(xAxis);


    svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .text("Value");
    svg.call(tip);

    svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(groupData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(d.grpName); })
        .style("fill", function(d) {
            return color(d.grpName)
        })
        .style('opacity', d => {
            if (d.grpCountry == currCountry) {
                return 1
            }
            return .3
        })
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .on("mouseover", function(d) {
            console.log(d)
            tip.show(d)
            d3.select(this)
                .style("fill", "red")
                .style('stroke-width', .3);
        })
        .on("mouseout", function(d) {
            tip.hide(d)
            d3.select(this)
                .style("fill", color(d.grpName))
                .style('stroke-width',3);
        })
        .on('click', d => {
            $("#region").hide()
            $("#country").show()
            $("#view").val("Country")
            updateLineChart(d.grpName, d.grpCountry )

        });


    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.grpValue); })
        .attr("height", function(d) { return height - y(d.grpValue); });

    //Legend
    var legend = svg.selectAll(".legend")
        .data(groupData[0].values.map(function(d) { return d.grpName; }).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", width+45)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width + 40)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

}

function updateBarChart(data) {
    console.log('here')
    let year = $("#year").val();
    let indicator_id = $("#factor").val().split(",")[0];
    let document_id = $("#factor").val().split(",")[1];
    let regionmap = {};
    let currRegion = undefined
    //let document_id = "SDG_REGION";
    barChartLabelRegionDBCall("SDG_REGION", data.id).then(dataSet => {
        dataSet.forEach(row => {
            regionlist.forEach(elem => {
                if(elem == row.REGION_ID.trim()) {
                    currRegion = row.REGION_ID
                }
            })
        });
        barChartLabelCountryDBCall("SDG_REGION", currRegion).then(dataSet2 => {
            regionmap.region = currRegion
            dataSet2.forEach(d => {
                regionmap[d.COUNTRY_ID] = d.REGION_ID
            });
            if (document_id in documentIdWithGender) {
                console.log('shouldnt be here plz')
            } else {
                queue()
                    .defer(d3.csv, 'data/inequality.csv')
                    .await(ready);

                function ready(error, inequalityLabel) {
                    console.log(inequalityLabel)
                    $("#worldMap").empty();
                    $("#region").empty();
                    $(".legend").empty();
                    $(".d3-tip").remove();
                    inequalityLabel.forEach(d => {
                        if (d.INDICATOR_ID.includes(document_id)) {

                        }
                    });
                    if (indicator_id.includes("XUNIT") || indicator_id.includes("SchBSP") || indicator_id.includes("NY.GDP") || indicator_id== "200101") {
                        //No male or female differentiation
                        genericDBCall(year, indicator_id, document_id).then(dataSet3 => {
                            createBarChart(regionmap, data.id, dataSet3, undefined);
                        });
                    } else {
                        //Male female differention
                        genericDBCall(year, indicator_id + ".M", document_id).then(maleData => {
                            genericDBCall(year, indicator_id + ".F", document_id).then(femaleData => {
                                createBarChart(regionmap, data.id, maleData, femaleData);
                            });
                        });
                    }
                }

            }
        });
    });
}

/***
 .on('mouseover',function(d){
            console.log(d)
            tip.show(d)
            d3.select(this)
                .style('opacity', .5)
                .style('stroke-width', .3);
        }).on('mouseout', function(d){
            tip.hide(d)
            d3.select(this)
                .style('opacity', 1)
                .style('stroke-width',3);
        }).on('click', function(d) {
            $("#region").hide()
            $("#country").show()
            $("#view").val("Country")
            updateLineChart(d)
        });

 const tip = d3.tip()
 .attr('class', 'd3-tip')
 .offset([-10, 0])
 .html(d => `<strong>Value: </strong><span class='details'>${d.VALUE}<br></span>`);

 **/