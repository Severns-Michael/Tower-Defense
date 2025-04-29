import {Tower} from "../../Objects/Tower";
import {Enemy} from "../../Objects/Enemy";

export interface AttackStrategy {
    execute(tower: Tower, target: Enemy, time: number): void;

}