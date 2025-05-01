import React from 'react';
import { TowerData } from '../Phaser/Utils/TowerData';
import { TowerType } from '../types/Tower';

type PathName = 'TopPath' | 'MiddlePath' | 'LowerPath';

interface UpgradePanelProps {
    tower: {
        type: TowerType;
        pathLevels: { [key in PathName]: number };
    };
    onUpgradePathClick: (path: PathName) => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ tower, onUpgradePathClick }) => {
    const towerStats = TowerData[tower.type];
    const { pathLevels } = tower;

    const upgradedPaths = Object.values(pathLevels).filter(lvl => lvl >= 0).length;
    const hasT3 = Object.values(pathLevels).includes(2);

    return (
        <div className="upgrade-panel">
            <h3>{tower.type.toUpperCase()} Tower Upgrades</h3>

            {(['TopPath', 'MiddlePath', 'LowerPath'] as const).map((path) => {
                const pathLevel = pathLevels[path];
                const upgrades = towerStats[path];

                return (
                    <div key={path} style={{ marginBottom: '10px' }}>
                        <strong>{path}</strong>
                        {Object.entries(upgrades).map(([levelStr, upgrade]) => {
                            const level = parseInt(levelStr);
                            const isApplied = pathLevel === level;
                            const canUpgrade = level === pathLevel + 1;

                            // LOCK LOGIC:
                            const isLocked =
                                // Third path completely locked if other two are used
                                (upgradedPaths >= 2 && pathLevel === -1) ||
                                // No second T3
                                (level === 2 && hasT3 && pathLevel !== 2);

                            return (
                                <div key={level} style={{ marginLeft: '10px' }}>
                                    <p>
                                        T{level + 1}: {upgrade.specialAbility} — Damage: {upgrade.damage}, Range: {upgrade.range}, RoF: {upgrade.rateOfFire}
                                    </p>
                                    {isApplied ? (
                                        <button disabled>Already Applied</button>
                                    ) : isLocked ? (
                                        <span style={{ color: 'gray' }}>🔒 Locked</span>
                                    ) : canUpgrade ? (
                                        <button onClick={() => onUpgradePathClick(path)}>Upgrade</button>
                                    ) : (
                                        <button disabled>Unavailable</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default UpgradePanel;