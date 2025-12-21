# Interactive Map Features

The application now includes interactive map controls within the **Object Details** view for Airplanes and Drones.

## Features

### 1. Center on Map
- **Location**: Next to the "Last update" field in the details panel.
- **Function**: Clicking the **Center** button instantly pans the map to the object's current position and ensures an appropriate zoom level (minimum zoom level of 14).

### 2. Keep in Focus
- **Location**: Checkbox at the bottom of the details panel.
- **Function**: When enabled, the map will automatically re-center on the object every time its position is updated. This is useful for following high-speed aircraft or drones in real-time.
- **Note**: Manual panning is still possible, but the next position update will snap the focus back to the object.

### 3. Track (Trajectory)
- **Location**: Checkbox at the bottom of the details panel.
- **Function**: Toggles the visibility of the object's flight path on the map.
    - **Airplanes**: Displays the actual historical flight path (orange line).
    - **Drones**: Displays a placeholder dashed green line (full trajectory implementation for drones is planned for future phases).

## Implementation Details

- **Map API**: Orchestrated via the `mapApi` singleton, which handles events like `center-on-entity`, `set-focus`, and `set-track-visibility`.
- **Map View**: `MapView.tsx` manages the focus state and track visibility sets. Auto-centering is reactive to changes in data streams (ADS-B and Drones).
