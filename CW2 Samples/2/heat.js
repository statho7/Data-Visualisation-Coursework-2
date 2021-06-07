(function heat(){

var margin = {
  top:150,
  right: 100,
  bottom:65,
  left:100
}
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select("#heat")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var color = d3.scaleQuantize()
  // .range(["#cb181d","#fb6a4a","#fee5d9"]);
  .range(["#a50f15","#de2d26", "#fcae91", "#fee5d9"]);

  // "#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"

var gridSize = Math.floor(width / 25);
console.log(gridSize);




function draw(data, counties, years){

  var tip = d3.tip()
        .attr('class', 'd3-tip')
        .style("visibility","visible")
        .offset([-20, 0])
        .html(function(d) {
          return "Solved:  <span style='color:red'>" + Math.round(d.percentage_solved) +
          "%" + "<br> <span style='color:white'> Murders <span style='color:red'>"+d.murders +
          "<br> <span style='color:white'> Gang Killings:  <span style='color:red'>" +Math.round(d.percentage_gang_killings)
        + "%"})

  svg.append("g")
    .call(tip);

  console.log(counties);

  color.domain([0, 100]);



  var rowLabels = svg.append('g')
        .selectAll(".counties")
        .data(counties)
        .enter()
        .append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * 20; })
          .style("text-anchor", "end")
          .style('font-size', '10px')
          .style('font-weight', 'bold')
          .attr("transform", "translate(-6," + gridSize / 2.5+ ")")
          .attr("class","yaxis")
        // .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        // .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});

  var columnLabels = svg.append('g')
    .attr('transform', 'translate(0,' + (height + 34) +')')
    .selectAll('.years')
    .data(years)
    .enter()
    .append('g')
    .attr('transform', function(d, i){
      return 'translate(' + (i * 20) +  ',6)'
    })
    .append('text')
      .text(function (d) { return d; })
      .style("text-anchor", "start")
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .attr("transform", "translate(" + 0 + ", -6)rotate(-45)")
      .attr("class","mono")


  var heatMap = svg.append('g')
        .selectAll(".dim2")
       .data(data, function(d){return d.county_code+':'+d.year_code;})
       .enter()
       .append("rect")
       .attr("x", function(d) { return (d.year_code - 1) * 20; })
       .attr("y", function(d) { return (d.county_code -1) * 20; })
       .attr("rx", 4)
       .attr("ry", 4)
       .attr("class", "dim2 bordered")
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", function(d){
         if(d.murders == 0){
           return "#fee5d9";
         } else {
           return color(d.percentage_solved);
         }
       })
       .attr("class", "square")
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);


   var quantize = d3.scaleQuantize()
     .domain([0, 100])
     .range(["#a50f15","#de2d26", "#fcae91", "#fee5d9"]);



   svg.append("g")
     .attr("class", "legendQuant")
     .attr("transform", "translate(650, -120)");

   var legend = d3.legendColor()
     // .labelFormat(d3.format(".1f"))
     // .useClass(true)
     .title("Percentage of Murders Solved")
     // .titleWidth(100)
     .scale(quantize);

   svg.select(".legendQuant")
     .call(legend);
}


d3.csv("heatmap.csv", function(error, data){
  var newdata = data;

  newdata.forEach(function(d){
    d.murders = +d.murders,
    d.percentage_solved = +d.percentage_solved,
    d.pop = +d.pop
  })

  data = []
  for (i=0;i<newdata.length;i++){
    if(newdata[i].pop <0){
      continue;
    } else{
      data.push(newdata[i]);
    }
  }

  var counties = []
  for(i=0;i<data.length;i++){
    if (counties.includes(data[i].county)){
      continue;
    } else {
      counties.push(data[i].county);
    }
  }

  var years = [];
  for(i=0;i<data.length;i++){
    if (years.includes(data[i].years)){
      continue;
    } else {
      years.push(data[i].years);
    }
  }



  draw(data, counties, years);

  console.log(data);
  console.log(counties);
  console.log(years);
})

})();
