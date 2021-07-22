const express = require('express'),
      router = express.Router(),
      dataset = require('../model/dataset');

router.get('/', async (req, res) => {
  const { uncached } = req.query;

  len = await dataset.unclassified_length(uncached);

  res.json({ length: len });
});

router.get('/:id', async (req, res) => {
  const { uncached } = req.query,
        { id } = req.params;

  let row = await dataset.get_unclassified(parseInt(id), uncached);

  if (row)
    res.json(row);
  else
    res.status(404).json({});
});

module.exports = router;
