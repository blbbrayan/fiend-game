export class AttackReport{

  roll: number;
  hit: boolean;
  damage: number;
  enemyKilled: boolean;

  constructor(roll?, hit?){
    this.roll = roll;
    this.hit = hit;
    this.enemyKilled = false;
    this.damage = 0;
  }

  toString(){
    return `${this.hit?'hit':'miss'} (${this.roll}) ${this.hit?` damage: ${this.damage} kill: ${this.enemyKilled}`:''}`;
  }

}
