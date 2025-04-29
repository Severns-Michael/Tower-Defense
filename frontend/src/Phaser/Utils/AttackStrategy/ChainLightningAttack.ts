import { AttackStrategy } from './AttackStrategy';
import { chainLightning } from '../SpecialEffects';
import { Tower } from '../../Objects/Tower';
import { Enemy } from '../../Objects/Enemy';
import {Projectile} from "../../Objects/Projectile";

export class ChainLightningAttack implements AttackStrategy {
    execute(tower: Tower, target: Enemy, time: number): void {
        tower.rotation = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
        tower.lastShotTime = time;

        const scene = tower.scene as any; // temporarily allow 'any' typing
        const enemies = scene.enemyManager?.enemies || [];

        new Projectile(
            tower.scene,
            tower.x,
            tower.y,
            target,
            tower.stats.damage,
            tower.stats.specialAbility,
            enemies // ✅ Now passing real enemies!
        );
    }
}