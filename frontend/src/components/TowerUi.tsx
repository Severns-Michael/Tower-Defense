import React from 'react';

const TowerSelector = () => {
    const towerTypes = ['fire', 'ice', 'physical', 'lightning'];

    const placeTower = (type: string) => {
        // Send event to Phaser
        window.dispatchEvent(new CustomEvent('place-tower', {
            detail: { x: 400, y: 300, type } // placeholder position
        }));
    };

    return (
        <div>
            <h3>Select Tower</h3>
            {towerTypes.map(type => (
                <button key={type} onClick={() => placeTower(type)}>
                    {type.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default TowerSelector;