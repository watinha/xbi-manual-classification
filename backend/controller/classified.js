const express = require('express'),
      router = express.Router(),
      dataset = require('../model/dataset');

let fs = require('fs');

router.get('/', async (req, res) => {
  const { uncached } = req.query;
  try {
    res.json({ length: await dataset.classified_length(uncached) });
  } catch (e) {
    res.json({ length: -1 });
  }
});

module.exports = router;
