// Define the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        // buildMetadata(sample_one);
        barChart(sample_one);
        // buildBubbleChart(sample_one);
        // buildGaugeChart(sample_one);
    });
    }
      // Pull data for new subject into demo and visuals. 
      function optionChanged(newSample) {
        charts(newSample);
        demo(newSample);
      }


// Initializes the page with a default plot
function barChart(sampleID) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

    // Retrieve all sample data
    let sampleData = data.samples;

    // Filter sample data by id
    let filteredSample = sampleData.filter(sample => sample.id == sampleID);

    // Get the first sample
    let firstSample = filteredSample[0]

    let otu_ids = firstSample.otu_ids;
    let otu_labels = firstSample.otu_labels;
    let sample_values = firstSample.sample_values;

    let trace1 = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    let barData = [trace1];

    let layout = {
        title: "Top 10 OTUs found in Individual " + sampleID,
        // margin:{
        //     l:100,
        //     r:100,
        //     t:100,
        //     b:100
        // }
    }
  
    Plotly.newPlot("bar", barData, layout);
  });
};
  



init();