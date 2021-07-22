const express = require('express'),
      router = express.Router(),
      { load } = require('../model/dataset_loader');

let dataset_cache = -1;

router.get('/', async (req, res) => {
  const { uncached } = req.query;

  if (dataset_cache === -1 || uncached === '1')
    dataset_cache = await load('./data/dataset.unclassified.arff');

  res.json({ length: dataset_cache['data'].length });
});

router.get('/:id', async (req, res) => {
  const { uncached } = req.query,
        { id } = req.params;

  if (dataset_cache === -1 || uncached === '1')
    dataset_cache = await load('./data/dataset.unclassified.arff');

  if (parseInt(id) < dataset_cache['data'].length)
    res.json({ ...dataset_cache['data'][parseInt(req.params.id)] });
  else
    res.status(404).json({});
});

module.exports = router;
