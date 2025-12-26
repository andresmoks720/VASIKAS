# Mock API Server

This project includes an optional standalone Mock API server located in `tools/mock-api`. It is a development tool intended to simulate backend responses without needing a full production environment.

## Overview
- **Path**: `tools/mock-api`
- **Port**: `8787` (default). Configurable via `MOCK_API_PORT` environment variable.
- **Tech Stack**: Express, TypeScript (running via `tsx`).

## Running the Server

### Standalone
To run only the mock API:
```bash
npm run dev:mock-api
```

### With Frontend
To run both the Vite development server and the mock API concurrently:
```bash
npm run dev:all
```

## Frontend Configuration

To configure the frontend to use this mock API for drone data, set the following environment variables (e.g., in `.env`):

```bash
# Enable snapshot mode (polls the mock server instead of playing back static track files)
VITE_DRONES_MODE=snapshot

# Point to the local mock server
VITE_DRONE_URL=http://localhost:8787/v1/drones

# Optional: Override simulation parameters (these are auto-appended to the URL)
VITE_DRONES_CENTER_LAT=58.5953
VITE_DRONES_CENTER_LON=25.0136
VITE_DRONES_RADIUS_M=5000
VITE_DRONES_N=5
VITE_DRONES_PERIOD_S=60
```


### `GET /v1/drones`

Simulates drone telemetry based on a deterministic circular motion model.

**Query Parameters:**

| Parameter  | Type   | Required | Default | Clamped Range | Description                                           |
|------------|--------|----------|---------|---------------|-------------------------------------------------------|
| `center`   | string | **Yes**  | -       | -             | Center point as "lat,lon" (e.g., `58.5953,25.0136`).  |
| `radius_m` | number | No       | `2000`  | `[1, 20000]`  | Radius of the flight circle in meters.                |
| `n`        | number | No       | `1`     | `[1, 100]`    | Number of drones to simulate.                         |
| `period_s` | number | No       | `60`    | `[10, 3600]`  | Time in seconds to complete one full loop.            |

**Example Request:**
```bash
curl "http://localhost:8787/v1/drones?center=58.5953,25.0136&radius_m=5000&n=5"
```

**Response Format:**
```json
{
  "server_time_utc": "2025-12-26T12:00:00.000Z",
  "t_sec_used": 1700000000,
  "center": { "lat": 58.5953, "lon": 25.0136 },
  "meta": {
    "model": "circle-v1",
    "poll_hint_ms": 1000,
    "radius_m": 5000,
    "period_s": 60,
    "n": 5
  },
  "drones": [
    {
      "id": "drone-0",
      "label": "Drone 0",
      "position": { "lon": 25.0136..., "lat": 58.5953... },
      "headingDeg": 90,
      "speedMps": 15.5,
      "altitude": { "meters": 120, "ref": "AGL", "source": "mock" },
      "eventTimeUtc": "..."
    }
  ]
}
```

## Simulation Model
The server uses a **stateless, deterministic** model. 
- **Time**: Drones positions are calculated based on absolute server time, quantized to 1 second (`tSecUsed = floor(Date.now()/1000)`).
- **Motion**: Circular path around the provided `center`.
- **Heading**: Tangent to the circle ("always moving forward").
- **Speed**: Constant speed derived from radius and period: $v = \frac{2\pi R}{T}$.
- **Consistency**: Repeated calls within the same second return the exact same position.
