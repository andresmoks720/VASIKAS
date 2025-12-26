import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { dronesRouter } from './drones';

const app = express();
app.use('/v1/drones', dronesRouter);

describe('GET /v1/drones', () => {
    it('returns 400 if center is missing', async () => {
        const res = await request(app).get('/v1/drones');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Missing required query parameter: center/);
    });

    it('returns 400 if center is invalid', async () => {
        const res = await request(app).get('/v1/drones?center=invalid,format');
        expect(res.status).toBe(400);
    });

    it('returns 400 if lat/lon are out of bounds', async () => {
        const res = await request(app).get('/v1/drones?center=91,0');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid center coordinates/);
    });

    it('returns 200 and correct structure for valid request', async () => {
        const res = await request(app).get('/v1/drones?center=58.0,25.0&n=2');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('server_time_utc');
        expect(res.body).toHaveProperty('t_sec_used');
        expect(res.body.center).toEqual({ lat: 58.0, lon: 25.0 });
        expect(res.body.meta).toMatchObject({
            model: "circle-v1",
            n: 2
        });
        expect(res.body.drones).toHaveLength(2);
    });

    it('clamps parameters', async () => {
        const res = await request(app).get('/v1/drones?center=58,25&radius_m=99999&n=999');
        expect(res.status).toBe(200);
        expect(res.body.meta.radius_m).toBe(20000); // Clamped max
        expect(res.body.meta.n).toBe(100); // Clamped max
    });
});
