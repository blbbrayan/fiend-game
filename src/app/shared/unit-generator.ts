import {Fiend} from './fiend';
import {Global} from './global';
import {Unit} from './unit';
import {Abilities} from './abilities';

export class UnitGenerator {

  rarities: number[];
  levels: number[];
  attributes: string[];
  traits: { name: string, type: string }[];
  types: any;
  combos = 0;

  constructor() {
    this.rarities = [1, 2, 3, 4, 5];
    this.levels = [1, 2, 3, 4, 5];
    this.attributes = ['assassin', 'healthy', 'precise'];
    this.traits = [
      {name: 'grumpy', type: 'mood'},
      {name: 'devious', type: 'mood'},
      {name: 'royal', type: 'status'},
      {name: 'poor', type: 'status'},
      {name: 'violent', type: 'mood'},
      {name: 'glowing', type: 'appearance'},
      {name: 'dirty', type: 'appearance'},
      {name: 'alpha', type: 'status'},
      {name: 'strong fighter', type: 'reputation'}
    ];
    this.types = {};
    this.traits.forEach(trait => this.types[trait.type] ? this.types[trait.type].push(trait.name) : this.types[trait.type] = [trait.name]);
    this.combos = this.rarities.length * this.levels.length * this.attributes.length;
  }

  generate(unit: Unit, rarityI?: number, levelI?: number, attributeI?: string) {
    const rarity = rarityI || this.rarities[Global.random(this.rarities.length - 1)];
    const level = levelI || this.levels[Global.random(this.levels.length - 1)];
    const attribute = attributeI || this.attributes[Global.random(this.attributes.length - 1)];

    let ability;
    if (unit.ability) {
      ability = Abilities.load(unit.ability);
    }

    const fiend = new Fiend(unit.name, rarity, level, attribute, unit.size, unit.color, ability);
    fiend.color = unit.color;

    return fiend;
  }

  generateAll(units: Unit[]) {
    const unitList: Fiend[] = [];
    units.forEach(unit => {
        const ability = unit.ability ? Abilities.load(unit.ability) : undefined;
        this.rarities.forEach(rarity =>
          this.levels.forEach(level =>
            this.attributes.forEach(attribute =>
              unitList.push(new Fiend(unit.name, rarity, level, attribute, unit.size, unit.color, ability))
            )
          )
        );
      }
    );
    return unitList;
  }
}
