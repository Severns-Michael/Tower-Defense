import React, { useState } from 'react';
import { BaseTowers } from '../Phaser/Utils/BaseTower';
import { TowerType } from '../types/Tower';

interface TowerSelectorProps {
    onTowerSelect: (tower: TowerType) => void;
}


const TowerSelector: React.FC<TowerSelectorProps> = ({ onTowerSelect }) => {
    const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);

    const towerList = Object.keys(BaseTowers) as TowerType[];

    const handleTowerClick = (towerType: TowerType) => {
        setSelectedTower(towerType);
        onTowerSelect(towerType);
        window.dispatchEvent(new CustomEvent<TowerType>('tower-selected', { detail: towerType }));
    };

    return (
        <div className="tower-selector">
            <h3>Select a Tower</h3>
            <div className="tower-buttons">
                {towerList.map((towerType) => (
                    <button
                        key={towerType}
                        onClick={() => handleTowerClick(towerType)}
                        className={selectedTower === towerType ? 'selected' : ''}
                        title={BaseTowers[towerType].description}
                    >
                        {BaseTowers[towerType].name}
                    </button>
                ))}
            </div>

        </div>
    );
};
export default TowerSelector;
