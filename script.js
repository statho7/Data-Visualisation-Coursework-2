// Initialization of the 3 arrays for the births, the deaths and the population of the countries of EU28 for the years 2009-2019.
let births = []
let deaths = []
let population = []

// Fetching the json files and saving the data in the empty dedicated arrays
fetch('/Datasets/births.json')
.then(response => {
   return response.json();
})
.then(data => births = data);

fetch('/Datasets/deaths.json')
.then(response => {
   return response.json();
})
.then(data => deaths = data);

fetch('/Datasets/population.json')
.then(response => {
   return response.json();
})
.then(data => population = data);

//In order to give some time for the fetching process we set all the code inside a setTimeout that runs after 1.5 seconds
setTimeout(() => {

  // Function for the creation of the svg
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

  //Functions that returns the color of the bars for our graph
  function bar_color(type){
    if (type == 'deaths') {
      return 'rgba(200, 5, 5, 0.85)'
    }
    else{
      return 'rgba(15, 65, 250, 0.95)'
    }
  }

  //Function to display the numbers with ',' to be able for the reader to read the numbers above the bars 
  function number_display(value) {    
    if (value > 99999999) {
      return ''+value.toString().substring(0,3)+','+value.toString().substring(3,6)+','+value.toString().substring(6,9)
    }
    else if (value > 9999999) {
      return ''+value.toString().substring(0,2)+','+value.toString().substring(2,5)+','+value.toString().substring(5,8)
    }
    else if (value > 999999) {
      return ''+value.toString().substring(0,1)+','+value.toString().substring(1,4)+','+value.toString().substring(4,7)
    }
    else if (value > 99999) {
      return ''+value.toString().substring(0,3)+','+value.toString().substring(3,6)
    } else {
      return ''+value.toString().substring(0,2)+','+value.toString().substring(2,5)
    }
  }

  // Function based on the one Dr.Chorley provided in a lecture. 
  // There is a lot of functionality added to it in order to add flags
  // and to be able and have two rect elements side by side for the 
  // Births and Deaths of a country.
  function update() {

    // get the data for this iteration (data[0:count])
    iter_data = data.slice(0, count);

    // increase iteration count
    count++;
    // if we've got to the end of the data, stop running
    if(count > data.length) {
        t.stop();
    }

    // update the domains for the scales
    yScale.domain([0, d3.max(iter_data, (d) => d.value)]);

    // If the _button variable is not equal to '' then it is equal to 'births_deaths'
    // That means we want to create a graph for births and deaths so we need functionality for 2 rect elements
    // for each nation selected to be represented in the graph
    if (_button != '') {

      // We can see here that we have d.country + ' ' + d.type insted of just d.country
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
                      .attr('width', xScale.bandwidth() / 1.25)
                      .attr('y', height - margin.top)
                      .attr('height', 0)
                      .attr('x', (d) => xScale(d.country + ' ' + d.type) + xScale.bandwidth() * 0.1)
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
                      .attr('width', xScale.bandwidth() / 1.25)
                      .attr('height', (d) => height - margin.top - yScale(d.value))
                      .attr('x', (d) => xScale(d.country + ' ' + d.type) + xScale.bandwidth() * 0.1);
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
                          .text((d) => number_display(d.value))
                  },
                  (update) => {
                      update
                          .transition()
                          .duration(280)
                          .attr('x', (d) => xScale(d.country + ' ' + d.type) + xScale.bandwidth()/2)
                          .attr('y', (d) => yScale(d.value) - 5)
                          .text((d) => number_display(d.value))
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
                              // We point to the folder flags that contains the flags of all the countries
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
      // Here we have the normal implementations of Dr.Chorley that creates a bar for every country
      // It is used for the visualisation of the population

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
                .attr('width', xScale.bandwidth() / 1.25)
                .attr('y', height - margin.top)
                .attr('height', 0)
                .attr('x', (d) => xScale(d.country) + xScale.bandwidth() * 0.1 )
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
                .attr('width', xScale.bandwidth() / 1.25)
                .attr('height', (d) => height - margin.top - yScale(d.value))
                .attr('x', (d) => xScale(d.country) + xScale.bandwidth() * 0.1 );
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
                    .text((d) => number_display(d.value))
            },
            (update) => {
                update
                    .transition()
                    .duration(280)
                    .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                    .attr('y', (d) => yScale(d.value) - 5)
                    .text((d) => number_display(d.value))
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

  // The function that performs the run through the time
  const play = async function(classname, dataset, _width, _height, d3interval, duration) {
    // When the animation begins all the button are disabled
    // I did not had the time to develop a solution for pausing 
    // this function so I decided to disable the buttons in order to
    // prevent the user running it twice at the same time
    // and creating problems
    document.getElementById("myBtn").disabled = true; 
    document.getElementById("births_deaths").disabled = true; 
    document.getElementById("population").disabled = true; 
    document.getElementById("submit").disabled = true; 
    document.getElementById("default").disabled = true; 

    // Inside this function we create the svg
    create_svg(classname, _width, _height);

    //The first year is 2009 in our datasets
    year = 2009;

    // Display the in the h1 element wih id 'year'
    document.getElementById("year").innerHTML = year;
    year++;  

    // Set as our data the first array of the dataset array variable
    data = dataset[0];
    // Run the update() for these data
    update();
    t = d3.interval(update, d3interval);

    // I did not had the time to implement a more dynamic solution so for every year 
    // we have a setTimeout that changes the value of year, the data and runs the update()
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[1];
          
          update();  
        }
      }, constant + duration * 1);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[2];
          update();  
        }
        // In case of a problem with the variable year I just developed a return
        // It was never used in my testing but added just in case
        else {
          return;
        }
      }, constant + duration * 2);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;   
          data = dataset[3];
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 3);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[4];
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 4);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[5];
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 5);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[6]; 
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 6);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[7];   
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 7);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[8];
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 8);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;  
          data = dataset[9];
          update();  
        }
        else {
          return;
        }
      }, constant + duration * 9);
    
    setTimeout(() => {
        if(year > 2009){   
          document.getElementById("year").innerHTML = year;
          year++;
          data = dataset[10];
          update();  
        }
        else {
          return;
        }

        // We have run through all the years and now we enable the buttons again
        document.getElementById("myBtn").disabled = false; 
        document.getElementById("births_deaths").disabled = false; 
        document.getElementById("population").disabled = false; 
        document.getElementById("submit").disabled = false; 
        document.getElementById("default").disabled = false; 
      }, constant + duration * 10);
  }

  // This function changes the colour of the 2 buttons for our 2 visualisations 
  // so the user can understand at any time which graph she/he sees
  function changecolour(name){
    names = ['births_deaths','population'];
    document.getElementById(name).className = "btn btn-success";
    for (let index = 0; index < names.length; index++) {
      if (names[index] != name) {
        document.getElementById(names[index]).className = "btn btn-outline-success";   
      } 
    }
  }

  // This functions performes functionality whenever the Births&Deaths or Population buttons are clicked
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

    // With the next 2 lines of code we remove the svg
    // that already exists
    var list = document.getElementById("dashboard");
    list.removeChild(list.childNodes[5]);
    year = 2009;
    changecolour(button);
    playgraph(classname, dataset, _width, _height, d3interval, duration);
  }

  const playgraph = async function(classname, dataset, _width, _height, d3interval, duration){
    const result = await play(classname, dataset, _width, _height, d3interval, duration);
  }

  // Function that checks the width of the screen and adjust the
  // width, height of the svg. Also it sets the number of countries that will
  // be represented in the graph and the constant variable. The constant
  // is the time that the graph will wait for all the bars of the year 2009 to be created
  function checkWidth(){
    let w = window.innerWidth;
    if (w > 1500) {
      _width = 1300;
      _height = 500;
      number = 10;
      constant = 3000;
    } else if (w > 1200){
      _width = 1200;
      _height = 475;
      number = 9;
      constant = 2700;
    } else if (w > 1000){
      _width = 1000;
      _height = 450;
      number = 8;
      constant = 2500;
    } else if (w > 900){
      _width = 850;
      _height = 400;
      number = 6;
      constant = 2000;
    } else if (w > 700){
      _width = 700;
      _height = 375;
      number = 5;
      constant = 1800;
    } else {
      _width = 475;
      _height = 350;
      number = 4;
      constant = 1500;
    }

    // the d3interval used in the update() function
    d3interval = Math.round((constant - 100) / number);
  }

  // This function checks the slider for the duration that the animation will stop for each year
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

  // Function for dislaying the default countries I chose to display at the initiation of the svg
  function default_countries(){
    check = true;
    
    if (check){
      checkWidth();
    }

    dataset = [[],[],[],[],[],[],[],[],[],[],[]];

    indexes = [];
    
    // If the condition is true we have to add the births and deaths 
    // to one array instead of having two seperate. To do that we use 
    // the indexes of the births array as base.
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
      for (let index = 1; index < number + 1; index++) {    
        indexes.push(index);
      }
    }  

    // Creation of the dataset used for the svg
    for (let i = 0; i < mydata.length; i++) {
      for (let j = 0; j < mydata[i].length; j++) {
        if(indexes.includes(j)){
          dataset[i].push(mydata[i][j]);
        }      
      }    
    }
  }

  // Almost same functionality with the default_countries()
  // This is called when the user decides to expiriment with her/his own
  // selection of countries
  function submit_countries(){
    check = false;
    dataset = [[],[],[],[],[],[],[],[],[],[],[]];

    for (let i = 0; i < mydata.length; i++) {
      for (let j = 0; j < mydata[i].length; j++) {
        if(selected_countries.includes(mydata[i][j].country)){
          dataset[i].push(mydata[i][j]);
        }      
      }   
    }

    // Changing the width and constant of the CheckWidth()
    // As there is a high possibility for the graph to be too small and the name of the countries
    // overlaping one another if we do not take into consideration
    // how many countries the user selected
    if (_button != '') {
      number = selected_countries.length * 2;
    
      if (number > 20) {
        _width = 2850;
        constant = 5000;
      } else if(number > 15){
        _width = 2300;
        constant = 4000;
      } else if(number > 10){
        _width = 1950;
        constant = 3000;
      } else if(number > 8){
        _width = 1750;
        constant = 2000;
      } else if(number > 6){
        _width = 1300;
        constant = 1800;
      }else if(number > 4){
        _width = 900;
        constant = 1800;
      } else {
        _width = 650;
        constant = 1500;
      }
    } else {
      number = selected_countries.length;
      if (number > 20) {
        _width = 2500;
        constant = 5000;
      } else if(number > 15){
        _width = 2100;
        constant = 4000;
      } else if(number > 10){
        _width = 1600;
        constant = 3000;
      } else if(number > 8){
        _width = 1300;
        constant = 2000;
      } else if(number > 5){
        _width = 850;
        constant = 1800;
      } else {
        _width = 525;
        constant = 1500;
      }
    }

    // Add additional width as the United Kingdom name overlaps other country's name
    if(selected_countries.includes('United Kingdom')){
      _width = _width + 150;
    }
    
    d3interval = Math.round((constant - 100) / number);

    check = false;
  }

  // Function that replays the same category of animation (births & deaths or population)
  // It also adapts to a possible change of selected countries
  function replay_the_graph(){
    
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
    playgraph('histogram', dataset, _width, _height, d3interval, duration);
  }

