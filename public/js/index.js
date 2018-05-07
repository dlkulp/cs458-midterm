// Jquery and Plotly are accessible here!
var genderData;
var hoursData;
var educationData;
var progData;

var colorMap = ['#c5d8f7', '#b7cff7', '#a5c5f7', '#94bbf7', '#7baaf2', '#659ff7', '#4f93f9', '#2e7ff7', '#1b75f9', '#0768f7'];

function getColor(value) {
    switch (true) {
        case (value < 6):
            return colorMap[0];
            break;
        case (value < 6.5):
            return colorMap[1];
            break;
        case (value < 7):
            return colorMap[2];
            break;
        case (value < 7.5):
            return colorMap[3];
            break;
        case (value < 8):
            return colorMap[4];
            break;
        case (value < 8.5):
            return colorMap[5];
            break;
        default:
            return colorMap[6];
    }

}

function plotGenderChart() {
    var layout = {
        xaxis: {
            title: 'Gender',
        },
        yaxis: {
            title: 'Average Job Satisfaction',
            range: [0,10],
        }
    }
    var data = [{
        x: genderData.labels,
        y: genderData.values,
        type: "bar"
    }];
    Plotly.newPlot("chart", data, layout);
}

function plotHoursChart() {
    var layout = {
        xaxis: {
            title: 'Hours Worked Per Week',
        },
        yaxis: {
            title: 'Average Job Satisfaction',
            range: [0,10],
        }
    }
    var data = [{
        x: hoursData.labels,
        y: hoursData.values,
        type: "bar"
    }];
    Plotly.newPlot("chart", data, layout);
}

function plotEducationChart() {
    var layout = {
        xaxis: {
            title: 'Formal Education Level',
        },
        yaxis: {
            title: 'Average Job Satisfaction',
            range: [0,10],
        }
    }
    var data = [{
        x: educationData.labels,
        y: educationData.values,
        type: "bar"
    }];
    Plotly.newPlot("chart", data, layout);
}

function plotProgChart() {
    var layout = {
        xaxis: {
            title: 'Years Programming',
        },
        yaxis: {
            title: 'Average Job Satisfaction',
            range: [0,10],
        }
    }
    var data = [{
        x: progData.labels,
        y: progData.values,
        type: "bar"
    }];
    Plotly.newPlot("chart", data, layout);
}

$(()=>{
    // section to populate blocks/buttons initially:
    var genderRequest = $.ajax({url: "http://localhost:8080/data/gender"})
        .done((d)=>{
            genderData = d;
            console.log(d);
            var blockDiv = document.getElementById("blocks");
            var labelNum = 0;
            if (d.labels[labelNum] == null) labelNum = 1;
            var genderButton = '<div id="genderButton" style="float:left; margin:1%; width:45%; height:200px; background-color:' + getColor(d.values[labelNum]) + '; text-align:center" \
                onclick="plotGenderChart()"><p style="position:relative; top:50%; left:50%; transform:translateX(-50%) translateY(-50%);">' + d.labels[labelNum] + '</p></div';
            blockDiv.innerHTML += genderButton;
        });
    
    var hoursRequest = $.ajax({url: "http://localhost:8080/data/hours"})
        .done((d)=>{
            hoursData = d;
            console.log(d);
            var blockDiv = document.getElementById("blocks");
            var labelNum = 0;
            if (d.labels[labelNum] == null) labelNum = 1;
            var hoursButton = '<div id="hoursButton" style="float:left; margin:1%; width:45%; height:200px; background-color:' + getColor(d.values[labelNum]) + '; text-align:center" \
                onclick="plotHoursChart()"><p style="position:relative; top:50%; left:50%; transform:translateX(-50%) translateY(-50%);">' + d.labels[labelNum] + '</p></div';
            blockDiv.innerHTML += hoursButton;
        });
    
    var educationRequest = $.ajax({url: "http://localhost:8080/data/education"})
        .done((d)=>{
            educationData = d;
            console.log(d);
            var blockDiv = document.getElementById("blocks");
            var labelNum = 0;
            if (d.labels[labelNum] == null) labelNum = 1;
            var educationButton = '<div id="educationButton" style="float:left; margin:1%; width:45%; height:200px; background-color:' + getColor(d.values[labelNum]) + '; text-align:center" \
                onclick="plotEducationChart()"><p style="position:relative; top:50%; left:50%; transform:translateX(-50%) translateY(-50%);">' + d.labels[labelNum] + '</p></div';
            blockDiv.innerHTML += educationButton;
        });
    
    var progRequest = $.ajax({url: "http://localhost:8080/data/prog"})
        .done((d)=>{
            progData = d;
            console.log(d);
            var blockDiv = document.getElementById("blocks");
            var labelNum = 0;
            if (d.labels[labelNum] == null) labelNum = 1;
            var progButton = '<div id="progButton" style="float:left; margin:1%; width:45%; height:200px; background-color:' + getColor(d.values[labelNum]) + '; text-align:center" \
                onclick="plotProgChart()"><p style="position:relative; top:50%; left:50%; transform:translateX(-50%) translateY(-50%);">' + d.labels[labelNum] + '</p></div';
            blockDiv.innerHTML += progButton;
        });
    
    /*
    var genderRequest = $.ajax({url: "http://localhost:8080/data/gender"})
            .done((d)=>{
                genderData = d;
                var data = [{
                    x: genderData.labels,
                    y: genderData.values,
                    type: "bar"
                }];
                Plotly.newPlot("chart", data);
            });
    var hoursRequest = $.ajax({url: "http://localhost:8080/data/hours"})
        .done((d)=>{
            // console.log("done");
            hoursData = d;
            var data = [{
                x: hoursData.labels,
                y: hoursData.values,
                type: "bar"
            }];
            Plotly.newPlot("hours", data);
            // $("#data").text(`first 1000 chars: ${JSON.stringify(genderData).substring(0,1000)}`);
        });
    */
});