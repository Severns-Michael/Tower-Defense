import Phaser from 'phaser';
import { Enemy } from './Enemy';
import {chainLightning, freezeEnemy, spawnFirePatch, knockbackEnemy, fireDmgOverTime} from '../Utils/SpecialEffects';

    export class Projectile extends Phaser.Physics.Arcade.Sprite {
    speed: number = 300;
    damage: number;
    target: Enemy;
    specialAbility: string;
    enemies: Enemy[];


    constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy, damage: number = 20, specialAbility: string = '', enemies: Enemy[]) {
        super(scene, x, y, 'projectile');
        this.target = target;
        this.damage = damage;
        this.specialAbility = specialAbility;
        this.enemies = enemies;


        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);
        this.setOrigin(0.5);

        scene.physics.moveToObject(this, target, this.speed);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active || !this.target || !this.target.active) {
            this.destroy();
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.setVelocity(velocityX, velocityY);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (dist < 10) {
            this.applyEffect();
            this.destroy();
        }
    }
    applyEffect() {
        switch (this.specialAbility) {
            case 'Chain Lightning':
                chainLightning(
                    this.scene,
                    this.target,
                    this.enemies,
                    this.damage,
                    1000, //chain range
                    3 // chains
                );
                break;
            case 'Freeze':
                console.log('🧊 FREEZE APPLY EFFECT - Dealing damage first');
                this.target.takeDamage(this.damage);
                freezeEnemy(this.target, 3);
                break;
            case 'Fire Patch':
                this.target.takeDamage(this.damage);
                spawnFirePatch(this.scene, this.target.x, this.target.y);
                break;
            case 'Knockback':
                this.target.takeDamage(this.damage);
                knockbackEnemy(this.target, this.x, this.y);
                break;
            case 'Fireball':
                this.target.takeDamage(this.damage);
                fireDmgOverTime(this.scene, this.target, this.damage * 0.3, 3 )
                break;
            default:
                this.target.takeDamage(this.damage);
        }
    }
}