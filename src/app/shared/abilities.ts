import {Ability} from "./ability";
import {Global} from "./global";

export class Abilities{

  static load(name: string){
    switch(name){
      case 'fireball': return new Ability('fireball', 'onHitEnemy', {health:.9,damage:.9}, (caster, target) => {
        const roll = Global.random(100);
        const hit = roll <= 50;
        if(hit) {
          target.squad.forEach(unit=> unit.health -= (caster.damage / 4));
          target.update();
        }
      });
    }
  }

}
