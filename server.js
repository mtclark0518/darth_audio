var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var PORT = process.env.PORT || 3000;


app.set('views', 'public');
app.set('view-engine', 'html');
app.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
    res.json('i like tha way ya work it');
    res.sendFile(__dirname + '/index.html');
});
router.get('/track', function(req, res){
    var file = __dirname + '/assets/audio/gta.mp3';
    fs.exists(file, function(exists){
        if(exists){
            var rstream = fs.createReadStream(file);
            rstream.pipe(res);
        } else {
            res.send('error');
            res.end();
        }
    }) 
});
router.get('/gta', function(req, res) {
    console.log('go time');
    let path = __dirname + '/assets/audio/gta.mp3';
    fs.exists(path, function(exists) {
        if(exists){
            res.writeHead(200, {
                "Content-Type": "audio/mp3",
                "Content-Disposition": "attachment; filename=" + file
            });
            fs.createReadStream(path).pipe(res);
        } else {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("ERROR");
        }
    });
});

app.listen(PORT, function(){
    console.log('no digity');
});