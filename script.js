const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const height = 600;
const width = 1200;
const padding = 70;

const baseTemperatureDOM = document.querySelector("#baseTemperature");
const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");
let baseTemperature;
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
        return item.year + 1;
      }),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

const generateAxis = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  //timeFormat method %B is to spell the whold month as string
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

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

const drawCells = (arr) => {
  svg
    .selectAll("rect")
    .data(arr)
    .enter()
    .append("rect")
    .attr("class", "cell")
    //fill the cells depends on the range of variance
    .attr("fill", (item) => {
      let variance = item["variance"];
      if (variance <= -1) {
        return "SteelBlue";
      } else if (variance <= 0) {
        return "LightSteelBlue";
      } else if (variance <= 1) {
        return "Orange";
      } else {
        return "Crimson";
      }
    })
    .attr("data-month", (item) => {
      return item.month - 1;
    })
    .attr("data-year", (item) => {
      return item.year;
    })
    //take variance plus base temperature
    .attr("data-temp", (item) => {
      return baseTemperature + item.variance;
    })
    //total height minus 2 sides of padding and divided by 12
    .attr("height", () => {
      return (height - 2 * padding) / 12;
    })
    //first take away both side of padding, then divide the width by the total number of years
    .attr("width", () => {
      let numberOfYear =
        d3.max(arr, (item) => {
          return item.year;
        }) -
        d3.min(arr, (item) => {
          return item.year;
        });

      return (width - padding * 2) / numberOfYear;
    })
    //js start counting from 0, so month need to be minus 1
    .attr("y", (item) => {
      return yScale(new Date(0, item.month - 1, 0, 0, 0, 0, 0));
    })
    .attr("x", (item) => {
      return xScale(item.year);
    })
    //hover the cell will make the tooltip div visible and show the date of data
    .on("mouseover", (item) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      tooltip.transition().style("visibility", "visible");
      //round up temperature to 2 decimal place and show month in string
      tooltip.html(
        item.year +
          " - " +
          monthNames[item.month - 1] +
          "<br/>" +
          "Temperature: " +
          Math.round((baseTemperature + item.variance) * 100) / 100 +
          "°C" +
          "<br/>" +
          "Variance: " +
          item.variance
      );

      tooltip.attr("data-year", item.year);
    })
    //change visibility back to hidden when mouse is not on the cell
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  //update dom of base temperature
  baseTemperatureDOM.textContent = data.baseTemperature;
  baseTemperature = data.baseTemperature;

  drawCanvas();
  generateScale(data.monthlyVariance);
  generateAxis();
  drawCells(data.monthlyVariance);
  generateLegend(data.monthlyVariance);
}

getData();
