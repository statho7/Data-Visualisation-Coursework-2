(function lines(){
var width = document.getElementById("chart").clientWidth;
var height = document.getElementById("chart").clientHeight;

var margin = {top:10, left:30, bottom:50, right:80}



var svg = d3.select("#chart")
  .append('svg')
    .attr('width', width)
    .attr('height', height)

var g = svg.append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');


    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


var x = d3.scaleTime()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);



var format = d3.timeParse("%Y");

var z = d3.scaleOrdinal(d3.schemeCategory10);


function draw(data, totals) {

console.log('totals', totals)

x.domain(d3.extent(data, function(d){return d.year}));
y.domain([d3.min(totals, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
d3.max(totals, function(c) { return d3.max(c.values, function(d) { return d.value; }); })]);


var xAxis = d3.axisBottom()
  .scale(x)
  .ticks(17);
  console.log(x.domain(d3.extent(data, function(d){return d.year})))


var yAxis = d3.axisLeft()
  .scale(y)
  .tickFormat(function(d){
    return d + "%"
  })



var line = d3.line()
  .curve(d3.curveMonotoneX)
  .x(function(d){return x(d.year)})
  .y(function(d){return y(d.value)});

var solvedNumber = totals[0].values.length -1
var solved = totals[0].values[solvedNumber].value

var passion = totals[1].values[36].value;
var gang = totals[2].values[36].value;



var path = g.selectAll(".info")
  .data(totals)

path
  .enter()
  .append('g')
    .attr('class', 'info')
  .append('path')
    .attr('class', 'line')
  .attr('fill', 'none')
  .attr("stroke", "steelblue")
  .attr('d', function(d){return line(d.values)})
  .style('stroke', function(d){return z(d.id)});


// path.append("text")
//   .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
//   .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.value) + ")"; })
//   .attr("x", 3)
//   .attr("dy", "0.35em")
//   .style("font", "10px sans-serif")
//   .text(function(d) { return d.id; });

g.append("text")
  .attr('class', 'lineText')
  .attr('transform', "translate(" + (width + 3) + "," + y(solved) + ")")
  .attr("dy", ".35em")
  .attr("text-anchor", "start")
  .text("Solved");

g.append("text")
  .attr('class', 'lineText')
  .attr('transform', "translate(" + (width + 3) + "," + y(passion) + ")")
  .attr("dy", ".35em")
  .attr('y', 2)
  .attr("text-anchor", "start")
  .text("Passion");

g.append("text")
  .attr('class', 'lineText')
  .attr('transform', "translate(" + (width + 3) + "," + y(gang) + ")")
  .attr('y', -3)
  .attr("dy", ".35em")
  .attr("text-anchor", "start")
  .text("Gang");



  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," +  height +")")
    .call(xAxis)
    .attr("font-family", 'Old Standard TT');


  g.append("g")
    .attr("class", "y axis")
    .attr("font-family", 'Old Standard TT')
    .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("font-family", 'Old Standard TT')
      .attr("font-size", "10px")

      svg.append('text')
        .attr('transform',
              "translate(" + (width/2) + "," + (height + 50) + ")")
        .attr('text-anchor', 'middle')
        .text('Years')
          .attr("font-weight", "bold")
          .attr('font-family', 'Old Standard TT')
          .attr('font-size', '16px')


      var mouseG = g.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(totals)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return z(d.id);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);

      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          // console.log(width/mouse[0])
          var xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.year; }).right;
              idx = bisect(d.values, xDate);

          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;


          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);

            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }

          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(1)+"%");

          return "translate(" + mouse[0] + "," + pos.y +")";
        });


})
}



// d3.queue()
//   .defer(d3.csv, "murderfinal.csv")
//   .defer(d3.csv, type, "murder_totals.csv")
//   .await(function(error, final, totals){
d3.csv("murder_total_percentages.csv", type, function(data){
  var data = data;

  var totals = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {year: d.year, value: d[id]};
      })
    };
  });


    // totals.forEach(function(d){
    //   d.year = format(d.year);
    //   d.percentage_solved = parseInt(d.percentage_solved);
    // })

    console.log(totals);


    draw(data, totals);







});

function type(d, _, columns) {
  d.year = format(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}




})();
