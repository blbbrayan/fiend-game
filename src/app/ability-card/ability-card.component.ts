import { Component, Input } from '@angular/core';
import {Global} from "../shared/global";
import {AbilityReport} from "../shared/ability-report";

@Component({
  selector: 'ability-card',
  templateUrl: './ability-card.component.html',
  styleUrls: ['./ability-card.component.css']
})
export class AbilityCardComponent {

  @Input() abilityReport: AbilityReport;
  active: boolean;

  x: number;
  y: number;

  constructor(){
    this.x = Global.random(innerWidth - 200);
    this.y = Global.random(innerHeight - 200);
    this.active = true;
    setTimeout(()=>this.active=false, 3000);
  }

  getLocation(){
    return {top: this.y + 'px', left: this.x + 'px'}
  }
}
