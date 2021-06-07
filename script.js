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


setTimeout(() => {

function create_svg(classname, _width, _height) {
  width = _width;
  height = _height;

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
    .range([margin.left - 90, width - margin.right])
    .paddingInner(0.1)
    .paddingOuter(0.15);

  // yscale - linear
  yScale = d3.scaleLinear()
    .range([height-margin.top, margin.bottom]);

  xaxis = d3.axisBottom(xScale);
  yaxis = d3.axisLeft(yScale);

  // how many data items have we added? Also how many times update() has run
  count = 1;
}

function bar_color(type){
  if (type == 'deaths') {
    return 'rgba(120,5,5,0.5)'
  }
  else{
    return 'rgba(15, 65, 250, 0.95)'
  }
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
      // console.log('stopping');
      t.stop();
  }

  // update the width (if necessary)
  svg.transition()
      .duration(280)
      .attr('width', width);

  // update the domains for the scales
  yScale.domain([0, d3.max(iter_data, (d) => d.value)]);
  // xScale.domain(iter_data.map((d) => d.country + ' ' + d.type))
  //     .range([margin.left, width - margin.right]);

  if (_button != '') {
    xScale.domain(iter_data.map((d) => d.country + ' ' + d.type))
        .range([margin.left, width - margin.right]);
  
        // add bars to the visualisation for each data element
        svg.selectAll('rect')
            .data(iter_data)
            .join((enter) => {
                enter.append('rect')
                    .attr('fill', (d) => bar_color(d.type))
                    .attr('rx', '10')
                    .attr('ry', '10')
                    .attr('width', xScale.bandwidth)
                    .attr('y', height - margin.top)
                    .attr('height', 0)
                    .attr('x', (d) => xScale(d.country + ' ' + d.type) )
                    .transition()
                    .duration(280)
                    .attr('y', (d) => yScale(d.value))
                    .attr('height', (d) => height - margin.top - yScale(d.value));
            },
            (update) => {
                update
                    .transition()
                    .duration(280)
                    .attr('y', (d) => yScale(d.value))
                    .attr('width', xScale.bandwidth)
                    .attr('height', (d) => height - margin.top - yScale(d.value))
                    .attr('x', (d) => xScale(d.country + ' ' + d.type) );
            },
            (exit) => {
                exit
                    .transition()
                    .duration(280)
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
                        .attr('x', (d) => xScale(d.country + ' ' + d.type) + xScale.bandwidth()/2)
                        .attr('y', height - margin.top)
                        .transition()
                        .duration(280)
                        .attr('y', (d) => yScale(d.value) - 5)
                        .text((d) => {
                          if (d.value > 99999999) {
                            return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                        }
                        else if (d.value > 9999999) {
                          return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                        }
                        else if (d.value > 999999) {
                          return ''+d.value.toString().substring(0,1)+','+d.value.toString().substring(1,4)+','+d.value.toString().substring(4,7)
                        }
                        else if (d.value > 99999) {
                          return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                        } else {
                          return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)
                        }
                      })
                },
                (update) => {
                    update
                        .transition()
                        .duration(280)
                        .attr('x', (d) => xScale(d.country + ' ' + d.type) + xScale.bandwidth()/2)
                        .attr('y', (d) => yScale(d.value) - 5)
                        .text((d) => {
                          if (d.value > 99999999) {
                            return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                        }
                        else if (d.value > 9999999) {
                          return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                        }
                        else if (d.value > 999999) {
                          return ''+d.value.toString().substring(0,1)+','+d.value.toString().substring(1,4)+','+d.value.toString().substring(4,7)
                        }
                        else if (d.value > 99999) {
                          return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                        } else {
                          return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)
                        }
                      })
                },
                (exit) => {
                    exit.transition()
                        .duration(280)
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
                            .attr('width', '30px')
                            .attr('height', '30px')
                            .attr('z-index','500')
                            .attr('visibility','visible')
                            .attr('x', (d) => (xScale(d.country + ' ' + d.type) + xScale.bandwidth()/2) - 15)
                            .attr('y', height - 27)
                            .transition()
                            .duration(280)
                            .attr('y', height - 27)
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(280)
                            .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                            .attr('x', (d) => (xScale(d.country + ' ' + d.type) + xScale.bandwidth()/2) - 15)
                            .attr('y', height - 27)
                    },
                    (exit) => {
                        exit.transition()
                            .duration(280)
                            .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                            .attr('y', height - 27)
                            .remove();
                    }
                );
  } else {
    xScale.domain(iter_data.map((d) => d.country))
        .range([margin.left, width - margin.right]);    
  
  // add bars to the visualisation for each data element
  svg.selectAll('rect')
      .data(iter_data)
      .join((enter) => {
          enter.append('rect')
              .attr('fill', (d) => bar_color(d.type))
              .attr('rx', '10')
              .attr('ry', '10')
              .attr('width', xScale.bandwidth)
              .attr('y', height - margin.top)
              .attr('height', 0)
              .attr('x', (d) => xScale(d.country) )
              .transition()
              .duration(280)
              .attr('y', (d) => yScale(d.value))
              .attr('height', (d) => height - margin.top - yScale(d.value));
      },
      (update) => {
          update
              .transition()
              .duration(280)
              .attr('y', (d) => yScale(d.value))
              .attr('width', xScale.bandwidth)
              .attr('height', (d) => height - margin.top - yScale(d.value))
              .attr('x', (d) => xScale(d.country) );
      },
      (exit) => {
          exit
              .transition()
              .duration(280)
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
                  .duration(280)
                  .attr('y', (d) => yScale(d.value) - 5)
                  .text((d) => {
                    if (d.value > 99999999) {
                      return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                  }
                  else if (d.value > 9999999) {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                  }
                  else if (d.value > 999999) {
                    return ''+d.value.toString().substring(0,1)+','+d.value.toString().substring(1,4)+','+d.value.toString().substring(4,7)
                  }
                  else if (d.value > 99999) {
                    return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                  } else {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)
                  }
                })
          },
          (update) => {
              update
                  .transition()
                  .duration(280)
                  .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                  .attr('y', (d) => yScale(d.value) - 5)
                  .text((d) => {
                    if (d.value > 99999999) {
                      return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)+','+d.value.toString().substring(6,9)
                  }
                  else if (d.value > 9999999) {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)+','+d.value.toString().substring(5,8)
                  }
                  else if (d.value > 999999) {
                    return ''+d.value.toString().substring(0,1)+','+d.value.toString().substring(1,4)+','+d.value.toString().substring(4,7)
                  }
                  else if (d.value > 99999) {
                    return ''+d.value.toString().substring(0,3)+','+d.value.toString().substring(3,6)
                  } else {
                    return ''+d.value.toString().substring(0,2)+','+d.value.toString().substring(2,5)
                  }
                })
          },
          (exit) => {
              exit.transition()
                  .duration(280)
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
                      .attr('width', '30px')
                      .attr('height', '30px')
                      .attr('z-index','500')
                      .attr('visibility','visible')
                      .attr('x', (d) => (xScale(d.country) + xScale.bandwidth()/2) - 15)
                      .attr('y', height - 27)
                      .transition()
                      .duration(280)
                      .attr('y', height - 27)
              },
              (update) => {
                  update
                      .transition()
                      .duration(280)
                      .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                      .attr('x', (d) => (xScale(d.country) + xScale.bandwidth()/2) - 15)
                      .attr('y', height - 27)
              },
              (exit) => {
                  exit.transition()
                      .duration(280)
                      .attr("xlink:href", (d) => '/flags/' + d.country + '.jpg')
                      .attr('y', height - 27)
                      .remove();
              }
          );
  }
  
  svg.select('.x.axis')
      .transition()
      .duration(280)
      .call(xaxis);

  svg.select('.y.axis')
      .transition()
      .duration(280)
      .call(yaxis);
}

