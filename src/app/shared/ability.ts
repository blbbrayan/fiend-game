import {FiendGroup} from './fiend-group';

export class Ability {

  name: string;
  desc: string;
  event: string;
  fn: any;
  stats: any;

  constructor(name, event, stats, fn) {
    this.name = name;
    this.event = event;
    this.stats = stats;
    this.fn = fn;
  }

  run(caster?: FiendGroup, target?: FiendGroup, allies?: FiendGroup[], enemies?: FiendGroup[]) {
    this.fn(caster, target, allies, enemies);
  }

}
