import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';

const app = express();

dotenv.config
const PORT = process.env.PORT || 5001;

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.VITE_FRONTEND_URL}`,
    credentials: true,
}))


app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
    connectDB();
})