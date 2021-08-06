import express from 'express';
import fs from 'fs';

import dataset from '../model/dataset.js';

const router = express.Router();

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

export default router;
