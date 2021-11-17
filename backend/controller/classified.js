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
  dataset.save_classified();
  res.status(200).json({ message: 'Arff file generated!!!' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params,
        { data } = req.body;
  dataset.classify(id, data);
  res.status(200).json({ message: 'success! yay' });
});

router.get('/base/:position_x/:position_y/:current_id', (req, res) => {
  const { position_x, position_y, current_id } = req.params,
        result = dataset.search({ position_x, position_y, current_id });

  res.status(200).json({ closest: result });
});

router.get('/next/:current_id', (req, res) => {
  const { current_id } = req.params,
        result = dataset.next({ current_id });
  res.status(200).json({ 'id': result });
});

router.get('/back/:current_id', (req, res) => {
  const { current_id } = req.params,
        result = dataset.back({ current_id });
  res.status(200).json({ 'id': result });
});

export default router;
