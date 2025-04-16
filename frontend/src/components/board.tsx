import React, { useEffect, useState, useCallback } from "react";
import { Tower, createTower } from "../types";
import { towerStats } from "../types";
import { TowerType } from "../types/towerConfig";

interface Enemy {
    id: number;
    positionIndex: number;
    health: number;
    position: { row: number; col: number };  // This needs to be correctly defined
}

const path: { row: number; col: number }[] = [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 },
    { row: 4, col: 4 },
    { row: 5, col: 5 },
    { row: 6, col: 6 },
    { row: 7, col: 7 },
    { row: 8, col: 8 },
    { row: 9, col: 9 },
];

const Board: React.FC = () => {
    const [playerHealth, setPlayerHealth] = useState(100);
    const [round, setRound] = useState(1);
    const [enemiesLeft, setEnemiesLeft] = useState(0);
    const [towers, setTowers] = useState<Tower[]>([]);
    const [selectedTowerType, setSelectedTowerType] = useState<TowerType>("basic");
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [projectiles, setProjectiles] = useState<any[]>([]);

    const [roundActive, setRoundActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const towerRange = 100;
    const towerFireRate = 10000;

    const rounds = [
        { enemyCount: 5, spawnRate: 500 },
        { enemyCount: 8, spawnRate: 400 },
        { enemyCount: 12, spawnRate: 300 },
    ];

    const [currentRound, setCurrentRound] = useState(0);
    const [enemiesSpawned, setEnemiesSpawned] = useState(0);

    // Memoized function to spawn enemies
    const spawnEnemies = useCallback(() => {
        setEnemies((prev) => [
            ...prev,
            { id: Date.now(), positionIndex: 0, health: 10, position: { row: 0, col: 0 } },
        ]);
    }, []); // No dependencies, since it doesn't depend on anything outside

    // Move enemies along the path
    useEffect(() => {
        const moveInterval = setInterval(() => {
            setEnemies((prevEnemies) =>
                prevEnemies.map((enemy) => {
                    if (enemy.positionIndex < path.length - 1 && enemy.health > 0) {
                        const nextPosition = path[enemy.positionIndex + 1];
                        console.log("Moving enemy:", enemy.id, "to", nextPosition); // Log position
                        return {
                            ...enemy,
                            positionIndex: enemy.positionIndex + 1,
                            position: nextPosition,
                        };
                    }
                    return enemy;
                })
            );
        }, 1000);

        return () => clearInterval(moveInterval);
    }, []);

    const findTarget = useCallback((tower: Tower): Enemy | null => {
        let nearestEnemy: Enemy | null = null;  // Explicitly type nearestEnemy as Enemy | null
        let shortestDistance = towerRange;
        console.log(`Checking targets for tower at (${tower.row}, ${tower.col})`);

        // Loop through enemies and find the closest one within range
        for (const enemy of enemies) {
            // Calculate the Manhattan distance between the tower and the enemy
            const distance = Math.abs(tower.row - enemy.position.row) + Math.abs(tower.col - enemy.position.col);

            // If the enemy is within range and closer than the current closest, select it
            if (distance <= towerRange && distance < shortestDistance) {
                nearestEnemy = enemy;
                shortestDistance = distance;
            }
        }

        // Check if we found a target and log it
        if (nearestEnemy !== null) {
            console.log(`Tower at (${tower.row}, ${tower.col}) found target at (${nearestEnemy.position.row}, ${nearestEnemy.position.col})`);
        } else {
            console.log(`Tower at (${tower.row}, ${tower.col}) found no target`);
        }

        return nearestEnemy;
    }, [enemies]);
    // Fire projectile at the target
    const fireProjectile = useCallback((tower: Tower, target: Enemy) => {
        const projectile = {
            id: Date.now(),
            towerId: tower.id,
            targetId: target.id,
            currentPos: { row: tower.row, col: tower.col },
            targetPos: target.position,
            damage: 10,
        };
        console.log(`Tower at (${tower.row}, ${tower.col}) firing at enemy at (${target.position.row}, ${target.position.col})`);

        setProjectiles((prev) => [...prev, projectile]); // Add the new projectile to the state

        moveProjectileInterval(projectile); // Start moving the projectile
    }, []);

    // Move the projectile towards the target
    const moveProjectileInterval = (projectile: any) => {
        const projectileMoveInterval = setInterval(() => {
            setProjectiles((prevProjectiles) =>
                prevProjectiles.map((proj) => {
                    if (proj.id === projectile.id) {
                        // Move the projectile towards the target
                        const nextRow = proj.currentPos.row < proj.targetPos.row ? proj.currentPos.row + 1 : proj.currentPos.row;
                        const nextCol = proj.currentPos.col < proj.targetPos.col ? proj.currentPos.col + 1 : proj.currentPos.col;

                        if (nextRow === proj.targetPos.row && nextCol === proj.targetPos.col) {
                            console.log(`Projectile hit target at (${proj.targetPos.row}, ${proj.targetPos.col})`);
                            clearInterval(projectileMoveInterval); // Stop moving if target is reached
                        }

                        console.log(`Projectile moving: (${proj.currentPos.row}, ${proj.currentPos.col}) -> (${nextRow}, ${nextCol})`);

                        return {
                            ...proj,
                            currentPos: { row: nextRow, col: nextCol },
                        };
                    }
                    return proj;
                })
            );
        }, 60); // Move projectile every 500ms
    };

    // Handle towers shooting at enemies
    useEffect(() => {
        const towerShootingIntervals = towers.map((tower) => {
            return setInterval(() => {
                const target = findTarget(tower);
                if (target) {
                    fireProjectile(tower, target); // Fire when target is found
                }
            }, towerFireRate);
        });

        return () => {
            towerShootingIntervals.forEach((interval) => clearInterval(interval));
        };
    }, [towers, findTarget, fireProjectile]);



    // Check if a tile is a path, start, or end tile
    const isPathTile = (row: number, col: number) => path.some(p => p.row === row && p.col === col);
    const isStartTile = (row: number, col: number) => row === path[0].row && col === path[0].col;
    const isEndTile = (row: number, col: number) => row === path[path.length - 1].row && col === path[path.length - 1].col;

    // Handle placing towers
    const handlePlaceTower = (row: number, col: number, type: TowerType) => {
        if (isPathTile(row, col)) {
            alert("Can't place a tower on the path!");
            return;
        }

        const alreadyPlaced = towers.some(t => t.row === row && t.col === col);
        if (alreadyPlaced) return;

        const newTower = createTower(Date.now(), type, row, col);
        setTowers((prevTowers) => [...prevTowers, newTower]);
        console.log("tower placed Row"+row,"col"+ col, type);
    };

    // Handle tower type selection
    const handleTowerSelection = (type: TowerType) => setSelectedTowerType(type);

    // Round handling and enemy spawning
    useEffect(() => {
        if (roundActive && currentRound < rounds.length) {
            const round = rounds[currentRound];

            const spawnInterval = setInterval(() => {
                if (enemiesSpawned >= round.enemyCount) {
                    clearInterval(spawnInterval);
                    return;
                }
                spawnEnemies();
                setEnemiesSpawned((prev) => prev + 1);
            }, round.spawnRate);

            return () => clearInterval(spawnInterval);
        }
    }, [roundActive, currentRound, enemiesSpawned, spawnEnemies]);

    // Handle game logic for enemy movement and health
    useEffect(() => {
        const aliveEnemies = enemies.filter((enemy) => enemy.positionIndex < path.length - 1);
        setEnemiesLeft(aliveEnemies.length);

        if (aliveEnemies.length === 0 && enemiesSpawned >= rounds[currentRound].enemyCount) {
            setRoundActive(false);
            setCurrentRound((prev) => prev + 1);
            setEnemiesSpawned(0);
        }

        enemies.forEach((enemy) => {
            if (enemy.positionIndex === path.length - 1) {
                setPlayerHealth((prevHealth) => prevHealth - 10);
                setEnemies((prevEnemies) => prevEnemies.filter((e) => e.id !== enemy.id));
            }
        });

        if (playerHealth <= 0) {
            setGameOver(true);
            resetGame();
        }
    }, [enemies, enemiesSpawned, playerHealth, currentRound]);

    // Reset game function
    const resetGame = () => {
        setPlayerHealth(100);
        setEnemies([]);
        setTowers([]);
        setRound(1);
        setCurrentRound(0);
        setEnemiesSpawned(0);
        setEnemiesLeft(0);
        setRoundActive(false);
        setGameOver(false);
    };

    return (
        <div>
            {gameOver && (
                <div className="game-over">
                    <h2>Game Over!</h2>
                    <button onClick={resetGame}>Restart Game</button>
                </div>
            )}

            <div>
                <button onClick={() => handleTowerSelection("basic")}>Basic Tower</button>
                <button onClick={() => handleTowerSelection("sniper")}>Sniper Tower</button>
                <button onClick={() => handleTowerSelection("slow")}>Slow Tower</button>
            </div>

            {!roundActive && currentRound < rounds.length && (
                <button onClick={() => {
                    setEnemies([]); // Clear current enemies
                    setEnemiesSpawned(0);
                    setRoundActive(true);
                }}>
                    Start Round {currentRound + 1}
                </button>
            )}

            <div>
                <h3>Player Health: {playerHealth}</h3>
                <h3>Enemies Left: {enemiesLeft}</h3>
                <h3>Round: {round}</h3>
            </div>
            <div className="board">
                {Array.from({ length: 10 }).map((_, row) => (
                    <div key={row} className="row">
                        {Array.from({ length: 10 }).map((_, col) => {
                            const tower = towers.find(t => t.row === row && t.col === col);
                            const enemyHere = enemies.find(
                                (enemy) =>
                                    path[enemy.positionIndex]?.row === row &&
                                    path[enemy.positionIndex]?.col === col
                            );
                            const projectileHere = projectiles.find(
                                (proj) => proj.currentPos.row === row && proj.currentPos.col === col
                            );

                            let className = "tile";
                            if (isStartTile(row, col)) className += " start";
                            else if (isEndTile(row, col)) className += " end";
                            else if (isPathTile(row, col)) className += " path";
                            if (tower) className += " tower";

                            return (
                                <div
                                    key={col}
                                    className={className}
                                    onClick={() => handlePlaceTower(row, col, selectedTowerType)}
                                >
                                    {tower && <span>{towerStats[tower.type].emoji}</span>}
                                    {enemyHere && <div className="enemy">👾</div>}
                                    {projectileHere && <div className="projectile">🚀</div>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;