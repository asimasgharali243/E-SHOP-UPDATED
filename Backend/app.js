import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoute.js';
import ProductRouter from './routes/ProductsRoutes.js'
import cors from 'cors';

export const app = express();


app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true,              // Allow cookies to be sent
}))

app.use(express.json());
app.use(cookieParser());
app.use('/',authRoutes);
app.use('/',ProductRouter);