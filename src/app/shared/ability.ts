import {FiendGroup} from "./fiend-group";
import {AbilityReport} from "./ability-report";
import {Fiend} from "./fiend";

export class Ability{

  name: string;
  desc: string;
  event: string;
  fn: any;
  stats: any;

  constructor(name, event, stats, fn, desc){
    this.name = name;
    this.event = event;
    this.stats = stats;
    this.fn = fn;
    this.desc = desc;
  }

  run(caster?: Fiend, target?: Fiend, allies?: FiendGroup, enemies?: FiendGroup, team?: FiendGroup[], enemyTeam?: FiendGroup[]): AbilityReport{
    return this.fn(caster, target, allies, enemies, team, enemyTeam);
  }

}
