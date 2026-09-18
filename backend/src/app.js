import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);
app.use(errorHandler);
