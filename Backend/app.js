import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoute.js';
import ProductRouter from './routes/ProductsRoutes.js'
import cors from 'cors';
import compression from 'compression';
import errorMiddleware from './middlewares/errorHandler.js';
export const app = express();

app.use(compression());
app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true,              // Allow cookies to be sent
}))

app.use(express.json());
app.use(cookieParser());
app.use('/',authRoutes);
app.use('/',ProductRouter);

app.use(errorMiddleware);