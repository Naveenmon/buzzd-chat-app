import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';

const app = express();

dotenv.config
const PORT = process.env.PORT || 5001;

app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(5001, () => {
    console.log(`Server is running on port ${PORT} `);
    connectDB();
})