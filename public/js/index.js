// Jquery and Plotly are accessible here!
var genderData;
$(()=>{
    var request = $.ajax({url: "http://localhost:8080/data/gender"})
        .done((d)=>{
            console.log("done");
            genderData = d;
            var data = [{
                x: genderData.labels,
                y: genderData.values,
                type: "bar"
            }];
            Plotly.newPlot("chart", data);
            $("#data").text(`first 1000 chars: ${JSON.stringify(genderData).substring(0,1000)}`);
        });
});