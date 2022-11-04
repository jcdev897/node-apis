'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var {parse} = require('csv-parse');

var conn = require('./db/conn');

function makeId(length) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.set("port", process.env.PORT || 4000);

app.get('/datasets', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response": ["routes_data", "network_data"] }
   console.log(response);
   res.end(JSON.stringify(response));
})

app.get('/dataset/:id', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   fs.createReadStream("./data/" + req.params.id + "_for_maps.csv")
    .pipe(parse({ delimiter: ",", from_line: 1, columns: true }))
    .on("data", function (row) {
      console.log(row);
    })
    .on("error", function(error){
      console.log(error.message)
    })
   var response = { "response" : "This is GET method with id=" + req.params.id + "." }
   res.end(JSON.stringify(response));
})

app.get('/makeid', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var id = makeId(10);
  var response = {"id": id};
  res.end(JSON.stringify(response));
})

app.patch('/app-data/:id', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var id = req.params.id;
  console.log(id);
  var jsonData = req.data;
  console.log(req.body);
  conn.updateMapConfig(id, jsonData);
  //conn.closeDatabase();
})

app.get('/app-data', function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  conn.getAllConfig();
  conn.closeDatabase();
  var response = { "response" : "The list of all app config data" }
  res.end(JSON.stringify(response));
})

var server = app.listen(app.get("port"), "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Node.js API app listening at http://%s:%s", host, port)
})