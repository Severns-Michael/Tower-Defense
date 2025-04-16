import React from "react";
import { Enemy } from "../types";

interface EnemyProps {
    enemy: Enemy;
}

const EnemyComponent: React.FC<EnemyProps> = ({ enemy }) => {
    const { row, col, alive } = enemy;

    if (!alive) return null;

    return (
        <div
            className="enemy"
            style={{
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
            }}
        >
            👾
        </div>
    );
};

export default EnemyComponent;