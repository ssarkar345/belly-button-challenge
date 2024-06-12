// Build the metadata panel
// Function below was written using Eli/instructor's code that was given during class
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleArray = metadata.filter(obj => obj.id == sample);
    let selectedSample = sampleArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    panel.html("");

    // Inside a loop, append new tags for each key-value in the filtered metadata
    Object.entries(selectedSample).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(obj => obj.id == sample);
    let selectedSample = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let ids = selectedSample.otu_ids;
    let labels = selectedSample.otu_labels;
    let values = selectedSample.sample_values;

    // Build a Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    let bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
      }
    }];
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Build a Bar Chart
    let yTicks = ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "OTU ID", tickvals: ids.slice(0, 10).reverse(), ticktext: yTicks }
    };
    let barData = [{
      x: values.slice(0, 10).reverse(),
      y: yTicks,
      text: labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    Plotly.newPlot('bar', barData, barLayout);
  });
}

function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selectData = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      selectData
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();