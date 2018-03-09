import {Fiend} from "./fiend";
import {SquadReport} from "./squad-report";
import {AttackReport} from "./attack-report";

export class FiendGroup{

  squad: Fiend[];
  baseHealth: number;
  baseDamage: number;
  baseAccuracy: number;

  constructor(unit: Fiend) {
    this.squad = [];
    for (let i = 0; i < unit.size; i++)
      this.squad.push(unit.clone());
    this.baseHealth = this.unit().health;
    this.baseDamage = this.unit().damage;
    this.baseAccuracy = this.unit().accuracy;
  }

  update(){
    this.squad = this.squad.filter(u=>u.health>0);
  }

  unit(){
    return this.squad[0];
  }

}
