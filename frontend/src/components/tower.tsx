import React from "react";
import { Tower } from "../types";
import { towerStats } from "../types/towerConfig";  // Import towerStats for tower data

interface TowerProps {
    tower: Tower;
}

const TowerComponent: React.FC<TowerProps> = ({ tower }) => {
    const { row, col, type } = tower;
    const towerStat = towerStats[type];  // Access tower stats based on type

    return (
        <div
            className="tower"
            style={{
                gridRowStart: row + 1,
                gridColumnStart: col + 1,
            }}
        >
            {towerStat.emoji} {/* Display the tower's emoji */}
        </div>
    );
};

export default TowerComponent;