//SET BOUNDARIES--------------------
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width =svgWidth- margin.left - margin.right;
var height =svgHeight - margin.top - margin.bottom;

//append the svg
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var scatterPlot = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//FUNCTIONS--------------------
// function used for updating x-scale var upon click on axis label
function xScale(myData, myXAxis) {
    // create scales
    var myLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d =>d[myXAxis]) *.9,
        d3.max(myData,d=>d[myXAxis]) *1.1
        ])
        .range([0,width]);
    return myLinearScale;
}

//MAIN--------------------

//Loads the data from the csv
var dataPath = "assets/data/data.csv"; 
d3.csv(dataPath).then((importedData)=>{
    var data = importedData;
    console.log(data[0]);

  // convert data into integers for graphing
  data.forEach(object => {
    object.poverty = +object.poverty;
    object.obesity = +object.obesity;
  });
  console.log(data[0]);

   // get the Linear Scale for X
   var xLinearScale = xScale(data, 'poverty');

    // find y scale range
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.obesity)*.95, d3.max(data, d => d.obesity)*1.05])
    .range([height, 0]);



    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = scatterPlot.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    scatterPlot.append("g")
    .call(leftAxis);

    // append initial circles
    var circlesGroup = scatterPlot.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d['poverty']))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 9)
    .attr("fill", "green")
    .attr("opacity", ".7");
  
    scatterPlot.selectAll("text.label")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d['poverty']))
        .attr("y", d => yLinearScale(d.obesity))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline","middle")
        .attr("font-size", "10")
        .attr("fill", "white");

    // Create group for three x-axis labels
    var xlabelsGroup = scatterPlot.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty Rate");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income");
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

     // append y-axis groups

     var ylabelsGroup = scatterPlot.append("g")
    .attr("transform", `translate(-30, ${height/6})`);
    
     var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -100)
        .classed("active", true)
        .text("Obese %");

    var smokeLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("x", 0-margin.left)
        .classed("inactive", true)
        .text("Smoke %");

    var healthLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0-margin.left)
        .classed("inactive", true)
        .text("Lacks Healthcare %");

        



})



