import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import routes from './routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limit para /login y /register
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth', authLimiter);

app.use('/api', routes);

const { PORT = 3001, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Auth MongoDB conectado');
  app.listen(PORT, () => console.log(`Auth-Service en http://localhost:${PORT}`));
}).catch(err => {
  console.error('Error conectando a MongoDB:', err.message);
  process.exit(1);
});
