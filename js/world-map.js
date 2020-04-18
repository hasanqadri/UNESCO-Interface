//Mapping of indicator id to label - used for UI
mappingIndicatorId = {"200101": "Population", "40055": "Enrollment in Early Childhood Education (Both Sexes"}
//Mapping of indicator id to document id - used for DB call
mappingDocumentId = {"200101": "DEM_DATA_NATIONAL", "40055": "EDUN_LABEL"}
function createWorldMap(dataSet) {
  const format = d3.format(',');

  // Set tooltips
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>${mappingIndicatorId[$("#factor").val()]}: </strong><span class='details'>${d.data}</span>`);
    $("#region").hide();
    $("#country").hide();
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  var svg = d3.select('#worldMap')
    .append('svg')
      .attr('class','myMap')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map');

  const projection = d3.geoRobinson()
    .scale(170)
    .rotate([352, 0, 0])
    .translate( [width / 2, height / 2.1]);

  const path = d3.geoPath().projection(projection);

  svg.call(tip);
  queue()
  .defer(d3.json, 'data/world_countries.json')
  .await(ready);

  function ready(error, country_map) {
    const dataById = {};
    const color = d3.scaleLinear()
          .domain([
              d3.min(dataSet, d => d["VALUE"]),
              d3.max(dataSet, d => d["VALUE"])
          ])
          .range(d3.schemeBlues[9]);
    createLegend(dataSet);
    dataSet.forEach(d => { dataById[d['COUNTRY_ID']] = + d["VALUE"]; });
    country_map.features.forEach(function(d) {
        d.data = !isNaN(dataById[d.id]) ? dataById[d.id] : "Not available"
    });

    svg.append('g')
      .attr('class', 'map')
      .selectAll('.countries')
      .data(country_map.features)
      .enter().append('path')
        .attr('class', 'country')
        .attr('d', path)
        .style('fill', function(d) {
            return dataById[d.id] != undefined ? color(dataById[d.id]) : "#DCDCDC"
        })
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover',function(d){
            console.log('t1')
            tip.show(d);
          //console.log(d)
          d3.select(this)
            .style('opacity', 1)
            .style('stroke-width', 3);
        })
        .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width',0.3);
        });

    svg.append('path')
      .datum(topojson.mesh(country_map.features, (a, b) => a.id !== b.id))
      .attr('class', 'names')
      .attr('d', path);
  }
}

/**
 * When new factor is chosen, then the colors, tooltips, and legend works
 */
function updateWorldMap() {

    let year = $("#year").val();
    let indicator_id = $("#factor").val();
    let document_id = mappingDocumentId[$("#factor").val()];
    const dataById = {};

    genericDBCall(year, indicator_id, document_id).then(dataSet => {
        $("#worldMap").empty();
        createWorldMap(dataSet);

        //Delete legend
        $("#legend").remove();
        createLegend(dataSet)
    });
}

function createLegend(dataSet) {

    //Instantiate svg
    var margin = {top: 20,
            right: 90,
            bottom: 30,
            left: 60},
        width = 440 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const color = d3.scaleLinear()
        .domain([
            d3.min(dataSet, d => d["VALUE"]),
            d3.max(dataSet, d => d["VALUE"])
        ])
        .range(d3.schemeBlues[9]);
    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852

    var legend = d3.select(".innerContainer").append("svg")
        .attr("class", "legend")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .selectAll("g")
        .data(color.range().slice())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return d});


    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d, i) {
            return i/10;
        });

}