// Source URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch json data and log

let data = d3.json(url).then(function(data){

    console.log(data);
});

// Create init function
function init(){
    // create dropdown list variable for all sample ids
    let dropdownMenu = d3.select("#selDataset");
    //access sample data using d3
    d3.json(url).then(function(data) {
    // populate dropdown
    let sampleNames = data.names;
        sampleNames.forEach((name) =>{
            console.log(name)
            dropdownMenu.append("option")
            .text(name)
            .property("value", name);
            });
         //store first sample for display
        let first_entry = sampleNames[0];
        //console.log(first_entry);

        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);

        });
};

// Create function to populate horizontal barchart
function makeBar(sampleID){
    d3.json(url).then(function(data) {
    let samples = data.samples;
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];


    let sample_values = sample.sample_values
    let otu_ids = sample.otu_ids
    let otu_labels = sample.otu_labels
    //console.log(sample_values);
    //console.log(otu_ids);
    //console.log(otu_labels);

    let barTrace = [{
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => "OTU"+otu_id).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h'
    }];

    let layout = {title : "Top Ten OTUs"};
    Plotly.newPlot("bar", barTrace, layout);
   });
};

function makeBubble(sampleID){
      d3.json(url).then(function(data) {
        let samples = data.samples;
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        let sample_values = sample.sample_values
        let otu_ids = sample.otu_ids
        let otu_labels = sample.otu_labels
        //console.log(sample_values);
        //console.log(otu_ids);
        //console.log(otu_labels);

        let bubbleTrace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            }];
            let layout = {
                title: "Bacteria Count for each Sample ID",
                xaxis: {title: 'OTU ID'},
                yaxis: {title: 'Number of Bacteria'}

            };
            Plotly.newPlot("bubble", bubbleTrace, layout)
            });
        };

function makeDemographics(sampleID){
    d3.json(url).then(function(data)  {
        let metadata = data.metadata;
        let sampleArray = metadata.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];
        //console.log(first_result);
        let panel = d3.select('#sample-metadata');
        panel.html("")

        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+":"+sample[key])}
        })
        }

function optionChanged(sampleID){

            makeBar(sampleID);
            makeBubble(sampleID);
            makeDemographics(sampleID);
}
init()