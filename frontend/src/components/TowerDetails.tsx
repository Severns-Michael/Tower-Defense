import React, { useEffect } from 'react';
import EventBus from '../Phaser/Utils/EventBus';

const TowerStats: React.FC = () => {
  useEffect(() => {
    const onTowerUpgraded = (data: { towerId: string; newLevel: number }) => {
      console.log(`${data.towerId} is now level ${data.newLevel}`);
      // Optional: Update local state or trigger animation
    };

    EventBus.on('tower-upgraded', onTowerUpgraded);

    return () => {
      EventBus.off('tower-upgraded', onTowerUpgraded);
    };
  }, []);

  return (
    <div className="tower-stats">
      {/* Stats go here */}
    </div>
  );
};

export default TowerStats;