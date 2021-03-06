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
  animations: {idle:number, attack:number};
  team: boolean;

  ability: Ability;

  constructor(name, rarity, level, attr, size, animations, ability?) {
    this.name = name;
    this.rarity = rarity;
    this.level = level;
    this.attribute = attr;
    this.size = size;
    this.animations = animations;
    this.ability = ability;

    this.update();
  }

  update(){
    const rarity = this.rarity, size = this.size, level = this.level, ability = this.ability;
    this.health = (rarity + level + 40 - (size - 1) * 10); // 12 - 50
    this.damage = (rarity + level + 4 - size); // 2 - 13
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

  clone(team){
    return Object.assign({team: team}, this);
  }

  toString(){
    return `${Global.rarities[this.rarity]} ${this.attribute} ${this.name}, lvl: ${this.level} hp: ${this.health} dps: ${this.damage} acc: ${this.accuracy}`;
  }

  toUniqueCode(){
    return `${this.name}-${this.rarity}-${this.level}-${this.attribute}`;
  }

  static loadUniqueCode(code){
    let keys = code.split('-');

    return {
      name: keys[0],
      rarity: keys[1],
      level: keys[2],
      attribute: keys[3]
    }
  }
}
