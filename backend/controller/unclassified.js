import express from 'express';
import dataset from '../model/dataset.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { uncached } = req.query;

  try {
    res.json({ length: await dataset.unclassified_length(uncached) });
  } catch (e) {
    res.json({ length: -1 });
  }
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

export default router;
