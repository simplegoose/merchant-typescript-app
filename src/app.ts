import express from 'express';
const cors = require('cors');
const app = express();
import authRoutes from './routes/auth-routes';
import stockRoutes from './routes/stock-router';
import salesRoutes from './routes/sales-routes';
require('./db/conn');

const corsOptions = {
    origin: ['http://localhost:45205', 'http://localhost:3001',],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
}

app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', authRoutes);
app.use('/api', salesRoutes);
app.use('/api', stockRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
