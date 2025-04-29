import {TowerType} from "../../types/Tower";
import {BaseTowerStats} from "./BaseTowerTypes";

export const BaseTowers: Record<TowerType, BaseTowerStats> = {
    fire: {
        name: "Fire Tower",
        description: "Shoots fireballs that can ignite enemies.",
        damage: 15,
        range: 120,
        rateOfFire: 700,
        specialAbility: "Fireball", // what happens after hits land // burning damg
        baseAttackStrategy: "Projectile", // how you shoot
    },
    ice: {
        name: "Ice Tower",
        description: "Shoots icy blasts that slow enemies.",
        damage: 10,
        range: 100,
        rateOfFire: 1200,
        specialAbility: "Freeze",//slow enemy
        baseAttackStrategy: "SlowShot",
    },
    lightning: {
        name: "Lightning Tower",
        description: "Zaps multiple enemies with chain lightning.",
        damage: 100,
        range: 140,
        rateOfFire: 900,
        specialAbility: "Chain Lightning",// lets chain happen
        baseAttackStrategy: "ChainLightning",
    },
    physical: {
        name: "Longbow Tower",
        description: "Shoots heavy damaging Arrows.",
        damage: 30,
        range: 200,
        rateOfFire: 600,
        specialAbility: "",
        baseAttackStrategy: "HeavyShot",
    }
}