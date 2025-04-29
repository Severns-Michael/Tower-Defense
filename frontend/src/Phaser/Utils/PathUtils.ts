import Phaser from 'phaser';

export function extractPathFromLayer(
    pathLayerData: number[],
    mapWidth: number,
    tileSize: number,
    tileScale: number,
    spawnPoints: { x: number, y: number }[],
    endPoints: { x: number, y: number }[]
): Phaser.Math.Vector2[] {
    let path: Phaser.Math.Vector2[] = [];

    let spawnPoint = spawnPoints.length > 0
        ? new Phaser.Math.Vector2(
            spawnPoints[0].x * tileSize * tileScale + tileSize / 2,
            spawnPoints[0].y * tileSize * tileScale + tileSize / 2
        )
        : new Phaser.Math.Vector2(0, 0);

    let endPoint = endPoints.length > 0
        ? new Phaser.Math.Vector2(
            endPoints[0].x * tileSize * tileScale + tileSize / 2,
            endPoints[0].y * tileSize * tileScale + tileSize / 2
        )
        : new Phaser.Math.Vector2(0, 0);

    pathLayerData.forEach((tileIndex, i) => {
        const x = (i % mapWidth) * tileSize * tileScale + tileSize / 2;
        const y = Math.floor(i / mapWidth) * tileSize * tileScale + tileSize / 2;

        if (!spawnPoint.equals(new Phaser.Math.Vector2(x, y)) && !endPoint.equals(new Phaser.Math.Vector2(x, y))) {
            if (tileIndex !== -1) {
                path.push(new Phaser.Math.Vector2(x, y));
            }
        }
    });

    if (!path[0]?.equals(spawnPoint)) path.unshift(spawnPoint);
    if (!path[path.length - 1]?.equals(endPoint)) path.push(endPoint);

    return path;
}

export function drawPath(scene: Phaser.Scene, path: Phaser.Math.Vector2[]) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1);
    graphics.setDepth(15);

    path.forEach((point, index) => {
        if (index === 0) {
            graphics.moveTo(point.x, point.y);
        } else {
            graphics.lineTo(point.x, point.y);
        }
    });

    graphics.strokePath();
}