(function drawingLines(){

  var margin = {top:20, right:120, bottom:50, left:50};
  width = 960 - margin.left - margin.right;
  height = 500 - margin.top - margin.bottom;

  var format = d3.timeParse("%Y");

  var band_scale = d3.scaleBand()
          .range([0, width]);


  var x = d3.scaleTime()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

  var svg = d3.select("#countyLines")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + [margin.left, margin.top]+ ")")
      .attr('class', 'svg')

      var xAxis = d3.axisBottom()
        .scale(x)
        // .ticks(17);

      var yAxis = d3.axisLeft()
        .scale(y);

    var line = d3.line()
      .curve(d3.curveMonotoneX);




    var format = d3.timeParse("%Y");


  function type(d, _, columns) {
    d.years = format(d.years);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}


  function getCounty(data){
    var county = document.getElementById("county_list").value;
    var countyData = []
    for(i=0;i<data.length;i++){
      if (data[i].county == county){
        countyData.push({
          solved:data[i].solved,
          years:data[i].years,
          murders: data[i].murders,
          gang_killings: data[i].gang_killings,
          passion: data[i].passion_murder,
          murder_per_100_thousand:data[i].murder_per_100_thousand,
          pop:data[i].pop

        })
      } else {
        continue;
      }
    }
    countyData.forEach(function(d){
      // d.year = format(d.year);
      d.per100k = +d.per100k;
    })
    return countyData;
    // console.log(countyData);
  }

  function sorting(data){
    var totals = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {year: d.years, value: d[id]};
        })
      }
    });
    return totals

  }


  function clearAll(){
    d3.selectAll(".lines")
    .transition().duration(100)
      .attr("d", function(d){
        return null;
});
}

      function draw(data){

        clearAll()

        x.domain([data[0].years, data[data.length - 1].years]);
        y.domain([0, d3.max(data, function(d){return d.murder_per_100_thousand})]);

        line
          .x(function(d){return x(d.years)})
          .y(function(d){return y(d.murder_per_100_thousand)});

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," +  height +")")

        svg.select('.x.axis')
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")

        svg.select('.y.axis')
          .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")

        var path = svg.append("path")
          .data([data])
          .attr("class", "lines")
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke-width", "1.5px")


          svg.append('text')
            .attr('transform',
                  "translate(" + (width/2) + "," + (height + 40) + ")")
            .attr('text-anchor', 'middle')
            .text('Years')
              .attr("font-weight", "bold")
              .attr('font-family', 'Old Standard TT')
              .attr('font-size', '12px')

          svg.append('text')
            .attr('transform',
                  "translate(-40," + (height/2) + ")rotate(-90)")
            .attr('text-anchor', 'middle')
            .text('Murders per 100k')
            .attr("font-weight", "bold")
            .attr('font-family', 'Old Standard TT')
            .attr('font-size', '12px')


      }

      // function updateAxes(data){
      //   x.domain([data[0].years, data[data.length - 1].years]);
      //   y.domain([0, d3.max(data, function(d){return d.murder_per_100_thousand})]);
      //
      //   svg.select(".x.axis")
      //     .transition()
      // 	  .call(xAxis)
      //
      //     svg.select('.y.axis')
      //       .transition()
      //       .duration(500)
      //       .call(yAxis)
      // }

      function redraw(data){
        var cnty = getCounty(data);
        draw(cnty);

        var name = document.getElementById('county_list').value;
        document.getElementById('nameofcounty').innerHTML = name;

        console.log(cnty);

          var total = []
          var murder = []
          var solved = []
          for (i=0;i<cnty.length;i++){
            total.push(cnty[i].pop);
            murder.push(cnty[i].murders);
            solved.push(cnty[i].solved);

          }

        var population = total[36];
        var totalMurders = murder.reduce(function (a, b) {
          return a + b;
          });

        var totalSolved = solved.reduce(function (a, b){
          return a + b;
        });

        var percentageSolved = Math.round((totalSolved/totalMurders) *100) + "%"
        console.log(percentageSolved)

        document.getElementById('murder').innerHTML = totalMurders;
        document.getElementById('percentage').innerHTML = percentageSolved;
        document.getElementById('pop').innerHTML = population;





      }

      d3.csv("murderfinal.csv", function(data){
        var data = data;
        console.log(data);

        data.forEach(function(d){
          d.years = format(d.years);
          d.murder_per_100_thousand = +d.murder_per_100_thousand;
          d.murders = + d.murders;
          d.pop=+d.pop;
          d.solved=+d.solved
        })


        var cnty = getCounty(data);
        console.log(cnty);
        draw(cnty);

          d3.select('#county_list')
            .on('change', function(){
              redraw(data);


            })

      });

})();
