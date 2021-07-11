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

// Initial Labels
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

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


function yScale(myData, myYAxis) {
    // create scales
    var myLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d =>d[myYAxis]) *.95,
        d3.max(myData,d=>d[myYAxis]) *1.05
        ])
        .range([height,0]);
    return myLinearScale;
}

// updating circles group X with a transition to
// new circles
function renderCirclesX(circlesGroup, stateText, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    stateText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// updating circles group Y with a transition to
// new circles
function renderCirclesY(circlesGroup, stateText, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    stateText.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

    var labelx;
    var labely;
  
    if (chosenXAxis === "poverty") {
      labelx = "Poverty Rate:";
    }
    
    else if (chosenXAxis === "income") {
        labelx = "Household Income:";
      }
    
    else {
      labelx = "Median Age:";
    }

    if (chosenyAxis === "obesity") {
        labely = "Obesity %:";
      }
      
      else if (chosenYAxis === "smokes") {
          labely = "Smoking %:";
        }
      
      else {
        labely = "Lacks Healthcare %:";
      }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d){
          `${d.state}<br>${labelx} ${d[chosenXAxis]}<br>${labely} ${choshenYAxis}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
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
    object.income = +object.income/1000;
    object.age = +object.age;
    object.obesity = +object.obesity;
    object.smokes = +object.smokes;
    object.healthcareLow = +object.healthcareLow;
  });
  console.log(data[0]);

   // get the Linear Scale for X
   var xLinearScale = xScale(data, 'poverty');

    // find y scale range
    var yLinearScale = yScale(data, 'obesity');


    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = scatterPlot.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    var yAxis = scatterPlot.append("g")
    .classed("y-axis", true)
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
  
    var stateText= scatterPlot.selectAll("text.label")
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
        .text("Household Income (Thousands)");
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

     // append y-axis groups

     var ylabelsGroup = scatterPlot.append("g")
    .attr("transform", `translate(-30, ${height/6})`);
    
     var obeseLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -100)
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obese %");

    var smokeLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("x", 0-margin.left)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smoke %");

    var healthLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0-margin.left)
        .attr("value", "healthcareLow") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare %");
        
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    //event listeners
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
        console.log(value);
      // replaces chosenXAxis with value
      chosenXAxis = value;

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(data, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxesX(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCirclesX(circlesGroup, stateText, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      //scatterPlot = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      else if (chosenXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "age"){
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false); 
      }
    }
  });

    // Y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
        console.log(value);
      // replaces chosenXAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates x axis with transition
      yAxis = renderAxesY(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCirclesY(circlesGroup, stateText, yLinearScale, chosenYAxis);
      // updates tooltips with new info
      //scatterPlot = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
          
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      else if (chosenYAxis === "smokes") {
        
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcareLow"){
        
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", true)
          .classed("inactive", false); 
      }
    }
  });
})



