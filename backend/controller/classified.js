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

router.post('/', async (req, res) => {
  const { action, data } = req.body;

  switch (action) {
    case 'add':
      dataset.add_classified(data);
      res.status(201).json({ message: 'success! yay' });
      break;
    case 'save':
      dataset.save_classified();
      res.status(200).json({ message: 'Arff file generated!!!' });
      break;
  }
});

module.exports = router;
