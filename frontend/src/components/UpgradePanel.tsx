import React from 'react';
import { TowerData } from '../Phaser/Utils/TowerData';
import {TowerType} from "../types/Tower";


interface UpgradePanelProps {
    tower: {
        type: TowerType;
        path: 'TopPath' | 'MiddlePath' | 'LowerPath';
        level: number;
    };
    onUpgradePathClick: (path: 'TopPath' | 'MiddlePath' | 'LowerPath') => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ tower, onUpgradePathClick }) => {
    const towerStats = TowerData[tower.type];

    return (
        <div className="upgrade-panel">
            <h3>{tower.type.toUpperCase()} Tower Upgrades</h3>
            {(['TopPath', 'MiddlePath', 'LowerPath'] as const).map((path) => {
                const currentLevel = path === tower.path ? tower.level : 0;
                const nextUpgrade = towerStats[path][currentLevel + 1];

                return (
                    <div key={path} style={{ marginBottom: '10px' }}>
                        <strong>{path}:</strong>{' '}
                        {nextUpgrade ? (
                            <>
                                <p>
                                    Damage: {nextUpgrade.damage}, Range: {nextUpgrade.range}, RoF: {nextUpgrade.rateOfFire}, Ability: {nextUpgrade.specialAbility}
                                </p>
                                <button onClick={() => onUpgradePathClick(path)}>Upgrade</button>
                            </>
                        ) : (
                            <p>Maxed</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default UpgradePanel;

