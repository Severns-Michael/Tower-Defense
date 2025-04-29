import EventBus from "../Phaser/Utils/EventBus";


export class PlayerManager {
    scene: Phaser.Scene;
    money: number;
    health: number;
    gameOver: boolean = false;

    constructor(scene: Phaser.Scene, startingMoney: number = 500, startingHealth: number = 100) {
        this.scene = scene;
        this.money = startingMoney;
        this.health = startingHealth;

        EventBus.emit('money-changed', this.money);
        EventBus.emit('health-changed', this.health);
    }

    takeDamage(amount: number) {
        if (this.gameOver) return;

        this.health -= amount;
        EventBus.emit('health-changed', this.health);

        if (this.health <= 0) {
            this.handleGameOver();
        }
    }

    earnMoney(amount: number) {
        if (this.gameOver) return;

        this.money += amount;
        EventBus.emit('money-changed', this.money);

    }

    spendMoney(amount: number): boolean {
        if (this.gameOver) return false;

        if (this.money >= amount) {
            this.money -= amount;
            EventBus.emit('money-changed', this.money);
            return true;
        } else {
            console.log('Not enough money!');
            return false;
        }
    }

    handleGameOver() {
        console.log('Game Over!');
        this.gameOver = true;
        EventBus.emit('game-over');
        this.scene.scene.pause();
    }

    rewardForRound(round: number) {
        if (this.gameOver) return;

        const rewardAmount = 100 + round * 50; // Example: scales with round
        this.earnMoney(rewardAmount);
        console.log(`Player earned ${rewardAmount} for completing Round ${round}`);
    }
}