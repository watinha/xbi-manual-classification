import path from 'path';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import classified from './controller/classified.js';
import unclassified from './controller/unclassified.js';

const app = express(),
      __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use('/unclassified', unclassified);
app.use('/classified', classified);

export default app;
