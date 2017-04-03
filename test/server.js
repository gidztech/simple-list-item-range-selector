var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, '..', 'demo')));

app.get('/', function (req, res)  {
    res.sendFile('index.html');
});

let server = app.listen(3000, function ()  {
    console.log('Started test server');
});