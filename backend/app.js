const path = require('path'),
      express = require('express'),
      app = express();

app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const unclassified = require('./controller/unclassified'),
      classified = require('./controller/classified');

app.use('/unclassified', unclassified);
app.use('/classified', classified);

module.exports = app;
