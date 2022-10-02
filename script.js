const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const height = 400;
const width = 800;
const padding = 40;

const baseTemperature = document.querySelector("#baseTemperature");
const svg = d3.select("svg");
let xScale;
let yScale;

const drawCanvas = () => {
  svg.attr("width", width).attr("hieght", height);
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

async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  baseTemperature.textContent = data.baseTemperature;
  drawCanvas();
  generateScale(data.monthlyVariance);
}

getData();
