import Phaser from 'phaser';

type PathTile = { x: number; y: number };

export function generateOrderedPath(pathTiles: PathTile[]): PathTile[] {
    if (pathTiles.length === 0) return [];

    const tileSet = new Set(pathTiles.map(t => `${t.x},${t.y}`));

    let start = pathTiles[0];
    for (const tile of pathTiles) {
        if (tile.y < start.y || (tile.y === start.y && tile.x < start.x)) {
            start = tile;
        }
    }

    const ordered: PathTile[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ];

    let current = start;

    while (true) {
        let foundNext = false;

        for (const dir of directions) {
            const nextX = current.x + dir.x;
            const nextY = current.y + dir.y;
            const key = `${nextX},${nextY}`;

            if (tileSet.has(key) && !visited.has(key)) {
                const nextTile = { x: nextX, y: nextY };
                ordered.push(nextTile);
                visited.add(key);
                current = nextTile;
                foundNext = true;
                break;
            }
        }

        if (!foundNext) {
            break;
        }
    }

    return ordered;
}

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

    const rawTiles: PathTile[] = [];

    pathLayerData.forEach((tileIndex, i) => {
        const gridX = (i % mapWidth);
        const gridY = Math.floor(i / mapWidth);

        if (tileIndex !== -1) {
            rawTiles.push({ x: gridX, y: gridY });
        }
    });

    const orderedTiles = generateOrderedPath(rawTiles);

// Convert orderedTiles to Vector2 positions
    path = orderedTiles.map(tile => new Phaser.Math.Vector2(
        tile.x * tileSize * tileScale + tileSize / 2,
        tile.y * tileSize * tileScale + tileSize / 2
    ));

    if (!path[0]?.equals(spawnPoint)) path.unshift(spawnPoint);
    if (!path[path.length - 1]?.equals(endPoint)) path.push(endPoint);

    return path;
}

// export function drawPath(scene: Phaser.Scene, path: Phaser.Math.Vector2[]) {
//     const graphics = scene.add.graphics();
//     graphics.lineStyle(2, 0xff0000, 1);
//     graphics.setDepth(15);
//
//     path.forEach((point, index) => {
//         if (index === 0) {
//             graphics.moveTo(point.x, point.y);
//         } else {
//             graphics.lineTo(point.x, point.y);
//         }
//     });
//
//     graphics.strokePath();
// }