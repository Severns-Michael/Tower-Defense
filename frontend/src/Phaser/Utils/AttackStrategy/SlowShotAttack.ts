import { AttackStrategy } from './AttackStrategy';
import { Projectile } from '../../Objects/Projectile';
import { Tower } from '../../Objects/Tower';
import { Enemy } from '../../Objects/Enemy';

export class SlowShotAttack implements AttackStrategy {
    execute(tower: Tower, target: Enemy, time: number): void {
        tower.rotation = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
        tower.lastShotTime = time;

        new Projectile(tower.scene, tower.x, tower.y, target, tower.stats.damage, tower.stats.specialAbility, (tower.scene as any).enemies);

        // Apply a slow effect when the projectile hits (later in Projectile or Enemy)
        // For now, it's just flagged for special handling (like Freeze)
    }
}