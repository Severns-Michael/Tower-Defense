import Phaser from 'phaser';

export function populateLayer(
    layersData: any[],
    targetName: string,
    tilemapLayer: Phaser.Tilemaps.TilemapLayer,
    mapWidth: number
) {
    const layerData = layersData.find(layer => layer.name === targetName);

    if (!layerData) {
        console.warn(`Layer ${targetName} not found in map data`);
        return;
    }

    layerData.data.forEach((tileIndex: number, i: number) => {
        const x = i % mapWidth;
        const y = Math.floor(i / mapWidth);

        if (tileIndex !== -1) {
            tilemapLayer.putTileAt(tileIndex, x, y);
        }
    });

    tilemapLayer.setDepth(0);
}