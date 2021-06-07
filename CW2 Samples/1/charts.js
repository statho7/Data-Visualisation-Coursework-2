//namespacing with a self-invoked function
(function birdsChart(){

	//set the width and height of the charts
	var width = 1000, height = 400;

	//set the end of the first chart and the start of the second
	var stop = 400, start = 430;

	//set the padding of the A version charts [top, right, bottom, left]
	var paddingChartsA = [50, 20, 32, 50];

	//set the padding of the B version charts [top, right, bottom, left]
	var paddingChartsB = [50, 48, 32, 50];

	//sets the tooltip div for version A charts
	var tooltip = d3.select("body").append("div")   
		.attr("class", "tooltip")               
		.style("opacity", 0);

	//creates an ordinal scale for the colors of the circles
	var colorScale = d3.scale.ordinal()
		.domain(["birdsAll","birdsFarmland","birdsWoodland","birdsWater","birdsSea","birdsWintering",
			"birdsWildfowl","birdsWaders","landConversion","landFully","landTotal","ammonia","nitrogen",
			"sulphur","nonMethane","pm10","pm2"])
		.range(['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666',
			'#1b9e77','#d95f02','#7570b3','#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02']);

	//stores all the texts for title, axes and tooltips
	var labelObject = {
		"birdsAll": {
			"titleChartA": "BIRDS (all species)",
			"titleChartB": "BIRDS (all species)",
			"tooltipChart": "N\u00BA of species of birds (all species)",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Birds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsFarmland": {
			"titleChartA": "FARMLAND BIRDS",
			"titleChartB": "FARMLAND BIRDS",
			"tooltipChart": "N\u00BA of species of Farmland Birds",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Farmland Birds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsWoodland": {
			"titleChartA": "WOODLAND BIRDS",
			"titleChartB": "WOODLAND BIRDS",
			"tooltipChart": "N\u00BA of species of Woodland Birds",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Woodland Birds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsWater": {
			"titleChartA": "WATER AND WETLAND BIRDS",
			"titleChartB": "WATER AND WETLAND BIRDS",
			"tooltipChart": "N\u00BA of species of Water and Wetland Birds",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species, Water and Wetland Birds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsSea": {
			"titleChartA": "SEABIRDS",
			"titleChartB": "SEABIRDS",
			"tooltipChart": "N\u00BA of species of Seabirds",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Seabirds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsWintering": {
			"titleChartA": "WINTERING WATER BIRDS",
			"titleChartB": "WINTERING WATER BIRDS",
			"tooltipChart": "N\u00BA of species of Wintering Water Birds",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Wintering Water Birds",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsWildfowl": {
			"titleChartA": "WILDFOWL",
			"titleChartB": "WILDFOWL",
			"tooltipChart": "N\u00BA of species of Wildfowl",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Wildfowl",
			"axisLine2": "(in %, relative to 1970)"
		},
		"birdsWaders": {
			"titleChartA": "WADERS",
			"titleChartB": "WADERS",
			"tooltipChart": "N\u00BA of species of Waders",
			"tooltipChartUnit": "% (relative to 1970 number)",
			"axisLine1": "N\u00BA of species of Waders",
			"axisLine2": "(in %, relative to 1970)"
		},
		"landConversion": {
			"titleChartA": "IN CONVERSION LAND AREA",
			"titleChartB": "IN CONVERSION LAND AREA",
			"tooltipChart": "In conversion land area",
			"tooltipChartUnit": " thousand hectares",
			"axisLine1": "Area of In Conversion land",
			"axisLine2": "(in thousand of hectares)"
		},
		"landFully": {
			"titleChartA": "FULLY ORGANIC LAND AREA",
			"titleChartB": "FULLY ORGANIC LAND AREA",
			"tooltipChart": "Fully organic land area",
			"tooltipChartUnit": " thousand hectares",
			"axisLine1": "Area of Fully Organic land",
			"axisLine2": "(in thousand of hectares)"
		},
		"landTotal": {
			"titleChartA": "TOTAL ORGANIC LAND AREA",
			"titleChartB": "TOTAL ORGANIC LAND AREA",
			"tooltipChart": "Total organic land area",
			"tooltipChartUnit": " thousand hectares",
			"axisLine1": "Total Organic land area",
			"axisLine2": "(in thousand of hectares)"
		},
		"ammonia": {
			"titleChartA": "AMMONIA EMISSIONS",
			"titleChartB": "AMMONIA EMISSIONS",
			"tooltipChart": "Ammonia emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of Ammonia",
			"axisLine2": "(in thousand tonnes)"
		},
		"nitrogen": {
			"titleChartA": "NITROGEN OXIDES EMISSIONS",
			"titleChartB": "NITROGEN OXIDES EMISSIONS",
			"tooltipChart": "Nitrogen Oxides emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of Nitrogen Oxides",
			"axisLine2": "(in thousand tonnes)"
		},
		"sulphur": {
			"titleChartA": "SULPHUR DIOXIDE EMISSIONS",
			"titleChartB": "SULPHUR DIOXIDE EMISSIONS",
			"tooltipChart": "Sulphur Dioxide emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of Sulphur Dioxide",
			"axisLine2": "(in thousand tonnes)"
			},
		"nonMethane": {
			"titleChartA": "NMVOCs EMISSIONS",
			"titleChartB": "NMVOCs EMISSIONS",
			"tooltipChart": "NMVOCs emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of NMVOCs",
			"axisLine2": "(in thousand tonnes)"
			},
		"pm10": {
			"titleChartA": "PARTICULATE MATTER 10 EMISSIONS",
			"titleChartB": "PARTICULATE MATTER 10 EMISSIONS",
			"tooltipChart": "Particulate Matter 10mcm emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of Particulate Matter 10mcm",
			"axisLine2": "(in thousand tonnes)"
			},
		"pm2": {
			"titleChartA": "PARTICULATE MATTER 2.5 EMISSIONS",
			"titleChartB": "PARTICULATE MATTER 2.5 EMISSIONS",
			"tooltipChart": "Particulate Matter 2.5mcm emissions",
			"tooltipChartUnit": " thousand tonnes",
			"axisLine1": "Emissions of Particulate Matter 2.5mcm",
			"axisLine2": "(in thousand tonnes)"
		}
	};

	var formatNumber = d3.format(",.2f");

	var formatR = d3.format("+.2f");

	//avoids button click before the chart is ready
	d3.selectAll(".btn-group").style("pointer-events", "none");

	setTimeout(function(){
		d3.selectAll(".btn-group").style("pointer-events", "all");
	}, 2700);

	//unchecks the checkboxes
	var checkboxes = document.getElementsByTagName('input');

	for (var i=0; i<checkboxes.length; i++)  {
	if (checkboxes[i].type == "checkbox")   {
		checkboxes[i].checked = false;
		}
	}

	//load the csv
	d3.csv("birdsDataset.csv", function(data){

		//call function drawChart 3 times
		drawChart("#svganchor1", "birdsAll", "landConversion", "1");
		drawChart("#svganchor2", "landTotal", "birdsAll", "2");
		drawChart("#svganchor3", "birdsAll", "ammonia", "3");

		//function to draw the charts
		function drawChart(selector, constantVariable, variable2, index){

			//tracks the current state of the version b charts
			var merged = true;

			//set the y scale for the version a charts
			var yScaleChartA = d3.scale.linear()
				.range([ height  - paddingChartsA[2], paddingChartsA[0] ]);

			//set the y scale for the version b charts, constant variable
			var yScaleChartBvarCons = d3.scale.linear()
				.range([ height  - paddingChartsB[2], paddingChartsB[0] ]);

			//set the y scale for the version b charts, variable 2
			var yScaleChartBvar2 = d3.scale.linear()
				.range([ height  - paddingChartsB[2], paddingChartsB[0] ]);

			//set the x scale for the version a charts
			var xScaleChartA = d3.scale.linear()
				.range([ paddingChartsA[3], stop - paddingChartsA[1]]);

			//set the x scale for the version b charts
			var xScaleChartB = d3.scale.ordinal()
				.rangePoints([ start + paddingChartsB[3], width - paddingChartsB[1]]);

			//for calculating the range when unmerging
			var unmergeTop = (height - paddingChartsB[2]) / 2 - 10;
			var unmergeBottom = (height - paddingChartsB[2]) / 2 + 10;

			//set the y axis for the version a charts
			var yAxisChartA = d3.svg.axis()
				.scale(yScaleChartA)
				.outerTickSize(0)
				.innerTickSize(4)
				.tickPadding(2)
				.ticks(6)
				.orient("left");

			//set the y axis for the version b charts, variable 1
			var yAxisChartBvarCons = d3.svg.axis()
				.scale(yScaleChartBvarCons)
				.outerTickSize(0)
				.innerTickSize(4)
				.tickPadding(2)
				.ticks(6)
				.orient("left");

			//set the y axis for the version b charts, variable 2
			var yAxisChartBvar2 = d3.svg.axis()
				.scale(yScaleChartBvar2)
				.outerTickSize(0)
				.innerTickSize(4)
				.tickPadding(2)
				.ticks(6)
				.orient("right");

			//set the x axis for the version a charts
			var xAxisChartA = d3.svg.axis()
				.scale(xScaleChartA)
				.outerTickSize(0)
				.innerTickSize(4)
				.tickPadding(4)
				.ticks(6)
				.orient("bottom");

			//set the x axis for the version b charts
			var xAxisChartB = d3.svg.axis()
				.scale(xScaleChartB)
				.outerTickSize(0)
				.innerTickSize(4)
				.tickPadding(4)
				.tickPadding(2)
				.orient("bottom");

			var svg = d3.select(selector)
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			//first chart (version a)
			//creates the tittle of the chart
			var titleChartA = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 15)
				.attr("text-anchor", "middle")
				.attr("x", stop / 2)
				.attr("y", 26)
				.attr("fill", "darkslategray")
				.text(labelObject[constantVariable].titleChartA + " vs " +
					labelObject[variable2].titleChartA);

			//defines the domain of the y scale, chart version A
			yScaleChartA.domain([d3.min(data, function(d){
				return +d[constantVariable]
			}) - (d3.max(data, function(d){
				return +d[constantVariable]
			}) - d3.min(data, function(d){
				return +d[constantVariable]
			}))/10, d3.max(data, function(d){
				return +d[constantVariable]
			}) + (d3.max(data, function(d){
				return +d[constantVariable]
			}) - d3.min(data, function(d){
				return +d[constantVariable]
			}))/10]);

			//defines the domain of the x scale, chart version A
			xScaleChartA.domain([d3.min(data, function(d){
				return +d[variable2]
			}) - (d3.max(data, function(d){
				return +d[variable2]
			}) - d3.min(data, function(d){
				return +d[variable2]
			}))/10, d3.max(data, function(d){
				return +d[variable2]
			}) + (d3.max(data, function(d){
				return +d[variable2]
			}) - d3.min(data, function(d){
				return +d[variable2]
			}))/10]);

			//call x axis
			svg.append("g")
			.attr("class", "x axis chartA" + index)
			.attr("transform", "translate(0," + (height - paddingChartsA[2]) +")")
			.call(xAxisChartA);		

			//call y axis
			svg.append("g")
			.attr("class", "y axis chartA" + index)
			.attr("transform", "translate(" + (paddingChartsA[3]) + ",0)")
			.call(yAxisChartA);

			//append the gridlines
			d3.selectAll("g.x.chartA" + index + " .tick")
            .append("line")
				.classed("gridLine", true)
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", - (height - paddingChartsA[0] - paddingChartsA[2]));

            //append the gridlines
           	d3.selectAll("g.y.chartA" + index + " .tick")
            .append("line")
				.classed("gridLine", true)
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("y2", 0)
				.attr("x2", (stop - paddingChartsA[3] - paddingChartsA[1]));

			//calculate the r coefficient
			var arrayPearsons = [
				data.map(function(d){ return +d[constantVariable]}),
				data.map(function(d){ return +d[variable2]})
			];

			var rCoefficient = findCorrelation(arrayPearsons, 0, 1);

			//sets a special scale for the correlation line
			var correlationScale = d3.scale.linear()
				.range([ height  - paddingChartsA[2], paddingChartsA[0] ])
				.domain([1, -1]);

			//creates the line for the correlation
			var correlationLine = svg.append("line");

			correlationLine.attr("x1", paddingChartsA[3])
				.attr("x2", stop - paddingChartsA[1])
				.attr("y1", correlationScale(rCoefficient))
				.attr("y2", correlationScale(-rCoefficient))
				.attr("stroke-width", 4)
				.attr("opacity", 0)
				.attr("stroke", "black");

			//shows the value of r
			var correlationText = svg.append("text");

			correlationText.attr("x", stop - paddingChartsA[1])
				.attr("text-anchor", "end")
				.attr("y", height - paddingChartsA[2] - 6)
				.attr("font-family", "PT Sans")
				.attr("font-weight", 700)
				.attr("font-size", 16)
				.attr("fill-opacity", 0)
				.text("r = " + formatR(rCoefficient));

			//computes the line
			var lineChartA = d3.svg.line()
				.interpolate("cardinal")
				.x(function(d) {
					return xScaleChartA(d[variable2]);
				})
				.y(function(d) {
					return yScaleChartA(d[constantVariable]);
				});

			//creates the line
			var lineChartApath = svg.append("path")
				.datum(data);

			lineChartApath.attr("class", "line")
				.attr("d", lineChartA)
				.attr("fill", "none")
				.attr("stroke-width", 1)
				.attr("opacity", 0)
				.attr("stroke", "#444444");

			//transition the line
			lineChartApath.transition()
				.delay(1700)
				.duration(1000)
				.attr("opacity", 1);

			//creates the circles, chart version A
			var circlesChartA = svg.selectAll(".circ" + index)
				.data(data)
				.enter()
				.append("circle");

			//positioning the circles
			circlesChartA.attr("cx", function(d){
				return xScaleChartA(d[variable2])
			})
			.attr("cy", function(d){
				return yScaleChartA(d[constantVariable])
			})
			.attr("r", 0)
			.attr("stroke-width", 2)
			.attr("fill", colorScale(variable2))
			.attr("fill-opacity", 0.3)
			.attr("stroke", colorScale(variable2))
			.attr("class", "circles" + index);

			//transition the circles
			circlesChartA.transition()
				.delay(function(d, i){ return 500 + (i * 100)})
				.duration(800)
				.attr("r", 4);

			//text with the first year
			var textFirstYear = svg.append("text")
				.attr("x", function(){
						return xScaleChartA(data[0][variable2]) + 6
				})
				.attr("y", function(){
						return yScaleChartA(data[0][constantVariable]) + 6
				})
				.attr("font-size", 16)
				.attr("font-family", "PT Sans")
				.attr("fill", "darkslategray")
				.attr("font-weight", "bold")
				.attr("fill-opacity", 0)
				.text(data[0].year);

			//text with the last year
			var textLastYear = svg.append("text")
				.attr("x", function(){
						return xScaleChartA(data[11][variable2]) + 6
				})
				.attr("y", function(){
						return yScaleChartA(data[11][constantVariable]) + 6
				})
				.attr("font-size", 16)
				.attr("font-family", "PT Sans")
				.attr("fill", "darkslategray")
				.attr("font-weight", "bold")
				.attr("fill-opacity", 0)
				.text(data[11].year);

			textFirstYear.transition()
				.delay(1700)
				.duration(1000)
				.attr("fill-opacity", 0.3);

			textLastYear.transition()
				.delay(1700)
				.duration(1000)
				.attr("fill-opacity", 0.3);

			//creates the legend for the x axis
			var legendChartAxAxis = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 12)
				.attr("text-anchor", "end")
				.attr("x", (stop  - paddingChartsA[1]))
				.attr("y", height - 4)
				.attr("fill", "darkslategray")
				.text(labelObject[variable2].axisLine1 + " " + labelObject[variable2].axisLine2);

			//creates the legend for the y axis
			var legendChartAyAxis = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 12)
				.attr("text-anchor", "end")
				.attr("x", -paddingChartsA[0])
				.attr("y", 18)
				.attr("fill", "darkslategray")
				.text(labelObject[constantVariable].axisLine1 + 
					" " + labelObject[constantVariable].axisLine2)
				.attr("transform", "rotate(-90)");

			//lines for the tooltips
			var yline = svg.append("line")
				.attr("stroke", "darkgray")
				.attr("stroke-width", 2)
				.attr("stroke-dasharray", "2,2")
				.attr("pointer-events", "none");

			var xline = svg.append("line")
				.attr("stroke", "darkgray")
				.attr("stroke-width", 2)
				.attr("stroke-dasharray", "2,2")
				.attr("pointer-events", "none");

			//sets the tooltips
			circlesChartA.on("mousemove", function(d){

				d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);

				tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
					labelObject[constantVariable].tooltipChart + ": <strong>" +
					formatNumber(d[constantVariable]) + "</strong>" + 
					labelObject[constantVariable].tooltipChartUnit + "<br>" +
					labelObject[variable2].tooltipChart + ": <strong>" +
					formatNumber(d[variable2]) + "</strong> " + 
					labelObject[variable2].tooltipChartUnit)
					.style('top', d3.event.pageY - 12 + 'px')
					.style('left', d3.event.pageX + 25 + 'px')
					.style("opacity", 0.95);

					xline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", (height - paddingChartsA[2]))
						.attr("x2",  d3.select(this).attr("cx"))
						.attr("opacity", 1);

					yline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", d3.select(this).attr("cy"))
						.attr("x2", paddingChartsA[3])
						.attr("opacity", 1);

				}).on("mouseout", function(){
					d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);

					tooltip.style("opacity", 0);
					xline.attr("opacity", 0);
					yline.attr("opacity", 0);
			});

			//Second chart (version B)
			//creates the tittle of the chart
			var titleChartB = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 16)
				.attr("text-anchor", "middle")
				.attr("x", (start + width) / 2)
				.attr("y", 26)
				.attr("fill", "darkslategray")
				.text(labelObject[constantVariable].titleChartB + " and " +
					labelObject[variable2].titleChartB + ", per year");

			//defines the domain of the y scale, first variable, chart version B
			yScaleChartBvarCons.domain([d3.min(data, function(d){
				return +d[constantVariable]
			}) - (d3.max(data, function(d){
				return +d[constantVariable]
			}) - d3.min(data, function(d){
				return +d[constantVariable]
			}))/10, d3.max(data, function(d){
				return +d[constantVariable]
			}) + (d3.max(data, function(d){
				return +d[constantVariable]
			}) - d3.min(data, function(d){
				return +d[constantVariable]
			}))/10]);

			//defines the domain of the y scale, second variable, chart version B
			yScaleChartBvar2.domain([d3.min(data, function(d){
				return +d[variable2]
			}) - (d3.max(data, function(d){
				return +d[variable2]
			}) - d3.min(data, function(d){
				return +d[variable2]
			}))/8, d3.max(data, function(d){
				return +d[variable2]
			}) + (d3.max(data, function(d){
				return +d[variable2]
			}) - d3.min(data, function(d){
				return +d[variable2]
			}))/8]);

			//defines de domain of the x scale, chart version B
			xScaleChartB.domain(["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008",
				"2009", "2010", "2011", "2012", "2013", "2014"]);

			//call x axis
			svg.append("g")
			.attr("class", "x axis chartB" + index)
			.attr("transform", "translate(0," + (height - paddingChartsB[2]) +")")
			.call(xAxisChartB);		

			//call y axis for first variable
			svg.append("g")
			.attr("class", "y axis chartBcons" + index)
			.attr("transform", "translate(" + (start + paddingChartsB[3]) + ",0)")
			.call(yAxisChartBvarCons);

			//call y axis for second variable
			svg.append("g")
			.attr("class", "y axis chartBvar2" + index)
			.attr("transform", "translate(" + (width - (paddingChartsB[1])) + ",0)")
			.call(yAxisChartBvar2);

			//removes the first ans last tick
			d3.selectAll(".tick")
				.filter(function(d){
					return d == "2001" || d == "2014"
				})
				.remove();

            //append the gridlines
			d3.selectAll("g.y.chartBcons" + index + " .tick")
			.append("line")
				.classed("gridLine", true)
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("y2", 0)
				.attr("x2", (width - start - paddingChartsB[3] - paddingChartsB[1]));

			//set color of second y axis
			d3.selectAll(".chartBvar2" + index).selectAll("path, line").style("stroke",
				colorScale(variable2)).style("stroke-width", 1.5).attr("opacity", 0.8);

			//set color of first y axis
			d3.selectAll(".chartBcons" + index).selectAll("path").attr("opacity", 0.4);

			//computes the line for the constant variable
			var lineChartBConVar = d3.svg.line()
				.interpolate("monotone")
				.x(function(d) {
					return xScaleChartB(d.year);
				})
				.y(function(d) {
					return yScaleChartBvarCons(d[constantVariable]);
				});

			//creates the line for the constant variable
			var lineBConVar = svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", lineChartBConVar)
				.attr("fill", "none")
				.attr("stroke-width", 1)
				.attr("opacity", 0)
				.attr("stroke", "#444444");

			//computes the line for the variable 2
			var lineChartBVar2 = d3.svg.line()
				.interpolate("monotone")
				.x(function(d) {
					return xScaleChartB(d.year);
				})
				.y(function(d) {
					return yScaleChartBvar2(d[variable2]);
				});

			//creates the line for the variable 2
			var lineBVar2 = svg.append("path")
				.datum(data)
				.attr("class", "line")
				.attr("d", lineChartBVar2)
				.attr("fill", "none")
				.attr("stroke-width", 1)
				.attr("opacity", 0)
				.attr("stroke", "#444444");

			//creates the circles for the constant variable
			var circlesChartBConVar = svg.selectAll(".circB" + index)
				.data(data)
				.enter()
				.append("circle");

			//positioning the constant variable
			circlesChartBConVar.attr("cy", function(d){
				return yScaleChartBvarCons(d[constantVariable])
			})
			.attr("cx", function(d){
				return xScaleChartB(d.year)
			})
			.attr("r", 0)
			.attr("stroke-width", 2)
			.attr("fill", "#333")
			.attr("fill-opacity", 0.3)
			.attr("stroke", "#333")
			.attr("class", "circlesConst" + index);

			//creates the circles for the second variable, chart version B
			var circlesChartBvar2 = svg.selectAll(".circB" + index)
				.data(data)
				.enter()
				.append("circle");

			//positioning the circles for the second variable, chart version B
			circlesChartBvar2.attr("cy", function(d){
				return yScaleChartBvar2(d[variable2])
			})
			.attr("cx", function(d){
				return xScaleChartB(d.year)
			})
			.attr("r", 0)
			.attr("stroke-width", 2)
			.attr("fill", colorScale(variable2))
			.attr("fill-opacity", 0.3)
			.attr("stroke", colorScale(variable2))
			.attr("class", "circlesVar2" + index);

			//transition the circles
			circlesChartBConVar.transition()
				.delay(function(d, i){ return 500 + (i * 100)})
				.duration(800)
				.attr("r", 4);

			//transition the circles
			circlesChartBvar2.transition()
				.delay(function(d, i){ return 500 + (i * 100)})
				.duration(800)
				.attr("r", 4);

			//transition the line
			lineBConVar.transition()
				.delay(1700)
				.duration(1000)
				.attr("opacity", 1);

			//transition the line
			lineBVar2.transition()
				.delay(1700)
				.duration(1000)
				.attr("opacity", 1);

			//creates the legend for the x axis
			var legendChartBxAxis = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 12)
				.attr("text-anchor", "middle")
				.attr("x", (width + start)/2)
				.attr("y", height - 4)
				.attr("fill", "darkslategray")
				.text("Year");

			//creates the legend for the y axis, constant variable
			var legendChartByAxisConVar = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 12)
				.attr("text-anchor", "end")
				.attr("x", -paddingChartsB[0])
				.attr("y", width - start - paddingChartsB[1] - paddingChartsB[3] - 30)
				.attr("fill", "darkslategray")
				.text(labelObject[constantVariable].axisLine1 + 
					" " + labelObject[constantVariable].axisLine2)
				.attr("transform", "rotate(-90)");

			//creates the legend for the y axis, second variable
			var legendChartByAxisVar2 = svg.append("text")
				.attr("font-family", "PT Sans")
				.attr("font-size", 12)
				.attr("text-anchor", "end")
				.attr("x", -paddingChartsB[0])
				.attr("y", width - 4)
				.attr("fill", "darkslategray")
				.text(labelObject[variable2].axisLine1 + 
					" " + labelObject[variable2].axisLine2)
				.attr("transform", "rotate(-90)");

			//sets the tooltips
			circlesChartBConVar.on("mousemove", function(d){
				d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);
				tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
					labelObject[constantVariable].tooltipChart + ": <strong>" +
					formatNumber(d[constantVariable]) + "</strong>" + 
					labelObject[constantVariable].tooltipChartUnit)
					.style('top', d3.event.pageY - 12 + 'px')
					.style('left', d3.event.pageX + 25 + 'px')
					.style("opacity", 0.95);

					xline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", (height - paddingChartsB[2]))
						.attr("x2",  d3.select(this).attr("cx"))
						.attr("opacity", 1);

					yline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", d3.select(this).attr("cy"))
						.attr("x2", start + paddingChartsB[3])
						.attr("opacity", 1);

				}).on("mouseout", function(){
					d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);
					tooltip.style("opacity", 0);
					xline.attr("opacity", 0);
					yline.attr("opacity", 0);
			});

			//sets the tooltips
			circlesChartBvar2.on("mousemove", function(d){
				d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);
				tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
					labelObject[variable2].tooltipChart + ": <strong>" +
					formatNumber(d[variable2]) + "</strong>" + 
					labelObject[variable2].tooltipChartUnit)
					.style('top', d3.event.pageY + 12 + 'px')
					.style('left', d3.event.pageX + 14 + 'px')
					.style("opacity", 0.95);

					xline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", (height - paddingChartsB[2]))
						.attr("x2",  d3.select(this).attr("cx"))
						.attr("opacity", 1);

					yline.attr("x1", d3.select(this).attr("cx"))
						.attr("y1", d3.select(this).attr("cy"))
						.attr("y2", d3.select(this).attr("cy"))
						.attr("x2", (width - paddingChartsB[1]))
						.attr("opacity", 1);

				}).on("mouseout", function(){
					d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);
					tooltip.style("opacity", 0);
					xline.attr("opacity", 0);
					yline.attr("opacity", 0);
			});

			//redraws each chart after click
			d3.selectAll(".chart" + index + "button").on("click", function(){

				var thisClicked = this.value;

				redraw(thisClicked);

			});

			//merge the version B charts
			d3.selectAll(".merge" + index + "button").on("click", function(){

				if (this.value == "merge"){
					merge();
				} else if (this.value == "unmerge"){
					unmerge();
				}

			});

			//shows the r coefficient
			d3.selectAll(".checkbox" + index).selectAll("input").on("change", function(){
				var checkboxState = this.checked;
				if (checkboxState === false){
					correlationLine.attr("opacity", 0);
					correlationText.attr("fill-opacity", 0);
				} else if (checkboxState === true){
					correlationLine.attr("opacity", 0.25);
					correlationText.attr("fill-opacity", 0.5);
				}
			});

			function redraw(newVariable){

				variable2 = newVariable;

				//recalculates r coefficient
				arrayPearsons = [
					data.map(function(d){ return +d[constantVariable]}),
					data.map(function(d){ return +d[newVariable]})
				];

				rCoefficient = findCorrelation(arrayPearsons, 0, 1);

				//redraw the correlation line
				correlationLine.transition().duration(1000).attr("y1", correlationScale(rCoefficient))
					.attr("y2", correlationScale(-rCoefficient));

				//rewrite the r value
				correlationText.text("r = " + formatR(rCoefficient));

				//changes the titles
				titleChartA.text(labelObject[constantVariable].titleChartA + " vs " +
					labelObject[newVariable].titleChartA);

				//defines the domain of the x scale, chart version A
				xScaleChartA.domain([d3.min(data, function(d){
					return +d[newVariable]
				}) - (d3.max(data, function(d){
					return +d[newVariable]
				}) - d3.min(data, function(d){
					return +d[newVariable]
				}))/10, d3.max(data, function(d){
					return +d[newVariable]
				}) + (d3.max(data, function(d){
					return +d[newVariable]
				}) - d3.min(data, function(d){
					return +d[newVariable]
				}))/10]);

				//calling the x axis again
				d3.transition(svg).select(".x.axis.chartA" + index)
					.transition()
					.duration(1000)
					.call(xAxisChartA);

				//removing the old gridlines
				d3.selectAll("g.x.chartA" + index + " .tick").select("line.gridLine")
					.remove();

				//append the gridlines
				d3.selectAll("g.x.chartA" + index + " .tick")
	            .append("line")
					.classed("gridLine", true)
					.attr("x1", 0)
					.attr("y1", 0)
					.attr("x2", 0)
					.attr("y2", - (height - paddingChartsA[0] - paddingChartsA[2]));

				//compute the new line
				lineChartA.x(function(d) {
					return xScaleChartA(d[newVariable]);
				});

				//updating the line
				lineChartApath.transition()
					.duration(1000)
					.attr("d", lineChartA);

				//updating the circles
				circlesChartA.transition()
					.duration(1000)
					.attr("cx", function(d){
						return xScaleChartA(d[newVariable])
					})
					.attr("fill", colorScale(newVariable))
					.attr("stroke", colorScale(newVariable));

				//reposition the text
				textFirstYear.transition()
					.duration(1000)
					.attr("x", function(){
						return xScaleChartA(data[0][newVariable]) + 6
				});

				//reposition the text
				textLastYear.transition()
					.duration(1000)
					.attr("x", function(){
							return xScaleChartA(data[11][newVariable]) + 6
					});

				//update the x axis
				legendChartAxAxis.text(labelObject[newVariable].axisLine1 +
				 " " + labelObject[newVariable].axisLine2);

				//update the tooltips
				circlesChartA.on("mousemove", function(d){

					d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);

					tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
						labelObject[constantVariable].tooltipChart + ": <strong>" +
						formatNumber(d[constantVariable]) + "</strong>" + 
						labelObject[constantVariable].tooltipChartUnit + "<br>" +
						labelObject[newVariable].tooltipChart + ": <strong>" +
						formatNumber(d[newVariable]) + "</strong> " + 
						labelObject[newVariable].tooltipChartUnit)
						.style('top', d3.event.pageY - 12 + 'px')
						.style('left', d3.event.pageX + 25 + 'px')
						.style("opacity", 0.95);

						xline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", (height - paddingChartsA[2]))
							.attr("x2",  d3.select(this).attr("cx"))
							.attr("opacity", 1);

						yline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", d3.select(this).attr("cy"))
							.attr("x2", paddingChartsA[3])
							.attr("opacity", 1);

					}).on("mouseout", function(){
						d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);

						tooltip.style("opacity", 0);
						xline.attr("opacity", 0);
						yline.attr("opacity", 0);
				});

				//update the chart, version B
				titleChartB.text(labelObject[constantVariable].titleChartB + " and " +
					labelObject[newVariable].titleChartB + ", per year");

				//defines the domain of the y scale, second variable, chart version B
				yScaleChartBvar2.domain([d3.min(data, function(d){
					return +d[newVariable]
				}) - (d3.max(data, function(d){
					return +d[newVariable]
				}) - d3.min(data, function(d){
					return +d[newVariable]
				}))/8, d3.max(data, function(d){
					return +d[newVariable]
				}) + (d3.max(data, function(d){
					return +d[newVariable]
				}) - d3.min(data, function(d){
					return +d[newVariable]
				}))/8]);

				//calling the y for the second variable axis again
				d3.transition(svg).select(".y.axis.chartBvar2" + index)
					.transition()
					.duration(1000)
					.call(yAxisChartBvar2);

				//set color of second y axis again
				if (merged === true){
					d3.selectAll(".chartBvar2" + index).selectAll("path, line").transition()
					.duration(1000).style("stroke", colorScale(newVariable)).attr("opacity", 0.8);
				};

				if (merged === false){

					//removing the old gridlines
					d3.selectAll("g.y.chartBvar2" + index + " .tick").select("line.gridLine")
						.remove();

					d3.selectAll("g.y.chartBvar2" + index + " .tick")
						.append("line")
						.classed("gridLine", true)
						.attr("x1", 0)
						.attr("y1", 0)
						.attr("y2", 0)
						.attr("x2", (width - start - paddingChartsB[3] - paddingChartsB[1]));

				}

				//computing the line
				lineChartBVar2.y(function(d) {
						return yScaleChartBvar2(d[newVariable]);
					});

				//transition the line
				lineBVar2.transition()
					.duration(1000)
					.attr("d", lineChartBVar2);

				//update the circles
				circlesChartBvar2.transition()
				.duration(1000)
				.attr("cy", function(d){
					return yScaleChartBvar2(d[newVariable])
				})
				.attr("fill", colorScale(newVariable))
				.attr("stroke", colorScale(newVariable));

				//update the legend of the variable 2
				legendChartByAxisVar2.text(function(){
					if (merged === true){
						return (labelObject[newVariable].axisLine1 + 
					" " + labelObject[newVariable].axisLine2)
					} else {
						return (labelObject[newVariable].axisLine1)
					}
				});

				//set the tooltips again
				circlesChartBvar2.on("mousemove", function(d){
					d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);
					tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
						labelObject[newVariable].tooltipChart + ": <strong>" +
						formatNumber(d[newVariable]) + "</strong>" + 
						labelObject[newVariable].tooltipChartUnit)
						.style('top', d3.event.pageY + 12 + 'px')
						.style('left', d3.event.pageX + 14 + 'px')
						.style("opacity", 0.95);

						xline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", (height - paddingChartsB[2]))
							.attr("x2",  d3.select(this).attr("cx"))
							.attr("opacity", 1);

						yline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", d3.select(this).attr("cy"))
							.attr("x2", function(d){
								if(merged === true){
									return	(width - paddingChartsB[1]);
								} else {
									return (start + paddingChartsB[3])
								}
							})
							.attr("opacity", 1);

					}).on("mouseout", function(){
						d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);
						tooltip.style("opacity", 0);
						xline.attr("opacity", 0);
						yline.attr("opacity", 0);
				});

				//calculate the r coefficient
				arrayPearsons = [
					data.map(function(d){ return +d[constantVariable]}),
					data.map(function(d){ return +d[variable2]})
				];

				rCoefficient = findCorrelation(arrayPearsons, 0, 1);

				console.log(rCoefficient);

			//end of redraw	
			};

			function merge(){

				//the lines are merged
				merged = true;

				//set the new ranges
				yScaleChartBvarCons.range([ height  - paddingChartsB[2], paddingChartsB[0] ]);

				yScaleChartBvar2.range([ height  - paddingChartsB[2], paddingChartsB[0] ]);

				//transition the circles
				circlesChartBConVar.transition()
					.duration(1000)
					.attr("cy", function(d){
						return yScaleChartBvarCons(d[constantVariable])
					});

				circlesChartBvar2.transition()
					.duration(1000)
					.attr("cy", function(d){
						return yScaleChartBvar2(d[variable2])
					});

				//transition the lines
				lineChartBConVar.y(function(d) {
					return yScaleChartBvarCons(d[constantVariable]);
				});

				lineChartBVar2.y(function(d) {
					return yScaleChartBvar2(d[variable2]);
				});

				lineBConVar.transition()
					.duration(1000)
					.attr("d", lineChartBConVar);

				lineBVar2.transition()
					.duration(1000)
					.attr("d", lineChartBVar2);

				//sets the tooltips
				circlesChartBvar2.on("mousemove", function(d){
					d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);
					tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
						labelObject[variable2].tooltipChart + ": <strong>" +
						formatNumber(d[variable2]) + "</strong>" + 
						labelObject[variable2].tooltipChartUnit)
						.style('top', d3.event.pageY + 12 + 'px')
						.style('left', d3.event.pageX + 14 + 'px')
						.style("opacity", 0.95);

						xline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", (height - paddingChartsB[2]))
							.attr("x2",  d3.select(this).attr("cx"))
							.attr("opacity", 1);

						yline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", d3.select(this).attr("cy"))
							.attr("x2", (width - paddingChartsB[1]))
							.attr("opacity", 1);

					}).on("mouseout", function(){
						d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);
						tooltip.style("opacity", 0);
						xline.attr("opacity", 0);
						yline.attr("opacity", 0);
				});

				//transition the axes
				yAxisChartBvar2.orient("right");

				d3.selectAll(".y.axis.chartBvar2" + index)
					.transition()
					.duration(1000)
					.attr("transform", "translate(" + (width - (paddingChartsB[1])) + ",0)")
					.call(yAxisChartBvar2);

				//set color of second y axis
				d3.selectAll(".chartBvar2" + index).selectAll("path, line").style("stroke",
					colorScale(variable2)).style("stroke-width", 1.5).attr("opacity", 0.8);

				d3.selectAll("g.y.chartBvar2" + index + " .tick").select("line.gridLine")
					.remove();

				d3.selectAll(".y.axis.chartBcons" + index)
					.transition()
					.duration(1000)
					.call(yAxisChartBvarCons);

				//transition the legends
				legendChartByAxisConVar.transition().delay(500).text(labelObject[constantVariable].axisLine1
					+ " " + labelObject[constantVariable].axisLine2);

				legendChartByAxisVar2.transition().duration(1000).attr("y", width - 4)
					.attr("x", -paddingChartsB[0])
					.each("end", function(){
						return legendChartByAxisVar2.text(labelObject[variable2].axisLine1
						 + " " + labelObject[variable2].axisLine2);
					});

			//end of merge
			};

			function unmerge(){

				//the lines are not merged
				merged = false;

				//set the new ranges
				yScaleChartBvarCons.range([ unmergeTop, paddingChartsB[0] ]);

				yScaleChartBvar2.range([ height - paddingChartsB[2], unmergeBottom]);

				//transition the circles
				circlesChartBConVar.transition()
					.duration(1000)
					.attr("cy", function(d){
						return yScaleChartBvarCons(d[constantVariable])
					});

				circlesChartBvar2.transition()
					.duration(1000)
					.attr("cy", function(d){
						return yScaleChartBvar2(d[variable2])
					});

				//transition the lines
				lineChartBConVar.y(function(d) {
					return yScaleChartBvarCons(d[constantVariable]);
				});

				lineChartBVar2.y(function(d) {
					return yScaleChartBvar2(d[variable2]);
				});

				lineBConVar.transition()
					.duration(1000)
					.attr("d", lineChartBConVar);

				lineBVar2.transition()
					.duration(1000)
					.attr("d", lineChartBVar2);

				//set the tooltips again
				circlesChartBvar2.on("mousemove", function(d){
					d3.select(this).attr("r", 5).attr("fill-opacity", 0.8);
					tooltip.html("Year: <strong>" + d.year + "</strong><br>" + 
						labelObject[variable2].tooltipChart + ": <strong>" +
						formatNumber(d[variable2]) + "</strong>" + 
						labelObject[variable2].tooltipChartUnit)
						.style('top', d3.event.pageY + 12 + 'px')
						.style('left', d3.event.pageX + 14 + 'px')
						.style("opacity", 0.95);

						xline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", (height - paddingChartsB[2]))
							.attr("x2",  d3.select(this).attr("cx"))
							.attr("opacity", 1);

						yline.attr("x1", d3.select(this).attr("cx"))
							.attr("y1", d3.select(this).attr("cy"))
							.attr("y2", d3.select(this).attr("cy"))
							.attr("x2", start + paddingChartsB[3])
							.attr("opacity", 1);

					}).on("mouseout", function(){
						d3.select(this).attr("r", 4).attr("fill-opacity", 0.3);
						tooltip.style("opacity", 0);
						xline.attr("opacity", 0);
						yline.attr("opacity", 0);
				});

				//transition the axes
				yAxisChartBvar2.orient("left");

				d3.selectAll(".y.axis.chartBvar2" + index)
					.transition()
					.duration(1000)
					.attr("transform", "translate(" + (start + paddingChartsB[3]) + ",0)")
					.call(yAxisChartBvar2);

				d3.selectAll(".chartBvar2" + index).selectAll("path, line").style("stroke", 
					"lightslategray").style("stroke-width", 1).attr("opacity", 1);

				d3.selectAll("g.y.chartBvar2" + index + " .tick")
				.append("line")
					.classed("gridLine", true)
					.attr("x1", 0)
					.attr("y1", 0)
					.attr("y2", 0)
					.attr("x2", (width - start - paddingChartsB[3] - paddingChartsB[1]));

				d3.selectAll(".y.axis.chartBcons" + index)
					.transition()
					.duration(1000)
					.call(yAxisChartBvarCons);

				//transition the legends
				legendChartByAxisConVar.text(labelObject[constantVariable].axisLine1);

				legendChartByAxisVar2.transition().duration(1000)
					.attr("y", width - start - paddingChartsB[1]
				 		- paddingChartsB[3] - 30)
					.attr("x", -unmergeBottom)
					.text(labelObject[variable2].axisLine1);

			//end of unmerge
			};

			function findCorrelation(prefs, p1, p2) {
				var si = [];
				for (var key in prefs[p1]) {
					if (prefs[p2][key]) si.push(key);
				}
				var n = si.length;
				if (n == 0) return 0;
				var sum1 = 0;
				for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];
				var sum2 = 0;
				for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];
				var sum1Sq = 0;
				for (var i = 0; i < si.length; i++) {
					sum1Sq += Math.pow(prefs[p1][si[i]], 2);
				}
				var sum2Sq = 0;
				for (var i = 0; i < si.length; i++) {
					sum2Sq += Math.pow(prefs[p2][si[i]], 2);
				}
				var pSum = 0;
				for (var i = 0; i < si.length; i++) {
					pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
				}
				var num = pSum - (sum1 * sum2 / n);
				var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
			      (sum2Sq - Math.pow(sum2, 2) / n));
				if (den == 0) return 0;
				return num / den;
			
			//end of findCorrelation
			};

		//end of drawChart
		};
	
	//end of d3.csv	
	});

//end of the self-invoked function
}());