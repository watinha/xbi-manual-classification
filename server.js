let http = require('http'),
  path = require('path'),
  express = require('express'),
  app = express();

app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));

app.listen(3000);

