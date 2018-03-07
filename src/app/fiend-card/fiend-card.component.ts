import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FiendGroup} from '../shared/fiend-group';
import {Global} from '../shared/global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fiend-card',
  templateUrl: './fiend-card.component.html',
  styleUrls: ['./fiend-card.component.css']
})
export class FiendCardComponent {

  @Input() fiend: FiendGroup;
  @Output() AttackClickHandler: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() attackMode: boolean;
  @Input() turn = false;
  menu: boolean;

  constructor() {
    setTimeout(() => console.log(this.fiend.unit()), 1000);
  }

  getState() {
    return {
      attack: this.attackMode
    };
  }

  getRarity(unit) {
    return {[Global.rarities[unit.rarity]]: true};
  }

  getSize(unit) {
    return {['size' + unit.size]: true};
  }

  getRarityLabel() {
    return Global.rarities[this.fiend.unit().rarity];
  }

  getHealth(unit, squad) {
    return { width: unit.health / squad.baseHealth * 100 + '%' };
  }

  setAttackMode() {
    this.menu = false;
    this.AttackClickHandler.emit(true);
  }

}