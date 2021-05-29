let births = []
let deaths = []
let population = []
let pop_0_14 = []
let pop_15_24 = []
let pop_25_49 = []
let pop_50_64 = []
let pop_65_79 = []
let pop_80 = []

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

fetch('/Datasets/pop_0_14.json')
.then(response => {
   return response.json();
})
.then(data => pop_0_14 = data);

fetch('/Datasets/pop_15_24.json')
.then(response => {
   return response.json();
})
.then(data => pop_15_24 = data);

fetch('/Datasets/pop_25_49.json')
.then(response => {
   return response.json();
})
.then(data => pop_25_49 = data);

fetch('/Datasets/pop_50_64.json')
.then(response => {
   return response.json();
})
.then(data => pop_50_64 = data);

fetch('/Datasets/pop_65_79.json')
.then(response => {
   return response.json();
})
.then(data => pop_65_79 = data);

fetch('/Datasets/pop_80.json')
.then(response => {
   return response.json();
})
.then(data => pop_80 = data);


setTimeout(() => {
  year2009 = population[0].year2009;
  // var bins = histogram(year2009);
  console.log(year2009);
  console.log(deaths);
  console.log(population);
  console.log(pop_0_14);
  console.log(pop_15_24);
  console.log(pop_25_49);
  console.log(pop_50_64);
  console.log(pop_65_79);
  console.log(pop_80);
// }, 200);

data = year2009.slice(1,year2009.length);

let width = 800;
const height = 800;

const margin = {
  top: 10,
  left: 50,
  right: 10,
  bottom: 10
}

// create the element where our visualisation will go
let svg = d3.select("#dashboard")
  .append('svg')
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
let xScale = d3.scaleBand()
  .range([margin.left, width - margin.right])
  .paddingInner(0.1)
  .paddingOuter(0.2);

// yscale - linear
let yScale = d3.scaleLinear()
  .range([height-margin.top, margin.bottom]);

let xaxis = d3.axisBottom(xScale);
let yaxis = d3.axisLeft(yScale);

// how many data items have we added? Also how many times update() has run
let count = 1;

function update() {

  // get the data for this iteration (data[0:count])
  iter_data = data.slice(0, count);
  
  // increase the size of the graphic (optional)
  width = width + 15;


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
      .duration(100)
      .attr('width', width);

  // update the domains for the scales
  yScale.domain([0, d3.max(iter_data, (d) => d.population)]);
  xScale.domain(iter_data.map((d) => d.country))
      .range([margin.left, width - margin.right]);
  
  // add bars to the visualisation for each data element
  svg.selectAll('rect')
      .data(iter_data)
      .join((enter) => {
          enter.append('rect')
              // .attr('fill', 'url("/flags/Greece.jpg")')
              // .attr('background-image', 'url("/flags/Greece.jpg")' )
              // .attr('background-color', '#cccccc' )
              // .attr('border-radius', '5px')
              .attr('width', xScale.bandwidth)
              .attr('y', height - margin.top)
              .attr('height', 0)
              .attr('x', (d) => xScale(d.country) )
              .transition()
              .duration(100)
              .attr('y', (d) => yScale(d.population))
              .attr('height', (d) => height - margin.top - yScale(d.population));
      },
      (update) => {
          update
              .transition()
              .duration(100)
              .attr('y', (d) => yScale(d.population))
              .attr('width', xScale.bandwidth)
              .attr('height', (d) => height - margin.top - yScale(d.population))
              .attr('x', (d) => xScale(d.country) );
      },
      (exit) => {
          exit
              .transition()
              .duration(100)
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
                  .attr('fill', 'white')
                  .attr('text-anchor', 'middle')
                  .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                  .attr('y', height - margin.top)
                  .transition()
                  .duration(100)
                  .attr('y', (d) => yScale(d.population) + 15)
                  .text((d) => d.population)
          },
          (update) => {
              update
                  .transition()
                  .duration(100)
                  .attr('x', (d) => xScale(d.country) + xScale.bandwidth()/2)
                  .attr('y', (d) => yScale(d.population) + 15)
                  .text((d) => d.population)
          },
          (exit) => {
              exit.transition()
                  .duration(100)
                  .attr('y', height - margin.top)
                  .remove();
          }
      );

  svg.select('.x.axis')
      .transition()
      .duration(100)
      .call(xaxis);

  svg.select('.y.axis')
      .transition()
      .duration(100)
      .call(yaxis);
}
// run the update function once
update();

// run the update function once every 2 seconds
let t = d3.interval(update, 150);
}, 2500);









// const sample = [
//     {
//       language: 'Rust',
//       value: 78.9,
//       color: '#fbfbfb'
//     },
//     {
//       language: 'Kotlin',
//       value: 75.1,
//       color: '#00a2ee'
//     },
//     {
//       language: 'Python',
//       value: 68.0,
//       color: '#fbcb39'
//     },
//     {
//       language: 'TypeScript',
//       value: 67.0,
//       color: '#007bc8'
//     },
//     {
//       language: 'Go',
//       value: 65.6,
//       color: '#65cedb'
//     },
//     {
//       language: 'Swift',
//       value: 65.1,
//       color: '#ff6e52'
//     },
//     {
//       language: 'JavaScript',
//       value: 61.9,
//       color: '#f9de3f'
//     },
//     {
//       language: 'C#',
//       value: 60.4,
//       color: '#5d2f8e'
//     },
//     {
//       language: 'F#',
//       value: 59.6,
//       color: '#008fc9'
//     },
//     {
//       language: 'Clojure',
//       value: 59.6,
//       color: '#507dca'
//     }
//   ];
  
