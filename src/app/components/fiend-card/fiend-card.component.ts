import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FiendGroup} from "../../shared/fiend-group";
import {Global} from "../../shared/global";

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
  selectedUnit: number = 0;
  loading: boolean = true;
  loadIndex: number = 0;

  constructor(){
    setTimeout(()=>{
      this.animation = 'attack';
      setTimeout(()=>this.animation = 'idle', 1200);
    }, 1200);
    let listener = setInterval(()=>{
      this.loadIndex++;
      if(this.loadIndex >= 20){
        this.loading = false;
        clearInterval(listener);
      }
    }, 120);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['attackMode'])
      this.animation = this.attackMode === true ? 'attack' : 'idle';
  }

  getLoad(){
    return {width: this.loadIndex / 20 * 100 + '%'}
  }

  getState(){
    return {
      attack: this.attackMode,
      [Global.rarities[this.fiend.unit().rarity]]: true,
      turn: this.turn
    }
  }

  getRarity(unit?){
    return {[Global.rarities[this.fiend.unit().rarity]]: true};
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
    if(this.turn) {
      this.menu = false;
      this.onAttack.emit(true);
    }
  }

    getFiend(){
    return this.fiend.squad[this.selectedUnit];
  }

}
