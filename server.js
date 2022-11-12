'use strict';

var express = require('express');
var app = express();
const cors = require('cors');
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

app.use(cors());
app.set("port", process.env.PORT || 4000);

app.get('/datasets', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var configDatas = [];
   var response = '';
   fs.readdir('./data/', (err, files) => {
    files.forEach((file) => {
      configDatas.push(file.replace('.csv', ''));
    });
    response = JSON.stringify(configDatas);
    console.log(response);
    res.end(response);
  });
})

app.get('/dataset/:id', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   let data = conn.selectAll(req.params.id).then((result) => {
    console.log(result);
    res.end(JSON.stringify(result));
   });
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
  var jsonData = req.data;
  conn.updateMapConfig(id, jsonData);
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