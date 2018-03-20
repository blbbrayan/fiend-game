import {AbilityReport} from "./ability-report";
import {Fiend} from "./fiend";
export class AttackReport{

  caster: Fiend;
  target: Fiend;
  roll: number;
  hit: boolean;
  damage: number;
  enemyKilled: boolean;
  abilityReports: AbilityReport[];
  time: number;

  constructor(caster: Fiend, target: Fiend, roll?, hit?){
    this.caster = caster;
    this.target = target;
    this.roll = roll;
    this.hit = hit;
    this.enemyKilled = false;
    this.damage = 0;
    this.abilityReports = [];
    this.time = new Date().getTime();
  }

  toString(){
    return `${this.hit?'hit':'miss'} (${this.roll}) ${this.hit?` damage: ${this.damage} kill: ${this.enemyKilled}`:''}`;
  }

}
