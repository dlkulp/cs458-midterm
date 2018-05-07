'use strict';

const express = require("express");
const path = require("path");
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const app = express();
app.enable("trust proxy");
const loadJsonFile = require('load-json-file');
const secrets = loadJsonFile.sync("secrets.json");

// Database stuff
const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['css', 'js'],
    index: false,
    maxAge: '1d',
    redirect: false,
     setHeaders: function (res, path, stat) {
       res.set('x-timestamp', Date.now())
     }
  }
app.use(express.static(`${__dirname}/public`, options));
const queryAll = "select r.id, r.careerSatisfaction, r.jobSatisfaction, r.hoursPerWeek, r.startWork, r.stackOverflowSatisfaction, r.salary, cs.id, ct.[type], fj.method, fe.[level], gd.gender, js.[status], lj.[time],	rw.amount, so.usage, ts.[type], yp.years from Responses as r left outer join CompanySize cs on r.companySizeId = cs.id left outer join CompanyType ct on r.companyTypeId = ct.id left outer join FindJob fj on r.findJobId = fj.id left outer join FormalEducation fe on r.formalEducationId = fe.id left outer join Genders gd on r.genderId = gd.id left outer join JobSeekingStatus js on r.jobSeekingStatusId = js.id left outer join LastJob lj on r.lastJobId = lj.id left outer join RemoteWork rw on r.remoteWorkId = rw.id left outer join StackOverflow so on r.stackOverflowId = so.id left outer join TabsSpaces ts on r.tabsSpacesId = ts.id left outer join YearsProgramming yp on r.yearsProgrammingId = yp.id;";
let allData = [];
const queryGenderHappy = "select gd.gender as Gender, avg(cast(r.jobSatisfaction as Float)) as JobSatisfaction from Responses as r left outer join Genders gd on r.genderId = gd.id group by gd.gender order by JobSatisfaction desc";
let genderHappyData = [];
const queryHoursHappy = "select r.hoursPerWeek as HoursPerWeek, avg(cast(r.jobSatisfaction as Float)) as JobSatisfaction from Responses as r group by r.hoursPerWeek order by JobSatisfaction desc";
let hoursHappyData = [];
const queryEducationHappy = "select fe.level as Level, avg(cast(r.jobSatisfaction as Float)) as JobSatisfaction from Responses as r left outer join FormalEducation fe on r.formalEducationId = fe.id group by fe.level order by JobSatisfaction desc";
let educationHappyData = [];
const queryProgHappy = "select yp.years as Years, avg(cast(r.jobSatisfaction as Float)) as JobSatisfaction from Responses as r left outer join YearsProgramming yp on r.yearsProgrammingId = yp.id group by yp.years order by JobSatisfaction desc";
let progHappyData = [];


// Clean up data to send to client
function cleanAll(item, index) {
    var arr = [];
    for (var i = 0; i < item.length; i++)
        arr.push({[item[i].metadata.colName]:item[i].value});
    return arr;
}

// Create connection to database
const config = {
    userName: secrets.Azure.uName,
    password: secrets.Azure.pass,
    server: secrets.Azure.server,
    options: {
        database: "CS458", 
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
};
let connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", (err)=>{
    if (err) console.log(err);
    else {
        console.log("connected to db");
        // Start server and list on port once data has been retrieved
        if (module === require.main) {
            const server = app.listen(process.env.PORT || 8080, () => {
                const port = server.address().port;
                console.log(`App listening on port ${port}`);
            });
        }
    }
});

function queryDatabase(query, type) { 
    console.log(query);
    console.log("Reading rows from the Table...");

    return new Promise((resolve, reject)=>{
        // Read all rows from table
        let request = new Request(query, (err, rowCount, rows) => {
            console.log(`${rowCount} row(s) returned`);
            resolve(rows);
        });

        connection.execSql(request);
    });
}

// Home
app.get('/', (req, res) => {
    res.status(200).sendFile(`${__dirname}/public/index.html`);
});

// Data
app.get("/data/:type", (req, res) => {
    switch (req.params.type) {
        case "all": 
            if (allData.length == 0) {
                queryDatabase(queryAll).then((data)=>{
                    allData = data.map(cleanAll);
                    res.json(allData);
                });
            }
            else res.json(allData);
            break;
        case "gender": 
            if (genderHappyData.length == 0) {
                let plotlyData = {labels:[], values:[]};
                queryDatabase(queryGenderHappy).then((data)=>{
                    for (var i = 0; i < data.length; i++) {
                        plotlyData.labels.push(data[i][0].value);
                        plotlyData.values.push(data[i][1].value);
                    }
                    genderHappyData = plotlyData;
                    res.json(genderHappyData);
                });
            }
            else res.json(genderHappyData);
            break;
        case "hours": 
            if (hoursHappyData.length == 0) {
                let plotlyData = {labels:[], values:[]};
                queryDatabase(queryHoursHappy).then((data)=>{
                    for (var i = 0; i < data.length; i++) {
                        plotlyData.labels.push(data[i][0].value);
                        plotlyData.values.push(data[i][1].value);
                    }
                    hoursHappyData = plotlyData;
                    res.json(hoursHappyData);
                });
            }
            else res.json(hoursHappyData);
            break;
        case "education": 
            if (educationHappyData.length == 0) {
                let plotlyData = {labels:[], values:[]};
                queryDatabase(queryEducationHappy).then((data)=>{
                    for (var i = 0; i < data.length; i++) {
                        plotlyData.labels.push(data[i][0].value);
                        plotlyData.values.push(data[i][1].value);
                    }
                    educationHappyData = plotlyData;
                    res.json(educationHappyData);
                });
            }
            else res.json(educationHappyData);
            break;
        case "prog": 
            if (progHappyData.length == 0) {
                let plotlyData = {labels:[], values:[]};
                queryDatabase(queryProgHappy).then((data)=>{
                    for (var i = 0; i < data.length; i++) {
                        plotlyData.labels.push(data[i][0].value);
                        plotlyData.values.push(data[i][1].value);
                    }
                    progHappyData = plotlyData;
                    res.json(progHappyData);
                });
            }
            else res.json(progHappyData);
            break;
        default: res.status(404).send("Type not recognized");  
    }
});

module.exports = app;