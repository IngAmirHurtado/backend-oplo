import express from "express";

import {app, } from "./lib/socket.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRotes from "./routes/message.routes.js";

app.use(express.json({ limit: '5mb' })); // Aumenta el límite de tamaño a 5 MB
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin: "https://oplo.amirhurtado.com",
  credentials: true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRotes);

export default app;
