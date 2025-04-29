// src/Phaser/managers/TowerManager.ts
import { Tower } from "../Phaser/Objects/Tower";
import { TowerType } from "../types/Tower";
import { PlayerManager } from "./PlayerManager";
import Phaser from "phaser";


export class TowerManager {
    scene: Phaser.Scene;
    towers: Tower[] = [];
    playerManager: PlayerManager;
    tileSize: number;
    tileScale: number;
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    pathLayer: Phaser.Tilemaps.TilemapLayer;
    obstaclesLayer: Phaser.Tilemaps.TilemapLayer;

    constructor(
        scene: Phaser.Scene,
        playerManager: PlayerManager,
        groundLayer: Phaser.Tilemaps.TilemapLayer,
        pathLayer: Phaser.Tilemaps.TilemapLayer,
        obstaclesLayer: Phaser.Tilemaps.TilemapLayer,
        tileSize: number = 32,
        tileScale: number = 1
    ) {
        this.scene = scene;
        this.playerManager = playerManager;
        this.groundLayer = groundLayer;
        this.pathLayer = pathLayer;
        this.obstaclesLayer = obstaclesLayer;
        this.tileSize = tileSize;
        this.tileScale = tileScale;
    }

    canPlaceTowerHere(tileX: number, tileY: number): boolean {
        const groundTile = this.groundLayer.getTileAt(tileX, tileY);
        const pathTile = this.pathLayer.getTileAt(tileX, tileY);
        const obstacleTile = this.obstaclesLayer.getTileAt(tileX, tileY);

        if (!groundTile) {
            console.log('No ground tile here.');
            return false;
        }

        if (obstacleTile) {
            console.log('Obstacle blocking the tile.');
            return false;
        }

        if (pathTile) {
            console.log('Path is blocking the tile.');
            return false;
        }

        const tileSize = this.tileSize * this.tileScale;
        const existingTower = this.towers.find(tower => {
            return Math.floor(tower.x / tileSize) === tileX && Math.floor(tower.y / tileSize) === tileY;
        });

        if (existingTower) {
            console.log('Already a tower here.');
            return false;
        }

        return true;
    }

    placeTower(tileX: number, tileY: number, selectedTower: TowerType) {
        if (!this.canPlaceTowerHere(tileX, tileY)) {
            console.log("Can't place tower here!");
            return;
        }

        const towerCost = 100; // Hardcoded

        if (this.playerManager.spendMoney(towerCost)) {
            const size = this.tileSize * this.tileScale;
            const tower = new Tower(
                this.scene,
                tileX * size + size / 2,
                tileY * size + size / 2,
                selectedTower // only the type ('fire')
            );

            this.towers.push(tower);
        }
    }

    update(time: number, delta: number, enemies: any[]) {
        this.towers.forEach(tower => {
            tower.update(time, delta, enemies);
        });
    }
}