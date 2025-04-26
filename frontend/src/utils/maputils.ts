// mapUtils.ts

// Helper function to transform a 1D array into a 2D array
export function transformTo2DArray(data: number[], mapWidth: number, mapHeight: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < mapHeight; i++) {
        const row = data.slice(i * mapWidth, (i + 1) * mapWidth);
        result.push(row);
    }
    return result;
}

// Function to convert a 2D array into Tiled JSON format
export function convertToTiledJSON(layers: Record<string, number[][]>, mapWidth: number, mapHeight: number, spawnPoints: { x: number, y: number }[], endPoints: { x: number, y: number }[]) {
    // Create an array for all layers
    const mapLayers = Object.keys(layers).map(layerName => {
        const layerData = layers[layerName];

        // Flatten the 2D array into a 1D array for Tiled compatibility
        const flattenedData = layerData.reduce((acc, row) => acc.concat(row), []);

        // Prepare the map layer with flattened data
        return {
            type: "tilelayer",
            name: layerName,
            width: mapWidth,
            height: mapHeight,
            x: 0,
            y: 0,
            visible: true,
            opacity: 1,
            data: flattenedData,  // Pass the flattened data
        };
    });

    return {
        version: "1.0",
        tiledversion: "1.4.3",
        orientation: "orthogonal",
        renderorder: "right-down",
        width: mapWidth,
        height: mapHeight,
        tilewidth: 32,
        tileheight: 32,
        infinite: false,
        tilesets: [
            {
                firstgid: 1,
                source: "tileset.json",
            },
        ],
        layers: mapLayers,  // Add all layers here
        spawnPoints: spawnPoints || [],  // Ensure spawnPoints is an array or empty array
        endPoints: endPoints || []  // Ensure endPoints is an array or empty array
    };
}

// Function to download the map as a JSON file
export function downloadMapJSON(layers: Record<string, number[][]>, mapWidth: number, mapHeight: number, spawnPoints: { x: number, y: number }[], endPoints: { x: number, y: number }[]) {
    // Call the function to generate Tiled JSON from layers
    const json = convertToTiledJSON(layers, mapWidth, mapHeight, spawnPoints, endPoints);

    // Create the JSON file blob and initiate the download
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "custom_map.json";
    a.click();

    URL.revokeObjectURL(url);
}