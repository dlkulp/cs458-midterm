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
    else queryDatabaseAll(queryAll); // Get the data right off the bat, speeds up requests as server has data "cached"
});

function queryDatabaseAll(query) { 
    console.log(query);
    console.log("Reading rows from the Table...");

    // Read all rows from table
    let request = new Request(query, (err, rowCount, rows) => {
        console.log(`${rowCount} row(s) returned`);
        allData = rows;
    });

    connection.execSql(request);
}

// Home
app.get('/', (req, res) => {
    res.status(200).sendFile(`${__dirname}/public/index.html`);
});

app.get("/data", (req, res) => {
    while (allData.length == 0){} // In case the user is really quick-like
    res.json(allData);
});

// Start server and list on port
if (module === require.main) {
	const server = app.listen(process.env.PORT || 8080, () => {
		const port = server.address().port;
		console.log(`App listening on port ${port}`);
	});
}

module.exports = app;