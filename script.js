let births = []

fetch('/Datasets/births.json')
.then(response => {
   return response.json();
})
.then(data => births = data);

let deaths = []
fetch('/Datasets/deaths.json')
.then(response => {
   return response.json();
})
.then(data => deaths = data);

let population = []
fetch('/Datasets/population.json')
.then(response => {
   return response.json();
})
.then(data => population = data);

// let pop_0_14 = []
// fetch('/Datasets/pop_0_14.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_0_14 = data);

// let pop_15_24 = []
// fetch('/Datasets/pop_15_24.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_15_24 = data);

// let pop_25_49 = []
// fetch('/Datasets/pop_25_49.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_25_49 = data);

// let pop_50_64 = []
// fetch('/Datasets/pop_50_64.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_50_64 = data);

// let pop_65_79 = []
// fetch('/Datasets/pop_65_79.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_65_79 = data);

// let pop_80 = []
// fetch('/Datasets/pop_80.json')
// .then(response => {
//    return response.json();
// })
// .then(data => pop_80 = data);


setTimeout(() => {
  // document.getElementById("year").innerHTML = '2009';
  // year2009 = population[0].year2009;
  // var bins = histogram(year2009);
  // console.log(year2009);
  console.log(births)
  console.log(deaths);
  console.log(population);
  // console.log(pop_0_14);
  // console.log(pop_15_24);
  // console.log(pop_25_49);
  // console.log(pop_50_64);
  // console.log(pop_65_79);
  // console.log(pop_80);
// }, 500);



function create_svg(classname) {
  width = 900;
  height = 550;

  margin = {
    top: 50,
    left: 90,
    right: 10,
    bottom: 30
  }
  // create the element where our visualisation will go
  svg = d3.select("#dashboard")
    .append('svg')
    .attr('class', classname)
    .attr('width', width)
    .attr('height', height);

  // x-axis group
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height-margin.top})`);

  // y-axis group
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left},0)`);

  // xscale - bands for bars, with spacing
  xScale = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .paddingInner(0.4)
    .paddingOuter(0.5);

  // yscale - linear
  yScale = d3.scaleLinear()
    .range([height-margin.top, margin.bottom]);

  xaxis = d3.axisBottom(xScale);
  yaxis = d3.axisLeft(yScale);

  // how many data items have we added? Also how many times update() has run
  count = 1;
}

function update() {

  // get the data for this iteration (data[0:count])
  iter_data = data.slice(0, count);
  
  // increase the size of the graphic (optional)
  // width = width + 15;


  // console.log(iter_data);
  
  // increase iteration count
  count++;
  // if we've got to the end of the data, stop running
  if(count > data.length) {
      console.log('stopping');
      t.stop();
  }

  // update the width (if necessary)
  svg.transition()
      .duration(500)
      .attr('width', width);

  // update the domains for the scales
  yScale.domain([0, d3.max(iter_data, (d) => d.value)]);
  xScale.domain(iter_data.map((d) => d.country))
      .range([margin.left, width - margin.right]);
  
  // add bars to the visualisation for each data element
  svg.selectAll('rect')
      .data(iter_data)
      .join((enter) => {
          enter.append('rect')
              .attr('fill', 'grey')
              .attr('rx', '10')
              .attr('ry', '10')
              
              // .attr('fill', 'url("/flags/Greece.jpg")')
              // .attr('background-image', 'url("/flags/Greece.jpg")' )
              // .attr('background-color', '#cccccc' )
              // .attr('border-radius', '5px')
              .attr('width', xScale.bandwidth)
              .attr('y', height - margin.top)
              .attr('height', 0)
              .attr('x', (d) => xScale(d.country) )
              .transition()
              .duration(500)
              .attr('y', (d) => yScale(d.value))
              .attr('height', (d) => height - margin.top - yScale(d.value));
      },
      (update) => {
          update
              .transition()
              .duration(500)
              .attr('y', (d) => yScale(d.value))
              .attr('width', xScale.bandwidth)
              .attr('height', (d) => height - margin.top - yScale(d.value))
              .attr('x', (d) => xScale(d.country) );
      },
      (exit) => {
          exit
              .transition()
              .duration(500)
              .attr('y', height-margin.top)
              .attr('height', 0)
              .remove();
      });

      svg.selectAll('.label')
      .data(iter_data)
      .join(
          (enter) => {
              enter.append('text')
                  .attr('class', 'label')
                  .attr('fill', 'black')
                  .attr('text-anchor', 'middle')
                  .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                  .attr('y', height - margin.top)
                  .transition()
                  .duration(500)
                  .attr('y', (d) => yScale(d.value) - 5)
                  .text((d) => {
                    if (d.value > 99999999) {
                      return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                  }
                  else if (d.value > 9999999) {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                  } else {
                    return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                  }
                })
          },
          (update) => {
              update
                  .transition()
                  .duration(500)
                  .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                  .attr('y', (d) => yScale(d.value) - 5)
                  .text((d) => {
                    if (d.value > 99999999) {
                      return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                  }
                  else if (d.value > 9999999) {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                  } else {
                    return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                  }
                })
          },
          (exit) => {
              exit.transition()
                  .duration(500)
                  .attr('y', height - margin.top)
                  .remove();
          }
      );

      svg.selectAll('.image')
          .data(iter_data)
          .join(
              (enter) => {
                  enter.append('svg:image')
                      .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                      .attr('class', 'image')
                      .attr('width', '40')
                      .attr('height', '40')
                      .attr('z-index','500')
                      .attr('visibility','visible')
                      .attr('x', (d) => (xScale(d.country) + xScale.bandwidth()/2) - 20)
                      .attr('y', height - margin.top - 30)
                      .transition()
                      .duration(500)
                      .attr('y', (d) => yScale(d.value))
              },
              (update) => {
                  update
                      .transition()
                      .duration(500)
                      .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                      .attr('x', (d) => (xScale(d.country) + xScale.bandwidth()/2) - 20)
                      .attr('y', (d) => yScale(d.value))
              },
              (exit) => {
                  exit.transition()
                      .duration(500)
                      .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                      .attr('y', height - margin.top - 30)
                      .remove();
              }
          );

  svg.select('.x.axis')
      .transition()
      .duration(500)
      .call(xaxis);

  svg.select('.y.axis')
      .transition()
      .duration(500)
      .call(yaxis);
}

