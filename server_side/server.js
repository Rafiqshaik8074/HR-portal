import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './Router/route.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = process.env.port;

app.get('/', (req, res) => {
  res.status(201).json("Home get request");
});

// Set caching headers to prevent response caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// API routes 
app.use('/api', router);

// Start the server only when we have a valid connection
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log("Cannot connect to the server"); 
  }); 