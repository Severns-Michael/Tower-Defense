import Phaser from 'phaser';
import { Enemy } from './Enemy';
import {applySpecialAbility} from "../Utils/specialAbiltyProcesser";

    export class Projectile extends Phaser.Physics.Arcade.Sprite {
    speed: number = 1500;
    damage: number;
    target: Enemy;
    specialAbility: string;
    enemies: Enemy[];
    specialParams: any;


    constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy, damage: number = 20, specialAbility: string = '', enemies: Enemy[], specialParams: any = {}) {
        super(scene, x, y, 'projectile');
        this.target = target;
        this.damage = damage;
        this.specialAbility = specialAbility;
        this.enemies = enemies;
        this.specialParams = specialParams


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
            const specialParams: any = {};

            // Example → if lightning + top path t3 (you can pass this through from tower later)
            if (this.specialAbility === 'Chain Lightning') {
                specialParams.chainRange = 500;
                specialParams.chains = 5;
            }

            applySpecialAbility(
                this.scene,
                this.specialAbility,
                this.specialParams,
                this.target,
                this.enemies,
                this.damage,
                this.x,
                this.y
            );
    }
}