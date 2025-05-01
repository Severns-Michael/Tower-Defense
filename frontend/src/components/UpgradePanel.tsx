import React from 'react';
import { Tower } from '../Phaser/Objects/Tower';
import { SpecialAbilityDescriptions } from '../Phaser/Utils/AbilityDescriptions';
import { TowerData } from '../Phaser/Utils/TowerData';

type PathName = 'TopPath' | 'MiddlePath' | 'LowerPath';

interface UpgradePanelProps {
    tower: Tower;
    onClose: () => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ tower, onClose }) => {
    const towerStats = TowerData[tower.type];
    const { pathLevels } = tower;
    const [, forceUpdate] = React.useState(0);

    const upgradedPaths = Object.values(pathLevels).filter(lvl => lvl >= 0).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: '#00ffff' }}>
                Special Ability: {Object.values(pathLevels).some(v => v >= 0)
                ? SpecialAbilityDescriptions[TowerData[tower.type][Object.keys(pathLevels).find(p => pathLevels[p as PathName] >= 0)! as PathName][pathLevels[Object.keys(pathLevels).find(p => pathLevels[p as PathName] >= 0)! as PathName]].specialAbility ?? ''] ?? 'None'
                : 'None'}
            </p>

            {(['TopPath', 'MiddlePath', 'LowerPath'] as const).map((path) => {
                const pathLevel = pathLevels[path];
                const upgrades = towerStats[path];
                const nextUpgrade = upgrades[pathLevel + 1];
                const nextAbility = nextUpgrade?.specialAbility ?? null;
                const hasT3 = Object.values(pathLevels).includes(2);
                const isTryingToUpgradeToT3 = pathLevel + 1 === 2;

                const isMaxed = !nextAbility;
                const isLocked = isMaxed || (upgradedPaths >= 2 && pathLevel === -1) || (hasT3 && isTryingToUpgradeToT3);

                return (
                    <div key={path}>
                        <strong style={{ color: '#00ffff' }}>{path}</strong>
                        <p>Level: {pathLevel >= 0 ? `T${pathLevel + 1}` : 'Not Upgraded'}</p>

                        {isMaxed ? (
                            <span style={{ color: 'gray' }}>✅ Maxed</span>
                        ) : isLocked ? (
                            <span style={{ color: 'gray' }}>🔒 Locked</span>
                        ) : (
                            <button
                                onClick={() => {
                                    tower.upgradePath(path);
                                    forceUpdate(prev => prev + 1);
                                }}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#00ffff',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Upgrade to: {SpecialAbilityDescriptions[nextAbility] ?? nextAbility}
                            </button>
                        )}
                    </div>
                );
            })}

            <button
                onClick={onClose}
                style={{
                    padding: '8px',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
            >
                Close
            </button>
        </div>
    );
};

export default UpgradePanel;