population = [population[0].year2009,population[1].year2010,population[2].year2011,population[3].year2012,population[4].year2013,population[5].year2014,population[6].year2015,population[7].year2016,population[8].year2017,population[9].year2018,population[10].year2019]

births = [births[0].year2009,births[1].year2010,births[2].year2011,births[3].year2012,births[4].year2013,births[5].year2014,births[6].year2015,births[7].year2016,births[8].year2017,births[9].year2018,births[10].year2019]

deaths = [deaths[0].year2009,deaths[1].year2010,deaths[2].year2011,deaths[3].year2012,deaths[4].year2013,deaths[5].year2014,deaths[6].year2015,deaths[7].year2016,deaths[8].year2017,deaths[9].year2018,deaths[10].year2019]

mydata = population;

_button = '';

countries = mydata[0];

births_deaths = [[],[],[],[],[],[],[],[],[],[],[]]

// Creation of the mixed array for births and deaths
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

// 767 to 781 runs the default visualisation for population
document.getElementById("type").innerHTML = "Population";

check = true;

selected_countries = []

checkSlider();

checkWidth();

changecolour('population');

default_countries(1);

playgraph('histogram', dataset, _width, _height, d3interval, duration);
//
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

document.getElementById("population").onclick = function() {
  document.getElementById("type").innerHTML = "Population";
  buttonClicked('histogram', "population", population);
};

}, 1500);