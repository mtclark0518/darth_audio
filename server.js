var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var PORT = process.env.PORT || 3000;


app.set('views', 'public');
app.set('view-engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.listen(PORT, function(){
    console.log('no digity');
});