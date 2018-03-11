import {AttackReport} from "./attack-report";
import {Ability} from "./ability";
import {Fiend} from "./fiend";
export class AbilityReport{

  caster: Fiend;
  target: Fiend;
  ability: Ability;
  desc: string;
  attacks: AttackReport[];
  time: number;

  constructor(caster, target, ability){
    this.ability = ability;
    this.caster = caster;
    this.target = target;
    this.time = new Date().getTime();
    this.attacks = [];
  }

}
