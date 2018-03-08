import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FiendGroup} from "../shared/fiend-group";
import {Global} from "../shared/global";

@Component({
  selector: 'fiend-card',
  templateUrl: './fiend-card.component.html',
  styleUrls: ['./fiend-card.component.css']
})
export class FiendCardComponent implements OnChanges{

  @Input() fiend: FiendGroup;
  @Output() onAttack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() attackMode: boolean;
  @Input() turn: boolean = false;
  menu: boolean;
  animation: string = 'idle';

  constructor(){
    setTimeout(()=>console.log(this.fiend.unit()), 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.attackMode)
      this.animation = this.attackMode === true ? 'attack' : 'idle';
  }

  getState(){
    return {
      attack: this.attackMode,
      [Global.rarities[this.fiend.unit().rarity]]: true
    }
  }

  getRarity(unit){
    return {[Global.rarities[unit.rarity]]: true};
  }

  getSize(unit){
    return {
      ['size' + unit.size]: true,
      [unit.name + '_' + this.animation]: true
    };
  }

  getRarityLabel(){
    return Global.rarities[this.fiend.unit().rarity];
  }

  getHealth(unit, squad){
    return {width: unit.health / squad.baseHealth * 100 + '%'}
  }

  setAttackMode(){
    this.menu = false;
    this.onAttack.emit(true);
  }

}
