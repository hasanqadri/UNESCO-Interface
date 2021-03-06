var margin = {top: 50, right: 0, bottom: 75, left: 300}
  , width = 650 - margin.left - margin.right
  , height = 500 - margin.top - margin.bottom;

function convert_row(d){
    cols_c = Object.keys(d);
    obj_c = {Variables: d.Variables};
    for (c in cols_c){
        if (c > 0){
            obj_c[cols_c[c]] = +d[cols_c[c]];
        }
    }
    return obj_c;
}

function convert_ind_row(d){
    obj_c = {INDICATOR_ID: d.INDICATOR_ID, ROOT: d.ROOT,FILE: d.FILE,DESCRIPTION: d.DESCRIPTION};
    return obj_c;
}

function convert_scatter_row(d){
    cols = Object.keys(d);
    // console.log(d['Indicator1']);
    obj = {Countries: d.Countries};
    // console.log(obj);

    for (c in cols){
        if (c > 0){
            obj[cols[c]] = +d[cols[c]];
        }
    }
    return obj;
}

function get_metadata(){
    d3.dsv(",", "../data/indicator_file.csv", convert_ind_row)
        .then(function(data){
            variables = data
            file_names = []
            variables.forEach(ind =>{
                let obj = {"key": ind['INDICATOR_ID'], "file": ind["ROOT"].split(',')[0]+"_DATA_NATIONAL"}
                file_names.push(obj)
            });

            d3.dsv(",", "../data/SDG/SDG_COUNTRY.csv").then(function(data){
                countries = {}
                data.forEach(d=>countries[d["COUNTRY_ID"]]=d["COUNTRY_NAME_EN"])
            });
        });
}

//d3.dsv(",", "../data/dummy_data_cor.csv", convert_row)
//    .then(function(data){
//        raw_data = data;
//        //indicator_data = d3.nest().key(function(d) {return d.Variables; }).entries(raw_data)
//        cols_c.splice(cols_c.indexOf('Variables'), 1);
//        d3.dsv(",", "../data/dummy_data.csv", convert_scatter_row)
//            .then(function(data){
//                scatter_data = data;
//
//        add_select_box(cols_c);
//        for (col in cols_c){
//            add_bar_chart(cols_c[col])
//        }
//        // add_bar_chart(cols_c);
//        add_scatter_chart("Indicator1","Indicator2");
//        });
//    });

function add_select_box(){
    d3.select("#selector")
        .append("text")
        .attr("font-size", "12px")
        .text("Select Indicator: ");
        // .append("select", "svg")

        var selector = d3.select("#selector")
        .append("select")
        .attr("id", "dropselector")
        .style('margin-top','20px')
        .selectAll("option")
        .data(cols_c)
        .enter().append("option")
        .text(function(d) { return d; })
        .attr("value", function (d, i) {
            return d;
        });

    d3.select("#selector").property("selectedIndex", cols_c);
    d3.select("#selector")
        .on("change", function(d) {
            var selected = d3.select("#dropselector").node().value;
            change_chart(selected);
    })
}
function get_ind(target){
    for(j=0; j<variables.length; j++){
            if(variables[j]["INDICATOR_ID"] != target[0]["INDICATOR_ID"] && +target[0][variables[j]["INDICATOR_ID"]]>0){
                ind_2 = variables[j]["INDICATOR_ID"]
                doc_id = file_names.find((itmInner) => itmInner.key === ind_2).file
            }
        }
}

function change_chart(indicator){
    let year = $("#year").val();
    let indicator_id = $("#factor").val().split(",")[0];
    let document_id = $("#factor").val().split(",")[1];
    d3.selectAll(".barchart").remove();
    d3.selectAll(".bubblechart").remove();

    corrDBCall(indicator_id, 'correlation').then(
        c_result => {
        add_bar_chart(c_result)

        var promises = [get_ind(c_result)];
        Promise.all(promises).then(ready_scat);
        function ready_scat(e){
            genericDBCall(year, indicator_id, document_id).then(res_1 => {
                genericDBCall(year, ind_2, doc_id).then(res_2 => {
                    add_scatter_chart(res_1, res_2)
                });
            });
        }
    });
}

