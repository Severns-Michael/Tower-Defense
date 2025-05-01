import Phaser from 'phaser';
import { Enemy } from '../Objects/Enemy';
import {
    chainLightning, freezeEnemy, spawnFirePatch, knockbackEnemy, fireDmgOverTime,
    fireInferno, blizzardAOE, applySlowDebuff, chainLightningStun, heavyShotBounce
} from './SpecialEffects';

type SpecialAbilityParams = {
    chainRange?: number;
    chains?: number;
    freezeDuration?: number;
    firePatchDuration?: number;
    knockbackStrength?: number;
    dotDamage?: number;
    aoeRadius?: number;
};

export function applySpecialAbility(
    scene: Phaser.Scene,
    abilityName: string,
    params: SpecialAbilityParams,
    target: Enemy,
    enemies: Enemy[],
    baseDamage: number,
    sourceX: number,
    sourceY: number
) {
    switch (abilityName) {

        // Chain Lightning
        case 'Chain Lightning':
            chainLightning(scene, target, enemies, baseDamage, params.chainRange ?? 200, params.chains ?? 3);
            break;

        // Fireball (regular DOT)
        case 'Fireball':
            target.takeDamage(baseDamage);
            fireDmgOverTime(scene, target, params.dotDamage ?? baseDamage * 0.3, 3);
            break;

        // Inferno (T3 Fireball -> heavy DOT)
        case 'Inferno':
            target.takeDamage(baseDamage);
            fireInferno(scene, target, params.dotDamage ?? baseDamage * 0.4, 3);
            break;

        // Freeze (simple freeze)
        case 'Freeze':
            target.takeDamage(baseDamage);
            freezeEnemy(target, params.freezeDuration ?? 3);
            break;

        // Blizzard (AOE Freeze)
        case 'Blizzard':
            target.takeDamage(baseDamage);
            blizzardAOE(scene, sourceX, sourceY, enemies, params.aoeRadius ?? 200, baseDamage, params.freezeDuration ?? 3);
            break;

        // Fire Patch
        case 'Fire Patch':
            target.takeDamage(baseDamage);
            spawnFirePatch(scene, target.x, target.y);
            break;

        // Knockback
        case 'Knockback':
            target.takeDamage(baseDamage);
            knockbackEnemy(target, sourceX, sourceY, params.knockbackStrength ?? 300);
            break;

        // SlowShot (Short freeze)
        case 'SlowShot':
            target.takeDamage(baseDamage);
            freezeEnemy(target, params.freezeDuration ?? 2);
            break;

        // SlowShotv2 (Long freeze + debuff)
        case 'SlowShotv2':
            target.takeDamage(baseDamage);
            freezeEnemy(target, params.freezeDuration ?? 4);
            applySlowDebuff(target, params.freezeDuration ?? 4);
            break;

        // Chain Lightning Stun Zone (Middle Path Lightning T3 idea)
        case 'Shock':
            target.takeDamage(baseDamage);
            chainLightningStun(scene, sourceX, sourceY, enemies, params.aoeRadius ?? 200, baseDamage, params.freezeDuration ?? 2);
            break;

        // HeavyShot (Bounce or AOE)
        case 'HeavyShot':
            target.takeDamage(baseDamage);
            heavyShotBounce(scene, target, enemies, baseDamage);
            break;

        // Fallback
        default:
            target.takeDamage(baseDamage);
            break;
    }
}