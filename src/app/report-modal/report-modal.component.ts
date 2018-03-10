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
  index: number = 0;
  innerHeight: number;

  ngOnChanges(changes:SimpleChanges):void {
    this.index = this.history.length-1;
    this.innerHeight = document.body.getBoundingClientRect().height;
  }

  report(){
    return this.history[this.index];
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

  isAbility(report){
    return report.ability;
  }

  damage(){
    let damage = 0;
    this.attacks().forEach(report=>damage+=report.damage?report.damage:0);
    return damage;
  }

  brayreports(){
    let reports = [];
    if(this.report())
      this.report().reports.forEach(attackReport =>{
        reports.push(attackReport);
        if(attackReport.abilityReports)
          attackReport.abilityReports.forEach(abilityReport=>{
            reports.push(abilityReport);
            if(abilityReport.attacks)
              abilityReport.attacks.forEach(a=>reports.push(a));
          });
      });
    return reports;
  }

  // dads report chaining arrays
  reports() {
    return this.report().reports.filter(atr => {
      return atr['abilityReports'] !== undefined;
    }).map(atr => {
      return atr['abilityReports'];
    }).filter(abr => {
      return abr['attacks'] !== undefined;
    }).map(abr => {
      return abr['attacks'];
    });
  }

  attacks(){
    return this.report().reports;
  }

  abilities(): AbilityReport[]{
    let abilityReports: AbilityReport[] = [];
    if(this.report())
      this.report().reports.forEach(attackReport =>{
        if(attackReport.abilityReports)
          attackReport.abilityReports.forEach(e=>abilityReports.push(e));
      });
    return abilityReports;
  }

  moveIndex(val){
    this.index += val;
    if(this.index >= this.history.length) this.index = 0;
    if(this.index < 0) this.index = this.history.length-1;
    this.innerHeight = document.body.getBoundingClientRect().height;
  }
}
