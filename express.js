var express = require('express');

var app = express();
var ROOT = __dirname + '/build/';

app.use('/field-monitoring/', express.static(ROOT));
app.use('/', express.static(ROOT));

app.get('[^.]+', function(req, res) {
  res.sendFile(ROOT + 'index.html');
});

app.listen(8080);
console.log('Server is listening.');