// const svg = d3.select('svg');
// const svgContainer = d3.select('#dashboard');

// const margin = 80;
// const width = 700 - 2 * margin;
// const height = 500 - 2 * margin;

// const chart = svg.append('g')
//     .attr('transform', `translate(${margin}, ${margin})`);

// const xScale = d3.scaleBand()
// .range([0, width])
// .domain(sample.map((s) => s.language))
// .padding(0.3)

// const yScale = d3.scaleLinear()
// .range([height, 0])
// .domain([0, 100]);

// // vertical grid lines
// const makeXLines = () => d3.axisBottom()
// .scale(xScale)

// const makeYLines = () => d3.axisLeft()
// .scale(yScale)

// chart.append('g')
// .attr('transform', `translate(0, ${height})`)
// .call(d3.axisBottom(xScale));

// chart.append('g')
// .call(d3.axisLeft(yScale));

// //   vertical grid lines
// chart.append('g')
// .attr('class', 'grid')
// .attr('transform', `translate(0, ${height})`)
// .call(makeXLines()
//   .tickSize(-height, 0, 0)
//   .tickFormat('')
// )

// chart.append('g')
// .attr('class', 'grid')
// .call(makeYLines()
//   .tickSize(-width, 0, 0)
//   .tickFormat('')
// )

// const barGroups = chart.selectAll()
// .data(sample)
// .enter()
// .append('g')

// barGroups
// .append('rect')
// .attr('class', 'bar')
// .attr('x', (g) => xScale(g.language))
// .attr('y', (g) => yScale(g.value))
// .attr('height', (g) => height - yScale(g.value))
// .attr('width', xScale.bandwidth())
// .on('mouseenter', function (actual, i) {
//   d3.selectAll('.value')
//     .attr('opacity', 0)

//   d3.select(this)
//     .transition()
//     .duration(300)
//     .attr('opacity', 0.6)
//     .attr('x', (a) => xScale(a.language) - 5)
//     .attr('width', xScale.bandwidth() + 10)

//   const y = yScale(actual.value)

//   line = chart.append('line')
//     .attr('id', 'limit')
//     .attr('x1', 0)
//     .attr('y1', y)
//     .attr('x2', width)
//     .attr('y2', y)

//   barGroups.append('text')
//     .attr('class', 'divergence')
//     .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
//     .attr('y', (a) => yScale(a.value) + 30)
//     .attr('fill', 'white')
//     .attr('text-anchor', 'middle')
//     .text((a, idx) => {
//       const divergence = (a.value - actual.value).toFixed(1)
      
//       let text = ''
//       if (divergence > 0) text += '+'
//       text += `${divergence}%`

//       return idx !== i ? text : '';
//     })

// })
// .on('mouseleave', function () {
//   d3.selectAll('.value')
//     .attr('opacity', 1)

//   d3.select(this)
//     .transition()
//     .duration(300)
//     .attr('opacity', 1)
//     .attr('x', (a) => xScale(a.language))
//     .attr('width', xScale.bandwidth())

//   chart.selectAll('#limit').remove()
//   chart.selectAll('.divergence').remove()
// })

// barGroups 
// .append('text')
// .attr('class', 'value')
// .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
// .attr('y', (a) => yScale(a.value) + 30)
// .attr('text-anchor', 'middle')
// .text((a) => `${a.value}%`)

// svg
// .append('text')
// .attr('class', 'label')
// .attr('x', -(height / 2) - margin)
// .attr('y', margin / 2.4)
// .attr('transform', 'rotate(-90)')
// .attr('text-anchor', 'middle')
// .text('Love meter (%)')

// svg.append('text')
// .attr('class', 'label')
// .attr('x', width / 2 + margin)
// .attr('y', height + margin * 1.7)
// .attr('text-anchor', 'middle')
// .text('Languages')

// svg.append('text')
// .attr('class', 'title')
// .attr('x', width / 2 + margin)
// .attr('y', 40)
// .attr('text-anchor', 'middle')
// .text('Most loved programming languages in 2018')

// svg.append('text')
// .attr('class', 'source')
// .attr('x', width - margin / 2)
// .attr('y', height + margin * 1.7)
// .attr('text-anchor', 'start')
// .text('Source: Stack Overflow, 2018')

// births = []

// setTimeout(() => {
//   births = d3.json("/Datasets/births.json")
//   .then(function(data){
//     // Code from your callback goes here...
//     console.log(births);
//     return data
//   });
  
// }, 500);

// setTimeout(() => {
//   console.log(births);
// }, 2000);


// await births = currentloginid();
// console.log(await currentloginid());
// d3.json(url, function(error, data){
//   // births = data
//   console.log(data);
//   //use data here
// })

// setTimeout(() => {   }, 2000);

// console.log(births);