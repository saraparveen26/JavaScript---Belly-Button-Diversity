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
        gaugeChart(sampleFirst);
    });
    };


// UPDATE THE GAUGE CHART
// Change the gauge charts based on dropdown selection
function optionChanged(sampleNew) {
    gaugeChart(sampleNew);
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