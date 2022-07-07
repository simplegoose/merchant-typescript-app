import express, { Request, Response } from 'express';
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

// app.post('/add-favor', async (req, res) => {
//     const {
//         friend,
//         photoUrl,
//         favor,
//         uuid,
//         completedDate,
//         isComplete,
//         isRequested,
//         isDoing,
//         isRefused
//     } = req.body;

//     try {
//         const favorInit = new FavorModel({
//             friend,
//             photoUrl,
//             favor,
//             uuid,
//             completedDate,
//             isComplete,
//             isRequested,
//             isDoing,
//             isRefused
//         });

//         await favorInit.save();

//         res
//         .status(200)
//         .send({ message: responseMessage.saved });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: responseMessage.serverError });
//     }

// });

// app.post('/update-favor', async (req, res) => {
//     const { isComplete, isDoing, isRefused, docId } = req.body;

//     if(isComplete) {
//         try {
//             await FavorModel.findOneAndUpdate({ _id: docId }, { isComplete: true, isRequested: false, isRefused: false, isDoing: false });
//             return res.send({ message: responseMessage.recieved });
//         } catch (error) {
//             return res.send({ message: responseMessage.serverError });
//         }
//     }

//     if(isDoing) {
//         try {
//             await FavorModel.findOneAndUpdate({ _id: docId }, { isDoing: true, isRequested: false, isRefused: false, isComplete: false });
//             return res.send({ message: responseMessage.recieved });
//         } catch (error) {
//             console.log(error)
//             return res.send({ message: responseMessage.serverError });
//         }
//     }

//     if(isRefused) {
//         try {
//             await FavorModel.findOneAndUpdate({ _id: docId }, { isRefused: true, isRequested: false, isDoing: false, isComplete: false });
//             return res.send({ message: responseMessage.recieved });
//         } catch (error) {
//             return res.send({ message: responseMessage.serverError });
//         }
//     }
// });

// app.get('/get-favors', async (req, res) => {
//     try {
//         const favorsDataPending = await FavorModel.find({ isRequested: true });
//         const favorsDataCompleted = await FavorModel.find({ isComplete: true });
//         const favorsDataRefused = await FavorModel.find({ isRefused: true });
//         const favorDataAccepted = await FavorModel.find({ isDoing: true });
//         res.send({ favorsData : {
//             favorDataAccepted,
//             favorsDataCompleted,
//             favorsDataPending,
//             favorsDataRefused
//         }});
//         console.log(favorsDataCompleted)
//     } catch (error) {
//         res.status(500).send({ message: responseMessage.serverError });
//     }
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
