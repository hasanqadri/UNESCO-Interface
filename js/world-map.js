
function createWorldMap(dataSet) {
  const format = d3.format(',');

  // Set tooltips
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>${$("#factor").val()}: </strong><span class='details'>${format(d.data)}</span>`);
    $("#region").hide();
    $("#country").hide();
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select('#worldMap')
    .append('svg')
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
  .defer(d3.json, 'data/country_id.json')
  .defer(d3.json, 'data/correctFormatMockData.json')
  .await(ready);

  function ready(error, country_map, country_ids, dataSet) {
    const dataById = {};
    const color = d3.scaleLinear()
          .domain([
              d3.min(dataSet, d => d["VALUE"]),
              d3.max(dataSet, d => d["VALUE"])
          ])
          .range(d3.schemeBlues[9]);
    dataSet.forEach(d => { dataById[d['COUNTRY_ID']] = + d["VALUE"]; });
    country_map.features.forEach(d => { d.data = dataById[d.id] });
    console.log(dataById);

    svg.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(country_map.features)
      .enter().append('path')
        .attr('d', path)
        .style('fill', function(d) {
            return dataById[d.id] != undefined ? color(dataById[d.id]) : "#DCDCDC"
        })
        .style('stroke', 'white')
        .style('opacity', 0.8)
        .style('stroke-width', 0.3)
        // tooltips
        .on('mouseover',function(d){
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
    updateWorldColors();
    updateWorldLabels();
    updateWorldLegend();
}

/**
 *
 */
function updateWorldColors() {

}

function updateWorldLabels() {

}

function updateWorldLegend() {

}