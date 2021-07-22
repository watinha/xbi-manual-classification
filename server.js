const path = require('path'),
      express = require('express'),
      fs = require('fs'),
      arff = require('arff'),
      app = express();

app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/unclassified', async (req, res) => {
  const raw_data = await fs.promises.readFile(
          './data/dataset.unclassified.arff', { encoding: 'utf8' }),
        data = arff.parse(raw_data);

  res.json({ length: data['data'].length });
});

app.get('/unclassified/:id', async (req, res) => {
  const raw_data = await fs.promises.readFile(
          './data/dataset.unclassified.arff', { encoding: 'utf8' }),
        data = arff.parse(raw_data),
        id = parseInt(req.params.id);

  if (id < data['data'].length)
    res.json({ ...data['data'][parseInt(req.params.id)] });
  else
    res.status(404).json({});
});

module.exports = app;
