currentCountry = null;
function createLineChart(data) {
    let cName = data[0]["COUNTRY_ID"]
    //margin
    let margin = {top: 20, right: 10, bottom: 40, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var parseTime = d3.timeParse("%Y");

    //ranges
    let x = d3.scaleTime().range([0, width]).domain([
        Math.min.apply(Math, data.map(function(o) { return o["YEAR"]})),
        Math.max.apply(Math, data.map(function(o) { return o["YEAR"]}))
    ]);

    let y = d3.scaleLinear().range([height, 0]);

    //define the line
    let valueline =  d3.line()
        .x(function(d) { return x(d["YEAR"]); })
        .y(function(d) { return y(d["VALUE"]); });

    let svg = d3.select("#region")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(d => {
        d.YEAR = parseTime(d.YEAR);
        d.VALUE = +d.VALUE;
    });

    data.sort((a,b) => (a.YEAR > b.YEAR) ? 1 : -1);

    //scale range
    x.domain(d3.extent(data, function(d) { return d["YEAR"]; }));
    y.domain([0, d3.max(data, function(d) { return +d["VALUE"]; })]);

    //value line path
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    //headingFigureOne
    svg.append("text")
    .attr("x", width/ 2 )
    .attr("y", 0)
    .style("font-weight","bold")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-family","Arial")
    .text(cName);

    //x axis
    svg.append("g")
        .style("font-size", "100px")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //xaxislabelfig1
    svg.append("text")
    .attr("x", width/2)
    .attr("y", height+35)
    .style("font-size", "20px")
    .style("font-family","Arial")
    .style("text-anchor", "middle")
    .text("Year");

    //y axis
    svg.append("g")
        .style("font-size", "100px")
        .call(d3.axisLeft(y));

    //yaxislabelfig1
    svg.append("text")
    .attr("x", -height/2)
    .attr("y", -80).attr("transform", "rotate(-90)")
    .style("font-size", "20px")
    .style("font-family","Arial")
    .style("text-anchor", "middle")
    .text($("#factor option:selected").html());
}

function updateLineChart(d = currentCountry) {
    let country = d.id;
    currentCountry = d.id;
    let indicator_id = $("#factor").val().split(",")[0];
    let document_id = $("#factor").val().split(",")[1];
    const dataById = {};
    lineChartDBCall(indicator_id, document_id,country).then(data => {
        $("#region").empty();
        createLineChart(data);
    });
}