// Define the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// INITIALIZE THE DASHBOARD
// Create a function to initialize the details
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Get the sample names and populate the dropdown options
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add sample names to the dropdown menu
        names.forEach((id) => {

            console.log(id);

            dropdownMenu.append("option").text(id).property("value", id);
        });

        // Get the first sample
        let sampleFirst = names[0];

        // Console log the first sample details
        console.log(sampleFirst);

        // Create the initial plots and demographic info
        charts(sampleFirst);
        demoInfo(sampleFirst);
        gaugeChart(sampleFirst);
    });
    };


// UPDATE THE CHARTS AND DEMOGRAPHIC INFO 
// Change the charts and demographic info box based on dropdown selection
function optionChanged(sampleNew) {
    charts(sampleNew);
    demoInfo(sampleNew);
    gaugeChart(sampleNew);
    };


// BUILD THE BAR AND BUBBLE CHARTS   
// Create a function to build the charts
function charts(sampleID) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

    // Retrieve all sample data
    let sampleData = data.samples;

    // Filter sample data by sample id
    let filteredSample = sampleData.filter(sample => sample.id == sampleID);

    // Get the first sample
    let firstSample = filteredSample[0]

    // Retrieve the data fields from sample
    let otu_ids = firstSample.otu_ids;
    let otu_labels = firstSample.otu_labels;
    let sample_values = firstSample.sample_values;

    // ----- HORIZONTAL BAR CHART ----- //

    // Create the trace for top 10 items for the bar chart
    let traceBar = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    // Create the data array for the bar chart
    let dataBar = [traceBar];

    // Set layout details for the bar chart
    let layoutBar = {
        title: `<b>Top 10 OTUs found in Individual ${sampleID}</b>`,
        // margin:{
        //     l:100,
        //     r:100,
        //     t:100,
        //     b:100
        // }
    };
  
    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", dataBar, layoutBar);


    // ----- BUBBLE CHART ----- //

    // Create the trace for the bubble chart
    let traceBubble = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };

    // Create the data array for the bubble chart
    let dataBubble = [traceBubble];

    // Set layout details for the bubble chart
    let layoutBubble = {
        title: "<b>Sample information</b>",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
    };

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
  });
};
  

// SAMPLE METADATA
// Create a function to get an individual's Demographic Information
function demoInfo(sampleID) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

    // Retrieve all metadata
    let metadata = data.metadata;

    // Filter sample data by id
    let filteredSample = metadata.filter(sample => sample.id == sampleID);

    // Get the first sample
    let firstSample = filteredSample[0]

    // Use D3 to select the Demographic Info box and clear any existing data
    let demoInfoBox = d3.select("#sample-metadata").html("");

    // Add key/value details from the filtered sample data to the demographic info box
    Object.entries(firstSample).forEach(([key, value]) => {

        demoInfoBox.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
  });
};


// GAUGE CHART
// Create a function to build the gauge chart
function gaugeChart(sampleID) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

    // Retrieve all metadata containing demographic information
    let metadata = data.metadata;

    // Filter sample data by id
    let filteredSample = metadata.filter(sample => sample.id == sampleID);

    // Get the first sample
    let firstSample = filteredSample[0]

    // Create the trace for top 10 items for the bar chart
    let traceGauge = {
        domain: { x: [0, 1], y: [0, 1] },
        value: firstSample.wfreq,
        title: {
            text: "<b>Belly Button Washing frequency</b><br>Scrubs per Week", 
            font: {size: 20}
        },
        type: "indicator",
        direction: "clockwise",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 9],
                tickmode: "linear"},
            shape: "angular",
            bgcolor: "white",
            borderwidth: 1,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "rgba(230, 220, 200, .5)" },
                { range: [1, 2], color: "rgba(210, 205, 150, .5)" },
                { range: [2, 3], color: "rgba(190, 200, 90, .5)" },
                { range: [3, 4], color: "rgba(170, 200, 40, .5)" },
                { range: [4, 5], color: "rgba(120, 160, 20, .5)" },
                { range: [5, 6], color: "rgba(20, 130, 0, .5)" },
                { range: [6, 7], color: "rgba(15, 100, 0 ,.5)" },
                { range: [7, 8], color: "rgba(10, 80, 0, .5)" },
                { range: [8, 9], color: "rgba(7, 60, 0, .5)" }
            ],
            threshold: {
                line: { color: "red", width: 5 },
                thickness: 1.5,
                value: firstSample.wfreq
              }
        }
   };

    // Create the data array for the bar chart
    let dataGauge = [traceGauge];

    // Set layout details for the bar chart
    let layoutGauge = {
        width: 400,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
      };
    
    // Render the plot to the div tag with id "gauge"
    Plotly.newPlot("gauge", dataGauge, layoutGauge);
    
  });
};


// Call the initialization function
init();