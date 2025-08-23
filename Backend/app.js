import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

import authRoutes from "./routes/AuthRoute.js";
import productRoutes from "./routes/ProductsRoutes.js";
import negotiationRoutes from "./routes/NegotiationRoute.js";

import errorMiddleware from "./middlewares/errorHandler.js";

export const app = express();

app.use(compression());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/negotiation", negotiationRoutes);

// Error handler
app.use(errorMiddleware);