const play = async function(classname, start, number, dataset, _width, _height, d3interval, duration) {
  document.getElementById("myBtn").disabled = true; 
  document.getElementById("births_deaths").disabled = true; 
  // document.getElementById("births").disabled = true; 
  // document.getElementById("deaths").disabled = true; 
  document.getElementById("population").disabled = true; 
  document.getElementById("submit").disabled = true; 
  document.getElementById("default").disabled = true; 

  create_svg(classname, _width, _height);
  year = 2009;

  document.getElementById("year").innerHTML = year;
  year++;  
  // console.log(0);
  // data = mydata[0].slice(start,number);
  data = dataset[0];
  console.log('data');
  console.log(data);
  update();
  t = d3.interval(update, d3interval);

  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(1);
      // data = mydata[1].slice(start,number);
      data = dataset[1];
       
      update();  
    }
  // }, 5000);
    }, constant + duration * 1);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(2);
      // data = mydata[2].slice(start,number);
      data = dataset[2];
      update();  
    }
    else {
      return;
    }
  // }, 6500);
    }, constant + duration * 2);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(3);
      // data = mydata[3].slice(start,number);  
      data = dataset[3];
      update();  
    }
    else {
      return;
    }
  // }, 8000);
    }, constant + duration * 3);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(4);
      // data = mydata[4].slice(start,number);  
      data = dataset[4];
      update();  
    }
    else {
      return;
    }
  // }, 9500);
    }, constant + duration * 4);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(5);
      // data = mydata[5].slice(start,number);
      data = dataset[5];
      update();  
    }
    else {
      return;
    }
  // }, 11000);
    }, constant + duration * 5);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(6);
      // data = mydata[6].slice(start,number); 
      data = dataset[6]; 
      update();  
    }
    else {
      return;
    }
  // }, 12500);
    }, constant + duration * 6);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(7);
      // data = mydata[7].slice(start,number); 
      data = dataset[7];   
      update();  
    }
    else {
      return;
    }
  // }, 14000);
    }, constant + duration * 7);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(8);
      // data = mydata[8].slice(start,number); 
      data = dataset[8];
      update();  
    }
    else {
      return;
    }
  // }, 15500);
    }, constant + duration * 8);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;  
      // console.log(9);
      // data = mydata[9].slice(start,number);  
      data = dataset[9];
      update();  
    }
    else {
      return;
    }
  // }, 17000);
    }, constant + duration * 9);
  
  setTimeout(() => {
    if(year > 2009){   
      document.getElementById("year").innerHTML = year;
      year++;
      // console.log(10);
      // data = mydata[10].slice(start,number);  
      data = dataset[10];
      update();  
    }
    else {
      return;
    }
    document.getElementById("myBtn").disabled = false; 
    document.getElementById("births_deaths").disabled = false; 
    // document.getElementById("births").disabled = false; 
    // document.getElementById("deaths").disabled = false; 
    document.getElementById("population").disabled = false; 
    document.getElementById("submit").disabled = false; 
    document.getElementById("default").disabled = false; 
  // }, 18500);
    }, constant + duration * 10);
}

