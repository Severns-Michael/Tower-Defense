// src/Phaser/Utils/specialEffect.ts
import { Enemy } from '../Objects/Enemy';
import Phaser from 'phaser';



export function chainLightning(
    scene: Phaser.Scene,
    target: Enemy,
    enemies: Enemy[],
    baseDamage: number,
    range: number = 200,
    chains: number = 3
) {

    if (!enemies || enemies.length === 0) {
        return;
    }

    const graphics = scene.add.graphics();
    graphics.setDepth(20); //
    graphics.lineStyle(2, 0x00ffff, 1);
    const nearby = enemies.filter(e =>
        e !== target &&
        !e.isDead &&
        Phaser.Math.Distance.Between(target.x, target.y, e.x, e.y) <= range
    );


    nearby.slice(0, chains).forEach(enemy => {
        console.log('⚡ Chaining to enemy at', enemy.x, enemy.y);

        // 🔥 Draw a lightning bolt between target and enemy
        graphics.beginPath();
        graphics.moveTo(target.x, target.y);
        graphics.lineTo(enemy.x, enemy.y);
        graphics.strokePath();


        enemy.takeDamage(baseDamage * 0.7);
    });


    console.log('⚡ Hitting initial target');
    target.takeDamage(baseDamage);


    scene.time.delayedCall(200, () => {
        graphics.destroy();
    });
}

export function freezeEnemy(target: Enemy, freezeDurationSeconds: number = 2) {
    if (target.freeze) {
        console.log('Calling freeze on target!');
        target.freeze(freezeDurationSeconds);
    } else {
        console.warn('Target cannot be frozen, fallback to taking 0 damage.');
        target.takeDamage(0);
    }
}

// Effect: fire patch damage over time
export function spawnFirePatch(scene: Phaser.Scene, x: number, y: number) {
    // You would create a FirePatch GameObject here
    console.log(` Fire Patch spawned at (${x}, ${y})`);
    // FirePatch would damage enemies standing in it over time
}

export function fireDmgOverTime(scene: Phaser.Scene, target: Enemy, damage: number, duration: number) {
    const ticks = 5;  // how many times we deal damage
    const interval = duration / ticks; // how often to apply damage
    let ticksDone = 0;

    const timer = scene.time.addEvent({
        delay: interval * 1000, // Phaser uses milliseconds
        repeat: ticks - 1,      // because first damage is after delay
        callback: () => {
            if (target.active && !target.isDead) {
                target.takeDamage(damage / ticks); // split damage across ticks
            }
            ticksDone++;
            if (ticksDone >= ticks) {
                timer.remove(false);  // stop timer
            }
        }
    });
}

// Effect: knockback
export function knockbackEnemy(enemy: Enemy, sourceX: number, sourceY: number, strength: number = 200) {
    const angle = Phaser.Math.Angle.Between(sourceX, sourceY, enemy.x, enemy.y);
    const knockbackX = Math.cos(angle) * strength;
    const knockbackY = Math.sin(angle) * strength;

    if (enemy.body) {
        (enemy.body as Phaser.Physics.Arcade.Body).velocity.x += knockbackX;
        (enemy.body as Phaser.Physics.Arcade.Body).velocity.y += knockbackY;
    }

}
export function fireInferno(scene: Phaser.Scene, target: Enemy, damage: number, duration: number) {
    fireDmgOverTime(scene, target, damage * 0.4, duration);
    fireDmgOverTime(scene, target, damage * 0.4, duration);

}
export function blizzardAOE(scene: Phaser.Scene, x: number, y: number, enemies: Enemy[], radius: number, damage: number, freezeDuration: number) {
    const affected = enemies.filter(enemy =>
        !enemy.isDead &&
        Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius
    );

    affected.forEach(enemy => {
        enemy.takeDamage(damage);
        freezeEnemy(enemy, freezeDuration);
    });
}
export function applySlowDebuff(target: Enemy, duration: number = 5, damageMultiplier: number = 1.25) {


    // Assume Enemy has "damageMultiplier" property or add temporary one
    (target as any).damageMultiplier = damageMultiplier;

    // Remove debuff after duration
    setTimeout(() => {
        (target as any).damageMultiplier = 1;
    }, duration * 1000);
}
export function chainLightningStun(scene: Phaser.Scene, x: number, y: number, enemies: Enemy[], radius: number, damage: number, stunDuration: number) {
    const affected = enemies.filter(enemy =>
        !enemy.isDead &&
        Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius
    );

    affected.forEach(enemy => {
        enemy.takeDamage(damage);

        if (enemy.freeze) {
            enemy.freeze(stunDuration);
        }
    });

}
export function heavyShotBounce(scene: Phaser.Scene, originEnemy: Enemy, enemies: Enemy[], damage: number, bounceRange: number = 200) {
    const bounceTarget = enemies.find(enemy =>
        enemy !== originEnemy &&
        !enemy.isDead &&
        Phaser.Math.Distance.Between(originEnemy.x, originEnemy.y, enemy.x, enemy.y) <= bounceRange
    );

    if (bounceTarget) {
        bounceTarget.takeDamage(damage);
        console.log("🪨 Heavy Shot → Bounced to another enemy!");
    }
}

