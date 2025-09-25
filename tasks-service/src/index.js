import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

const { PORT = 3002, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Tasks MongoDB conectado');
  app.listen(PORT, () => console.log(`Tasks-Service en http://localhost:${PORT}`));
}).catch(err => {
  console.error('Error conectando a MongoDB:', err.message);
  process.exit(1);
});
