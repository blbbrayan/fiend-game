import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Global} from "../shared/global";

@Component({
  selector: 'dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css']
})
export class DiceComponent{

  @Input() roll: number;
  @Input() hit: boolean;
  active: boolean;

  x: number;
  y: number;

  constructor(){
    this.x = Global.random(innerWidth - 75);
    this.y = Global.random(innerHeight - 75);
    this.active = true;
    setTimeout(()=>this.active=false, 3000);
  }

  getLocation(){
    return {top: this.y + 'px', left: this.x + 'px', color: this.hit ? 'green' : 'red'}
  }
}
