const express = require('express'),
      router = express.Router(),
      fs = require('fs'),
      arff = require('arff');
let data = -1;

router.get('/', async (req, res) => {
  const { uncached } = req.query;

  if (data === -1 || uncached === '1') {
    const raw_data = await fs.promises.readFile(
      './data/dataset.unclassified.arff', { encoding: 'utf8' });
    data = arff.parse(raw_data);
  }

  res.json({ length: data['data'].length });
});

router.get('/:id', async (req, res) => {
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

module.exports = router;
