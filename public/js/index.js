// Jquery and Plotly are accessible here!
//const envUrl = process.env == "dev" ? "http://localhost:8080" : "";
var data;
$(()=>{
    var request = $.ajax({url: "http://localhost:8080/data"})//`${envUrl}/data`});
        .done((d)=>{
            data = d;
            $("#data").text(`first 1000 chars: ${JSON.stringify(d).substring(0,1000)}`);
        });
});