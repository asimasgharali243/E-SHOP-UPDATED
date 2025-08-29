import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

import authRoutes from "./routes/AuthRoute.js";
import productRoutes from "./routes/ProductsRoutes.js";
import negotiationRoutes from "./routes/NegotiationRoute.js";
import CartRouter from "./routes/CartRout.js";
import errorMiddleware from "./middlewares/errorHandler.js";

export const app = express();

app.use(compression());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/cart", CartRouter);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/negotiation", negotiationRoutes);

// Error handler
app.use(errorMiddleware);
