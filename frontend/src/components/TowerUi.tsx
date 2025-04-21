// Define the Tower type
import {useState} from "react";

export interface TowerType {
    name: string;
    type: string; // You can make this more specific, like 'fire' | 'ice' | etc., if you want.
}

interface TowerSelectorProps {
    onTowerSelect: (tower: TowerType) => void;
}

const TowerSelector: React.FC<TowerSelectorProps> = ({ onTowerSelect }) => {
    const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);

    const towerTypes: TowerType[] = [
        { name: 'Fire', type: 'fire' },
    ];

    const handleTowerClick = (tower: TowerType) => {
        setSelectedTower(tower);
        onTowerSelect(tower);  // This should ensure the tower is selected properly

        // Dispatch event to Phaser
        window.dispatchEvent(new CustomEvent<TowerType>('tower-selected', {
            detail: tower
        }));
    };

    return (
        <div className="tower-selector">
            <h3>Select a Tower</h3>
            <div className="tower-buttons">
                {towerTypes.map((tower) => (
                    <button
                        key={tower.type}
                        onClick={() => handleTowerClick(tower)}
                        className={selectedTower === tower ? 'selected' : ''}
                    >
                        {tower.name}
                    </button>
                ))}
            </div>
        </div>
    );
};