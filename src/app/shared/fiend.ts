import {AttackReport} from "./attack-report";
import {Global} from "./global";
import {Ability} from "./ability";

export class Fiend{
  name: string;
  health: number;
  damage: number;
  accuracy: number;
  size: number; // 1:large 2:medium 3:small 4:swarm
  attribute: string; // assassin healthy precise
  rarity: number; // 1:common 2:uncommon 3:rare 4:epic 5:legendary
  level: number; // 1 2 3 4 5
  color: string;
  animations: {idle:number, attack:number};

  ability: Ability;

  constructor(name, rarity, level, attr, size, animations, color?, ability?) {
    this.name = name;
    this.rarity = rarity;
    this.level = level;
    this.attribute = attr;
    this.size = size;
    this.animations = animations;
    this.color = color;

    this.health = (rarity + 6 - size) * level * 10; // 30 - 100
    this.damage = Math.ceil((rarity + 6 - size) / 2) * level * 10; // 20 - 50
    this.accuracy = (.4 + ((5 - size) / 4 * .2) + (rarity / 5 * .1)) * 100;

    switch (this.attribute) {
      case 'assassin':
        this.damage *= 1.3;
        break;
      case 'healthy':
        this.health *= 1.15;
        break;
      case 'precise':
        this.accuracy *= 1.05;
        break;
    }

    if(ability)
      Object.keys(ability.stats).forEach(key => this[key] *= ability.stats[key]);
    this.ability = ability;

    this.damage = Math.floor(this.damage);
    this.health = Math.floor(this.health);
    this.accuracy = Math.floor(this.accuracy);
  }

  attack(enemy: Fiend) {
    const roll = Math.ceil(Math.random() * 100);
    const hit = this.accuracy >= roll;

    let report = new AttackReport(roll, hit);

    if (hit) {
      enemy.health -= this.damage;
      report.damage = this.damage;
      report.enemyKilled = enemy.health <= 0;
    }

    return report;
  }

  clone(){
    let c = Object.assign({}, this);
    c.attack = this.attack.bind(c);
    return c;
  }

  toString(){
    return `${Global.rarities[this.rarity]} ${this.attribute} ${this.name}, lvl: ${this.level} hp: ${this.health} dps: ${this.damage} acc: ${this.accuracy}`;
  }

}