function changecolour(name){
  // names = ['births','deaths','population'];
  names = ['births_deaths','population'];
  document.getElementById(name).className = "btn btn-success";
  for (let index = 0; index < names.length; index++) {
    if (names[index] != name) {
      document.getElementById(names[index]).className = "btn btn-outline-success";   
    } 
  }
}

function buttonClicked(classname, button, mylist){
  mydata = mylist;
  _button = button;
  if (check){
    checkWidth();
    default_countries();
  }
  else{
    submit_countries();
  }

  var list = document.getElementById("dashboard");
  list.removeChild(list.childNodes[5]);
  if (year < 2019) {
    // console.log(year);
    year = 0;
  }
  year = 2009;
  // console.log(mylist);
  changecolour(button);
  playgraph(classname, 1, number + 1, dataset, _width, _height, d3interval, duration);
}

const playgraph = async function(classname, start, number, dataset, _width, _height, d3interval, duration){
  const result = await play(classname, start, number, dataset, _width, _height, d3interval, duration);
}

function checkWidth(){
  let w = window.innerWidth;
  // let h = window.innerHeight;
  if (w > 1500) {
    _width = 1300;
    _height = 500;
    number = 10;
    constant = 3000;
    // d3interval = 300;
  } else if (w > 1200){
    _width = 1200;
    _height = 475;
    number = 9;
    constant = 2700;
    // d3interval = 380;
  } else if (w > 1000){
    _width = 1000;
    _height = 450;
    number = 8;
    constant = 2500;
    // d3interval = 430;
  } else if (w > 900){
    _width = 850;
    _height = 400;
    number = 6;
    constant = 2000;
    // d3interval = 580;
  } else if (w > 700){
    _width = 700;
    _height = 375;
    number = 5;
    constant = 1800;
    // d3interval = 700;
  } else {
    _width = 525;
    _height = 350;
    number = 4;
    constant = 1500;
    // d3interval = 850;
  }
  d3interval = Math.round((constant - 100) / number);
  // console.log(d3interval);
}

function checkSlider(){
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value / 1000 + ' seconds';
  duration = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value / 1000 + ' seconds';
    duration = this.value;
  }
}

function default_countries(){
  check = true;
  if (check){
    checkWidth();
  }
  dataset = [[],[],[],[],[],[],[],[],[],[],[]];

  indexes = [];
  
  if (_button == 'births_deaths'){
    for (let index = 2; index < Math.round(number/2) * 2 + 2; index++) {   
      if (index < 10) {      
        indexes.push(index);     
      } else if (index > 11 && index < 18){
        indexes.push(index);  
      } else if (index > 21){
        indexes.push(index);  
      }
    }
  }
  else{
    for (let index = 1; index < number; index++) {    
      indexes.push(index);
    }
  }  

  for (let i = 0; i < mydata.length; i++) {
    for (let j = 0; j < mydata[i].length; j++) {
      if(indexes.includes(j)){
        dataset[i].push(mydata[i][j]);
      }      
    }    
  }
  console.log(dataset);
}

