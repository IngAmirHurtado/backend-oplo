import {server} from './lib/socket.js';
import app from './app.js';
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js';

dotenv.config()
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    connectDB();
})