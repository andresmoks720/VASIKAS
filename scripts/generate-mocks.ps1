$ErrorActionPreference = "Stop"

# --- Configuration ---
$SEED = 1337
$BASE_TIME = [DateTime]::Parse("2025-12-18T10:00:00Z").ToUniversalTime()
$DURATION_SEC = 120

# --- Helpers ---
function Get-SeededRandom {
    param($Seed)
    return New-Object Random($Seed)
}

$rng = Get-SeededRandom -Seed $SEED

function Ensure-Dir {
    param($Path)
    $parent = Split-Path -Parent $Path
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }
}

function Write-JsonFile {
    param($Path, $Data)
    Ensure-Dir $Path
    $json = $Data | ConvertTo-Json -Depth 10
    $json | Set-Content -Path $Path -Encoding UTF8
    Write-Host "Generated $Path"
}

function Write-NdjsonFile {
    param($Path, $Data)
    Ensure-Dir $Path
    $content = $Data | ForEach-Object { $_ | ConvertTo-Json -Depth 10 -Compress }
    $content -join "`n" | Set-Content -Path $Path -Encoding UTF8
    # Add trailing newline
    Add-Content -Path $Path -Value "" -NoNewline
    Write-Host "Generated $Path"
}

# --- Generators ---

# ... (Skipping static files as I already created them, but for completeness I could include them. 
# I will focus on the scenario files which are hard to write manually)

function Generate-ScenarioLinear1 {
    $scenarioId = "linear-1"
    $baseDir = "public/mock/scenarios/$scenarioId"
    
    # 3. Truth Data
    $droneStart = @{ lon = 24.7500; lat = 59.4300 }
    $droneEnd = @{ lon = 24.7600; lat = 59.4350 }
    $droneAlt = 80
    
    $aircraftStart = @{ lon = 24.8000; lat = 59.4100 }
    $aircraftEnd = @{ lon = 24.7000; lat = 59.4500 }
    $aircraftAlt = 3000

    $steps = $DURATION_SEC
    $droneCoords = @()
    $droneTimes = @()
    $droneAlts = @()
    
    $aircraftCoords = @()
    $aircraftTimes = @()
    $aircraftAlts = @()

    for ($i = 0; $i -le $steps; $i++) {
        $fraction = $i / $steps
        $t = $BASE_TIME.AddSeconds($i).ToString("yyyy-MM-ddTHH:mm:ssZ")
        
        # Drone
        $dLon = $droneStart.lon + ($droneEnd.lon - $droneStart.lon) * $fraction
        $dLat = $droneStart.lat + ($droneEnd.lat - $droneStart.lat) * $fraction
        $droneCoords += ,@($dLon, $dLat)
        $droneTimes += $t
        $droneAlts += $droneAlt + [Math]::Sin($i * 0.1) * 2

        # Aircraft
        $aLon = $aircraftStart.lon + ($aircraftEnd.lon - $aircraftStart.lon) * $fraction
        $aLat = $aircraftStart.lat + ($aircraftEnd.lat - $aircraftStart.lat) * $fraction
        $aircraftCoords += ,@($aLon, $aLat)
        $aircraftTimes += $t
        $aircraftAlts += $aircraftAlt
    }

    # truth.mfjson
    $truthMfjson = @{
        type = "FeatureCollection"
        features = @(
            @{
                type = "Feature"
                properties = @{
                    entityId = "drone-001"
                    entityKind = "drone"
                    datetimes = $droneTimes
                    altitudeM = $droneAlts
                    altitudeRef = "AGL"
                }
                geometry = @{
                    type = "LineString"
                    coordinates = $droneCoords
                }
            },
            @{
                type = "Feature"
                properties = @{
                    entityId = "flight-001"
                    entityKind = "aircraft"
                    datetimes = $aircraftTimes
                    altitudeM = $aircraftAlts
                    altitudeRef = "MSL"
                }
                geometry = @{
                    type = "LineString"
                    coordinates = $aircraftCoords
                }
            }
        )
    }
    Write-JsonFile -Path "$baseDir/truth.mfjson" -Data $truthMfjson

    # truth.gpx
    $gpxContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Antigravity">
  <trk>
    <name>drone-001</name>
    <trkseg>
"@
    for ($i = 0; $i -lt $droneCoords.Count; $i++) {
        $lat = $droneCoords[$i][1]
        $lon = $droneCoords[$i][0]
        $ele = $droneAlts[$i]
        $time = $droneTimes[$i]
        $gpxContent += @"
      <trkpt lat="$lat" lon="$lon">
        <ele>$ele</ele>
        <time>$time</time>
      </trkpt>
"@
    }
    $gpxContent += @"
    </trkseg>
  </trk>
</gpx>
"@
    Ensure-Dir "$baseDir/truth.gpx"
    $gpxContent | Set-Content -Path "$baseDir/truth.gpx" -Encoding UTF8
    Write-Host "Generated $baseDir/truth.gpx"

    # 4. observations.ndjson
    $observations = @()
    
    for ($i = 0; $i -lt $steps; $i++) {
        $t = $droneTimes[$i]
        
        # Drone Telemetry
        $dronePos = @{ lon = $droneCoords[$i][0]; lat = $droneCoords[$i][1] }
        
        # Velocity
        $nextLon = if ($i + 1 -lt $droneCoords.Count) { $droneCoords[$i+1][0] } else { $droneCoords[$i][0] }
        $nextLat = if ($i + 1 -lt $droneCoords.Count) { $droneCoords[$i+1][1] } else { $droneCoords[$i][1] }
        $dLon = $nextLon - $dronePos.lon
        $dLat = $nextLat - $dronePos.lat
        $heading = [Math]::Atan2($dLon, $dLat) * 180 / [Math]::PI
        $heading = ($heading + 360) % 360

        $observations += @{
            eventTimeUtc = $t
            ingestTimeUtc = $t
            sensorId = "sensor-425006"
            obsKind = "telemetry"
            entityId = "drone-001"
            position = $dronePos
            velocity = @{ speedMps = 12.4; headingDeg = $heading }
            altitude = @{ meters = $droneAlts[$i]; ref = "AGL"; source = "reported"; comment = "AeroScope mock" }
            confidence = 0.9
            raw = @{ vendor = "dji"; source = "aeroscope" }
        }

        # Radar Track Update
        $noiseLat = ($rng.NextDouble() - 0.5) * 0.0001
        $noiseLon = ($rng.NextDouble() - 0.5) * 0.0001
        
        $observations += @{
            eventTimeUtc = $t
            ingestTimeUtc = $t
            sensorId = "sensor-radar-1"
            trackId = "track-001"
            obsKind = "track_update"
            position = @{ lon = $dronePos.lon + $noiseLon; lat = $dronePos.lat + $noiseLat }
            altitude = @{ meters = $droneAlts[$i] + ($rng.NextDouble() - 0.5) * 5; ref = "AGL"; source = "detected"; comment = "Radar detected" }
            confidence = 0.7 + $rng.NextDouble() * 0.3
            raw = @{ rcs = 0.1 }
        }
    }
    
    Write-NdjsonFile -Path "$baseDir/observations.ndjson" -Data $observations
}

Generate-ScenarioLinear1
