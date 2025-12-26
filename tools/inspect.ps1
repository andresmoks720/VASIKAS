$response = Invoke-RestMethod -Uri 'https://aim.eans.ee/web/notampib/area24.json'
Write-Host "ROOT KEYS:"
$response.PSObject.Properties.Name
Write-Host "---"

if ($response.dynamicData) {
    Write-Host "Checking dynamicData keys:"
    $dy = $response.dynamicData
    $dy.PSObject.Properties.Name
    foreach ($key in @("items", "notams", "data", "briefingItems", "messages", "rows", "features", "notamList")) {
        if ($dy.$key) {
            Write-Host "FOUND LIST KEY (in dynamicData): $key"
            $list = $dy.$key
            if ($list -is [System.Collections.IEnumerable]) {
                Write-Host "Count: $($list.Count)"
                $list | Select-Object -First 5 | ForEach-Object {
                    Write-Host "--- ITEM ---"
                    $_.PSObject.Properties.Name
                    if ($_.qualifiers) {
                        Write-Host "Qualifiers:"
                        $_ | Select-Object -ExpandProperty qualifiers
                    }
                    if ($_.locations) {
                        Write-Host "Locations: $($_.locations)"
                    }
                }
            }
        }
    }
}
