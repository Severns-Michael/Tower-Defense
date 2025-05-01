import { AttackStrategy } from './AttackStrategy';
import { chainLightning } from '../SpecialEffects';
import { Tower } from '../../Objects/Tower';
import { Enemy } from '../../Objects/Enemy';

export class ChainLightningAttack implements AttackStrategy {
    execute(tower: Tower, target: Enemy, time: number): void {
        tower.rotation = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
        tower.lastShotTime = time;

        const scene = tower.scene as any; // temporarily allow 'any' typing
        const enemies = scene.enemyManager?.enemies || [];

        const params = tower.getSpecialParams();

        chainLightning(
            tower.scene,
            target,
            enemies,
            tower.stats.damage,
            params.chainRange ?? 600,
            params.chains ?? 3
        );
    }
}