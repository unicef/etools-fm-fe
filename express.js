const express = require('express'); // eslint-disable-line
const compression = require('compression'); // eslint-disable-line

const app = express();
const basedir = __dirname + '/src/'; // eslint-disable-line

app.use(compression());

function getSourcesPath(_request) {
  return basedir;
}

app.use('/fm/', (req, res, next) => {
  express.static(getSourcesPath(req))(req, res, next);
});
app.use('/', (req, res, next) => {
  express.static(getSourcesPath(req))(req, res, next);
});

app.get(/.*service-worker\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'service-worker.js');
});

app.get('[^.]+', function(req, res) {
  // handles app access using a different state path than index (otherwise it will not return any file)
  res.sendFile(getSourcesPath(req) + 'index.html');
});

app.listen(8080);