const play = async function(classname, start, number, mydata) {
  document.getElementById("myBtn").disabled = true; 
  document.getElementById("births").disabled = true; 
  document.getElementById("deaths").disabled = true; 
  document.getElementById("population").disabled = true; 

  create_svg(classname);
  year = 2009;

  document.getElementById("year").innerHTML = year;
  year++;
  data = mydata[0].slice(start,number);

  update();
  t = d3.interval(update, 600)
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[1].slice(start,number);
       
      update();  
    }
  }, 5000);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[2].slice(start,number);
      update();  
    }
    else {
      return;
    }
  }, 6500);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[3].slice(start,number);  
      update();  
    }
    else {
      return;
    }
  }, 8000);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[4].slice(start,number);  
      update();  
    }
    else {
      return;
    }
  }, 9500);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[5].slice(start,number);
      update();  
    }
    else {
      return;
    }
  }, 11000);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[6].slice(start,number);  
      update();  
    }
    else {
      return;
    }
  }, 12500);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[7].slice(start,number);    
      update();  
    }
    else {
      return;
    }
  }, 14000);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[8].slice(start,number); 
      update();  
    }
    else {
      return;
    }
  }, 15500);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[9].slice(start,number);  
      update();  
    }
    else {
      return;
    }
  }, 17000);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      data = mydata[10].slice(start,number);  
      update();  
    }
    else {
      return;
    }
    document.getElementById("myBtn").disabled = false; 
    document.getElementById("births").disabled = false; 
    document.getElementById("deaths").disabled = false; 
    document.getElementById("population").disabled = false; 
  }, 18500);
}


function changecolour(name){
  names = ['births','deaths','population']
  document.getElementById(name).className = "btn btn-success";
  for (let index = 0; index < names.length; index++) {
    if (names[index] != name) {
      document.getElementById(names[index]).className = "btn btn-outline-success";   
    } 
  }
}

function buttonClicked(classname, button, mylist){
  var list = document.getElementById("dashboard");
  list.removeChild(list.childNodes[3]);
  if (year < 2019) {
    console.log(year);
    year = 0;
  }
  year = 2009;
  console.log(mylist);
  mydata = mylist;
  changecolour(button);
  playgraph(classname, 1, number + 1, mydata);

}

const playgraph = async function(classname, start, number, mydata){
  const result = await play(classname, start, number, mydata);
}

population = [population[0].year2009,population[1].year2010,population[2].year2011,population[3].year2012,population[4].year2013,population[5].year2014,population[6].year2015,population[7].year2016,population[8].year2017,population[9].year2018,population[10].year2019]

births = [births[0].year2009,births[1].year2010,births[2].year2011,births[3].year2012,births[4].year2013,births[5].year2014,births[6].year2015,births[7].year2016,births[8].year2017,births[9].year2018,births[10].year2019]

deaths = [deaths[0].year2009,deaths[1].year2010,deaths[2].year2011,deaths[3].year2012,deaths[4].year2013,deaths[5].year2014,deaths[6].year2015,deaths[7].year2016,deaths[8].year2017,deaths[9].year2018,deaths[10].year2019]

mydata = population

number = 8

changecolour('population');

playgraph('histogram', 1, number + 1, mydata);

document.getElementById("myBtn").onclick = function() {
  var list = document.getElementById("dashboard");
  list.removeChild(list.childNodes[3]);
  if (year < 2019) {
    console.log(year);
    year = 0;
  }
  year = 2009;
  playgraph('histogram', 1, number + 1, mydata);  
};

document.getElementById("births").onclick = function() {
  buttonClicked('histogram', "births", births);
};

document.getElementById("deaths").onclick = function() {
  buttonClicked('histogram', "deaths", deaths);
};

document.getElementById("population").onclick = function() {
  buttonClicked('histogram', "population", population);
};

// t = d3.interval(update, 1000);
}, 2000);