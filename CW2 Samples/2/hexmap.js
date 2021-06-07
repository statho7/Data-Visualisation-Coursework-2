(function hex(){
    var margin = {top: 10, right: 20, bottom: 10, left: 10},
      width = 500 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var svg;
    var g;

    var murders;

    var color = d3.scaleQuantize()
      .range(["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"]);


    var hexmap;

    var tooltip = d3.select("body")
        .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);


    var colorLegend = d3.scaleQuantize()
      .range(["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"])

    var legend = d3.legendColor()
      .labelFormat(d3.format(".1f"))
      .scale(colorLegend);

    var svg = d3.select("#map")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (width/4) + "," + margin.top + ")");


    function draw(hexjson, data) {

      var domain = []
      for (var i=0;i<data.length;i++) {
        // var high = data[i].youth_murder_per_100k;
        // domain.push(high);
        if (data[i].county == 'Amador'){
          console.log(typeof data[i].unsolved_percentage);
        }
      }





      color.domain([
        d3.min(data, function(d){return d.unsolved_percentage}),
        d3.max(data, function(d){return d.unsolved_percentage})]);



      var hexes = d3.renderHexJSON(hexjson, width, height);

      // Bind the hexes to g elements of the svg and position them
       hexmap = svg
        .selectAll("g")
        .data(hexes)
        .enter()
        .append("g")
        .attr("transform", function(hex) {
          return "translate(" + hex.x + "," + hex.y + ")";
        });

      // Draw the polygons around each hex's centre
      hexmap
        .append("polygon")
        .attr("id", function(d){
          return d.key;
        })
        .attr("points", function(hex) {return hex.points;})
        .attr("stroke", "#FFFFF7")
        .attr("stroke-width", "2")
        .attr("fill", function(d){
          for(var i=0;i<data.length;i++) {
            if(data[i].county == d.key) {
              return color(data[i].unsolved_percentage);
            }
          }
        })


        hexmap
          .append("text")
          .append("tspan")
          .attr("text-anchor", "middle")
          .text(function(hex) {return hex.id;})
          .style("font-size", "9px")
          .style("fill", function(d){
            var poly = document.getElementById(d.key);
            var fill = poly.attributes.fill.textContent;
            if (fill == "#fee5d9" || fill == "#fcbba1" || fill == "#fc9272") {
              return "black";
            } else {
              return "white";
            }

          })


        hexmap
          .on("mouseover", function(d){
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            for(var i = 0;i<data.length;i++){
              if (data[i].county == d.key) {
                // var percentage = data[i].unsolved_percentage.toFixed(1) + "%"

                tooltip.text(d.key + " " + data[i].unsolved_percentage.toFixed(1) + "%")
                .style("left", (d3.event.pageX+10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
              }
            }


          })
          .on("mouseout", function(d) {
            tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

      colorLegend
        .domain([0, d3.max(data, function(d){return d.unsolved_percentage})])


        svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(-100,60)");



        svg.select(".legendQuant")
          .style("font-size","12px")
          .call(legend);

        svg.append("g")
          .attr("transform", "translate(-90, 30)")
          .append("text")
            .attr("dy", "0em")
            .style("font-weight", "bold")
            .style("font-size", "12px")
            .text("Percent of Unsolved")
          .append("tspan")
            .attr("dy", "1.3em")
            .attr("dx", "-7em")
            .style("font-weight", "bold")
            .text("Homicides")




    }


    function init() {

      d3.queue()
        .defer(d3.json, "ca_counties.hexjson")
        .defer(d3.csv, "murderfinal.csv")
        .await(function(error, hexjson, data){

          data.forEach(function(d){
            d.unsolved_percentage = +d.unsolved_percentage;
          })


          console.log(hexjson);
          console.log(data);

          var murder = []

          for(var i=0;i<data.length; i++) {
            if (data[i].years == 2000) {
              murder.push(data[i]);
            }
          }

          var countyList = []
          for (var i=0; i<murder.length; i++){
            countyList.push(murder[i].county)
          }
          murders = murder;
          console.log(murders);

          draw(hexjson, murders);

          var slider = document.getElementById("rating");
          slider.addEventListener("change", function() {
            var sliderValue = document.getElementById('rating').value;
            document.getElementById('sliderVal').innerHTML = sliderValue;
            var years = getYear(data, sliderValue);
            console.log(years);




          recolor(hexjson, years);


    })

    function getYear(data, date) {
      var year =[];
      for (i=0; i <data.length; i++) {
         if (data[i].years == date) {
          year.push(data[i]);
        }
      }

      return year;
    }


    function recolor(hexjson, years) {
      console.log('years', years)

      color.domain([
        d3.min(years, function(d){return d.unsolved_percentage}),
        d3.max(years, function(d){return d.unsolved_percentage})]);

      var hexes = d3.renderHexJSON(hexjson, width, height);
      console.log('hexes', hexes)
      var poly = d3.selectAll('polygon')
        .data(hexes)
        .attr("fill", function(d){
          for(var i=0;i<years.length;i++) {
            if(years[i].county == d.key) {
              return color(years[i].unsolved_percentage);

            }
          }

        })

        hexmap
          .on("mouseover", function(d){
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            for(var i = 0;i<years.length;i++){
              if (years[i].county == d.key) {
                // var percentage = data[i].unsolved_percentage.toFixed(1) + "%"

                tooltip.text(d.key + " " + years[i].unsolved_percentage.toFixed(1)+"%")
                .style("left", (d3.event.pageX+10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
              }
            }


          })
          .on("mouseout", function(d) {
            tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

        colorLegend
          .domain([0, d3.max(years, function(d){return d.unsolved_percentage})])


          svg.select(".legendQuant")
            .call(legend);

        //how did i grab the key from this?
        var text = hexmap.selectAll('tspan')
          .style("fill", function(d){
            var poly = document.getElementById(d.key);
            var fill = poly.attributes.fill.textContent;
            if (fill == "#fee5d9" || fill == "#fcbba1" || fill == "#fc9272") {
              return "black";
            } else {
              return "white";
            }

          })






          };
      })
    }

      init();
    })();
