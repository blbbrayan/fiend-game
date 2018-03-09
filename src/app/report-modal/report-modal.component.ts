import {Component, OnChanges, Input, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {SquadReport} from "../shared/squad-report";
import {AbilityReport} from "../shared/ability-report";

@Component({
  selector: 'report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnChanges {

  @Input() history: SquadReport[];
  @Input() active: boolean = true;
  @Output() onExit: EventEmitter<boolean> = new EventEmitter<boolean>();
  tab: string = 'ability';
  index: number = 0;

  constructor() {}

  ngOnChanges(changes:SimpleChanges):void {
    this.index = this.history.length-1;
  }

  report(){
    return this.history[this.index];
  }

  attacks(){
    return this.report().reports;
  }

  kills(){
    let kills = 0;
    this.attacks().forEach(report=>kills+=report.enemyKilled?1:0);
    return kills;
  }

  hits(){
    let hits = 0;
    this.attacks().forEach(report=>hits+=report.hit?1:0);
    return hits;
  }

  damage(){
    let damage = 0;
    this.attacks().forEach(report=>damage+=report.damage?report.damage:0);
    return damage;
  }

  abilities(): AbilityReport[]{
    let abilityReports: AbilityReport[] = [];
    if(this.report())
      this.report().reports.forEach(attackReport =>abilityReports = abilityReports.concat(attackReport.abilityReports));
    return abilityReports;
  }

  tabStyle(){
    return{'margin-left': this.tab === 'ability' ? '50%' : '0'}
  }

  moveIndex(val){
    this.index += val;
    if(this.index >= this.history.length) this.index = 0;
    if(this.index < 0) this.index = this.history.length-1;
  }
}
