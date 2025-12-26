import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.MOCK_API_PORT ? parseInt(process.env.MOCK_API_PORT, 10) : 8787;

// Enable CORS for local development
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'OPTIONS']
}));

// Disable caching for all JSON responses
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-Control', 'no-store');
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ ok: true });
});

import { dronesRouter } from './routes/drones';
app.use('/v1/drones', dronesRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Mock API server running at http://localhost:${PORT}`);
});
