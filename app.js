const path = require('path'),
      express = require('express'),
      app = express();

app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const fs = require('fs'),
      arff = require('arff');
let data = -1;

app.get('/unclassified', async (req, res) => {
  const { uncached } = req.query;

  if (data === -1 || uncached === '1') {
    const raw_data = await fs.promises.readFile(
      './data/dataset.unclassified.arff', { encoding: 'utf8' });
    data = arff.parse(raw_data);
  }

  res.json({ length: data['data'].length });
});

app.get('/unclassified/:id', async (req, res) => {
  const { uncached } = req.query,
        { id } = req.params;

  if (data === -1 || uncached === '1') {
    const raw_data = await fs.promises.readFile(
      './data/dataset.unclassified.arff', { encoding: 'utf8' });
    data = arff.parse(raw_data);
  }

  if (parseInt(id) < data['data'].length)
    res.json({ ...data['data'][parseInt(req.params.id)] });
  else
    res.status(404).json({});
});

module.exports = app;