var svg_b = d3.select("#correlationChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

function add_bar_chart(target){

    corr_data = []
    for(j=0; j<variables.length; j++){
        if(variables[j]["INDICATOR_ID"] != target[0]["INDICATOR_ID"]){
            obj = {"key": variables[j]["INDICATOR_ID"], "value": +target[0][variables[j]["INDICATOR_ID"]], "desc":variables[j]["DESCRIPTION"]}
            corr_data.push(obj)
        }
        else{
            target_desc = variables[j]["DESCRIPTION"]
        }
    }
    corr_data.sort(function(a,b){return a.value - b.value})
    console.log(corr_data)

    svg_bar = svg_b.append("g")
        .attr("class", "barchart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var barPadding = 0.5;
    xScale = d3.scaleLinear().range([0, width]),
    yScale = d3.scaleBand().range([height, 0]).padding(barPadding);

    corr_data = corr_data.filter(function(d) {return d.value > 0;})
    yScale.domain(corr_data.map(function(d){return d.desc; }));
    xScale.domain([0, 1]);

    svg_bar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
//        .selectAll("text")
//        .attr("y", 0)
//        .attr("x", 9)
//        .attr("dy", ".35em")
//        .attr("transform", "rotate(90)")
//        .style("text-anchor", "start");

    svg_bar.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg_bar.selectAll("rect")
         .data(corr_data)
         .enter().append("rect")
         .attr("class", "bar-blue")
         //.attr("fill", "steelblue")
         .attr("x", 0)
         .attr("y", function(d) { return yScale(d.desc); })
         .attr("width", function(d) { return xScale(d.value); })
         .attr("height", function(d) {return yScale.bandwidth(); })
         .on('click', function(d){onMouseClick(target[0]['INDICATOR_ID'], d.key)});

//    svg_bar.append("text")
//      .attr("transform", "rotate(-90)")
//      .attr("y", -60)
//      .attr("x",0 - (height / 2))
//      .attr("dy", "1em")
//      .attr("font-size", "15px")
//      .style("text-anchor", "middle")
//      .text("Correlation Value");

    svg_bar.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.bottom/2) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "15px")
      .text("Correlation with "+target_desc);

}

//Scatter Plot
function onMouseClick(x, y){
    d3.selectAll(".bubblechart").remove();
    doc_x = file_names.find((itmInner) => itmInner.key === x).file
    doc_y = file_names.find((itmInner) => itmInner.key === y).file

    let year = $("#year").val();
    genericDBCall(year, x, doc_x).then(res_1 => {
                genericDBCall(year, y, doc_y).then(res_2 => {
                console.log("Got db data!!")
                add_scatter_chart(res_1, res_2)
        });
    });
    //add_scatter_chart(x,y);
}
var svg_scatter = d3.select("#scatterChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


function add_scatter_chart(x_scat,y_scat){

    data = []
    for (i=0; i<x_scat.length; i++){
        obj = {}
        obj["COUNTRY_ID"] = x_scat[i]["COUNTRY_ID"]
        obj["X_VALUE"] = x_scat[i]["VALUE"]
        data.push(obj)
    }

    let merged = []
    for(let i=0; i<data.length; i++) {
          y_value = y_scat.find((itmInner) => itmInner["COUNTRY_ID"] === data[i]["COUNTRY_ID"])
          if(y_value){
              merged.push({
               ...data[i],
               ...(y_value)}
              );
          }
    }

    left = margin.left - 150
    var svg = svg_scatter.append("g")
                        .attr("class", "bubblechart")
                        .attr("transform", "translate(" + left + "," + margin.top + ")");

    yScale = d3.scaleLinear().range([height, 0]),
    xScale = d3.scaleLinear().range([0, width]);

    xScale.domain([0, 1.1*d3.max(merged, function(d){return +d["X_VALUE"]; })]);
    yScale.domain([0, 1.1*d3.max(merged, function(d) { return +d["VALUE"]; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(8));

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .style("stroke", "gray")
        .html(function(d) { return "<strong>Country:</strong><span class='details'> "+countries[d['COUNTRY_ID']]+"<br></span><strong>x:</strong><span class='details'> "+ d['X_VALUE']+"<br/></span><strong>y:</strong><span class='details'> "+ d['VALUE'];})


    svg_scatter.call(tip);


    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg.append('g')
        .selectAll("dot")
        .data(merged)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(+d['X_VALUE']); } )
        .attr("cy", function (d) { return yScale(+d["VALUE"]); } )
        .attr("r", 5)//function(d){return d["Population"]/1000})
        .style("fill", "maroon")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    let y_label = variables.find((itmInner) => itmInner['INDICATOR_ID'] === y_scat[0]['INDICATOR_ID'])['DESCRIPTION']
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("font-size", "15px")
      .style("text-anchor", "middle")
      .text(y_label);

    let x_label = variables.find((itmInner) => itmInner['INDICATOR_ID'] === x_scat[0]['INDICATOR_ID'])['DESCRIPTION']

    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.bottom/2) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "15px")
      .text(x_label);
}