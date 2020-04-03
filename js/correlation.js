var margin = {top: 50, right: 75, bottom: 75, left: 75}
  , width = 500 - margin.left - margin.right
  , height = 500 - margin.top - margin.bottom;

function convert_row(d){
    cols = Object.keys(d);
    obj = {Variables: d.Variables};
    for (c in cols){
        if (c > 0){
            obj[cols[c]] = +d[cols[c]];
        }
    }
    return obj;
}

d3.dsv(",", "../data/dummy_data_cor.csv", convert_row)
    .then(function(data){
        raw_data = data;

        add_bar_chart("Indicator1");

    });

function add_bar_chart(target){
    console.log(raw_data);
    svg_bar = d3.select("#correlationChart")
        .attr("class", "barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var barPadding = 0.25;
    yScale = d3.scaleLinear().range([height, 0]),
    xScale = d3.scaleBand().range([0, width]).padding(barPadding);

    xScale.domain(raw_data.map(function(d){return d.Variables; }));
    yScale.domain([0, 1]);

    svg_bar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg_bar.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg_bar.selectAll("rect")
         .data(raw_data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("fill", "steelblue")
         .attr("x", function(d) { return xScale(d.Variables); })
         .attr("y", function(d) { return yScale(d[target]); })
         .attr("width", function(d) { return xScale.bandwidth(); })
         .attr("height", function(d) {return yScale(1-d[target]); });

}