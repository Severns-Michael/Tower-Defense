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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {towerList.map((towerType) => {
                const towerInfo = BaseTowers[towerType];
                const isSelected = selectedTower === towerType;

                return (
                    <button
                        key={towerType}
                        onClick={() => handleTowerClick(towerType)}
                        style={{
                            width: '100px',
                            height: '80px',
                            backgroundColor: isSelected ? '#00ffff' : '#222',
                            color: isSelected ? '#000' : '#fff',
                            border: isSelected ? '2px solid #00ffff' : '1px solid #555',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            fontSize: '12px',
                            padding: '5px'
                        }}
                    >
                        {towerInfo.name}
                    </button>
                );
            })}
        </div>
    );
};

export default TowerSelector;