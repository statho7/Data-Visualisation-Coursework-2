(function run(){

  var margin = {
    top:50,
    right: 20,
    bottom:100,
    left:75
  }



  var width = 600 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;



  var colors = d3.scaleOrdinal()
    .domain(["gang killings", "passion murder", "other"])
    .range(["#a50f15","#ffeda0","#feb24c"]);

  var colorz = d3.scaleOrdinal()
    .domain(["gang killings", "passion murder", "other"])
    .range(["#a50f15", "#ffeda0","#feb24c"]);


    var svg = d3.select("#vis")
        .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)

    g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + 70 + ")");

  var stack = d3.stack()





function make(dataset, data) {

  stack
    .keys([ "percentage_gang_killings", "percentage_passion", "percentage_other"])
    .order(d3.stackOrderDescending);

  var series = stack(dataset);

  var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .paddingInner(0.05);

  var yScale = d3.scaleLinear()
    .domain([0, 100])
      // d3.max(dataset, function(d) {
      // 	return d.gang_killings + d.passion_murder;
      // })
    // ])
    .range([height, 0]);

  var yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(function(d){
      return d + "%"
    })

  var listCounty = dataset.map(function(d){return d.county});

  var x = d3.scaleBand()
    .domain(listCounty)
    .range([0, width])
    .paddingInner(0.05);

  var xAxis = d3.axisBottom()
    .scale(x);




  g.selectAll(".serie")
    .data(series)
    .enter()
    .append("g")
      .attr('class', 'serie')
      .attr("fill", function(d, i) {
        return colors(i);
      })

  .selectAll('rect')
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(d[1]);
    })
    .attr("height", function(d) {
      return yScale(d[0]) - yScale(d[1]);
    })
    .attr("width", xScale.bandwidth());


    g.append('g')
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("y", 0)
          .attr("x", -8)
          .attr("dy", ".35em")
        .attr("transform", "rotate(-65)");

    g.append('g')
      .attr("transform", "translate(" + -5+ ",0)")
      .attr('class', 'y axis');

    g.select('.y.axis')
      .call(yAxis);


    svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(400,10)");

    var legendOrdinal = d3.legendColor()
      .scale(colorz);

    svg.select(".legendOrdinal")
      .style("font-size", "12px")
      .call(legendOrdinal);


    g.append('text')
      .attr('transform',
            "translate(" + (width/2) + "," + (height + 100) + ")")
      .attr('text-anchor', 'middle')
      .style("font-size", "20px")
      .text('California Counties')

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text('Percentage of Types of Murders')




  console.log(series);

  }


  d3.csv("murderfinal.csv", function(data){

    data.forEach(function(d){
      d["percentage_gang_killings"] = +d["percentage_gang_killings"],
      d["percentage_passion"] = +d["percentage_passion"],
      d["percentage_other"] = + d["percentage_other"]
     });


    data = data;
    console.log(data);

    var dataset = []
    for (var i=0; i<data.length;i++) {
      if (data[i].years == 2000 && data[i].murders >0) {
        dataset.push(data[i]);
      }
    }
    console.log(dataset);

    make(dataset);


    var slider = document.getElementById("rating");
    slider.addEventListener("change", function() {
      var sliderValue = document.getElementById('rating').value;
      document.getElementById('sliderVal').innerHTML = sliderValue;
      var years = getYear(data, sliderValue);
      console.log(years);
      changed(years, sliderValue);

})


function getYear(data, date) {
var year =[];
for (i=0; i <data.length; i++) {
   if (data[i].years == date && data[i].murders>0) {
    year.push(data[i]);
  }
}

return year;
}


function changed(year, slider) {


stack
  .keys([ "percentage_gang_killings", "percentage_passion", "percentage_other"])
  .order(d3.stackOrderDescending);

var series = stack(year);

var xScale = d3.scaleBand()
  .domain(d3.range(year.length))
  .range([0, width])
  .paddingInner(0.05);

var yScale = d3.scaleLinear()
  .domain([0, 100])
    // d3.max(dataset, function(d) {
    // 	return d.gang_killings + d.passion_murder;
    // })
  // ])
  .range([height, 0]);


  var yAxis = d3.axisLeft()
    .scale(yScale);

  var listCounty = year.map(function(d){return d.county});

  var x = d3.scaleBand()
    .domain(listCounty)
    .range([0, width])
    .paddingInner(0.05);

  var xAxis = d3.axisBottom()
    .scale(x);

  var barSections = g
    .selectAll('.serie')
    .data(series)

  var bars = barSections
    .enter()
    .append('g')
    .merge(barSections)
    .attr("fill", function(d, i) {
      return colors(i);
    })
    // .attr('transform', (d,i)=> {console.log(x0(nameKeys[i])); return 'translate(' + x0(nameKeys[i]) + ',0)'} )
    .selectAll('rect')
    .data(function(d) { return d; })

    var enterBars = bars
    .enter()
    .append('rect')
    .attr('y', height)
    .attr('x', width/2)

    bars
    .exit()
    .transition()
    .remove()

    enterBars
    .merge(bars)
    .transition()
    .duration(500)
    .attr("height", function(d) {
      return yScale(d[0]) - yScale(d[1]);
    })
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(d[1]);
    })
    .attr("width", xScale.bandwidth());

    g.select('.x.axis')
        .call(xAxis)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("y", 0)
          .attr("x", -8)
          .attr("dy", ".35em")
        .attr("transform", "rotate(-65)");

}






//     g.selectAll(".serie")
//       .data(series)
//       .selectAll("rect")
//       .data(function(d) { return d; })
//       .transition()
//       .duration(500)
//       .attr("height", function(d) {
//         return yScale(d[0]) - yScale(d[1]);
//       })
//       .attr("x", function(d, i) {
//         return xScale(i);
//       })
//       .attr("y", function(d) {
//         return yScale(d[1]);
//       })
//       .attr("width", xScale.bandwidth());
//
// }

})
})();
