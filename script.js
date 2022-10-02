const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const height = 600;
const width = 1200;
const padding = 40;

const baseTemperature = document.querySelector("#baseTemperature");
const svg = d3.select("svg");
let xScale;
let yScale;

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScale = (arr) => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(arr, (item) => {
        return item.year;
      }),
      d3.max(arr, (item) => {
        return item.year;
      }),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(arr, (item) => {
        return item.month;
      }),
      d3.max(arr, (item) => {
        return item.month;
      }),
    ])
    .range([padding, height - padding]);
};

const generateAxis = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  //update dom of base temperature
  baseTemperature.textContent = data.baseTemperature;
  
  drawCanvas();
  generateScale(data.monthlyVariance);
  generateAxis();
}

getData();