function submit_countries(){
  dataset = [[],[],[],[],[],[],[],[],[],[],[]];

  for (let i = 0; i < mydata.length; i++) {
    for (let j = 0; j < mydata[i].length; j++) {
      if(selected_countries.includes(mydata[i][j].country)){
        dataset[i].push(mydata[i][j]);
      }      
    }   
  }
  // console.log(dataset); 

  if (_button != '') {
    number = selected_countries.length * 2;
  } else {
    number = selected_countries.length;
  }
  
  if (number > 20) {
    _width = 2500;
    // _height = 600;
    // number = 10;
    constant = 5000;
    // d3interval = 300;
  } else if(number > 15){
    _width = 2100;
    // _height = 500;
    // number = 9;
    constant = 4000;
    // d3interval = 380;
  } else if(number > 10){
    _width = 1600;
    // _height = 500;
    // number = 8;
    constant = 3000;
    // d3interval = 430;
  } else if(number > 8){
    _width = 1300;
    // _height = 450;
    // number = 6;
    constant = 2000;
    // d3interval = 580;
  } else if(number > 5){
    _width = 850;
    // _height = 400;
    // number = 5;
    constant = 1800;
    // d3interval = 700;
  } else {
    _width = 525;
    // _height = 350;
    // number = 4;
    constant = 1500;
    // d3interval = 850;
  }
  d3interval = Math.round((constant - 100) / number);

  check = false;
}

function replay_the_graph(){
  if (check){
    checkWidth();
  }
  var list = document.getElementById("dashboard");
  list.removeChild(list.childNodes[5]);
  if (year < 2019) {
    // console.log(year);
    year = 0;
  }
  year = 2009;
  playgraph('histogram', 1, number + 1, dataset, _width, _height, d3interval, duration);
}

population = [population[0].year2009,population[1].year2010,population[2].year2011,population[3].year2012,population[4].year2013,population[5].year2014,population[6].year2015,population[7].year2016,population[8].year2017,population[9].year2018,population[10].year2019]

births = [births[0].year2009,births[1].year2010,births[2].year2011,births[3].year2012,births[4].year2013,births[5].year2014,births[6].year2015,births[7].year2016,births[8].year2017,births[9].year2018,births[10].year2019]

deaths = [deaths[0].year2009,deaths[1].year2010,deaths[2].year2011,deaths[3].year2012,deaths[4].year2013,deaths[5].year2014,deaths[6].year2015,deaths[7].year2016,deaths[8].year2017,deaths[9].year2018,deaths[10].year2019]

mydata = population;

_button = '';

countries = mydata[0];

births_deaths = [[],[],[],[],[],[],[],[],[],[],[]]

// function dynamicSort(property) {
//   var sortOrder = 1;

//   if(property[0] === "-") {
//       sortOrder = -1;
//       property = property.substr(1);
//   }

//   return function (a,b) {
//       if(sortOrder == -1){
//           return b[property].localeCompare(a[property]);
//       }else{
//           return a[property].localeCompare(b[property]);
//       }        
//   }
// }

for (let index = 0; index < births.length; index++) {
  for (let j = 1; j < births[index].length+1; j++) {
    births_deaths[index][j*2-2] = births[index][j-1];
    for (let k = 0; k < deaths[index].length; k++) {
      if (deaths[index][k].country == births[index][j-1].country) {
        births_deaths[index][j*2-1] = deaths[index][k];        
      }      
    }
  }    
}

document.getElementById("type").innerHTML = "Population";

check = true;

selected_countries = []

checkSlider();

checkWidth();

changecolour('population');

default_countries(1);

playgraph('histogram', 1, number + 1, dataset, _width, _height, d3interval, duration);

document.getElementById("countries").onchange = function() {
  const sel = document.querySelectorAll('#countries option:checked');
  const values = Array.from(sel).map(el => el.value);
  selected_countries = values;
}

document.getElementById("submit").onclick = function() {
  submit_countries();
}

document.getElementById("default").onclick = function() {
  default_countries(1);
};

document.getElementById("myBtn").onclick = function() {
  replay_the_graph();
};

document.getElementById("births_deaths").onclick = function() {
  document.getElementById("type").innerHTML = "Births & Deaths";
  buttonClicked('histogram', "births_deaths", births_deaths);
};

// document.getElementById("births").onclick = function() {
//   document.getElementById("type").innerHTML = "Births";
//   buttonClicked('histogram', "births", births);
// };

// document.getElementById("deaths").onclick = function() {
//   document.getElementById("type").innerHTML = "Deaths";
//   buttonClicked('histogram', "deaths", deaths);
// };

document.getElementById("population").onclick = function() {
  document.getElementById("type").innerHTML = "Population";
  buttonClicked('histogram', "population", population);
};

}, 1500);