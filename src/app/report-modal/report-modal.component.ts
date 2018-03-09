import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import {SquadReport} from "../shared/squad-report";

@Component({
  selector: 'report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnChanges {

  @Input() report: SquadReport;
  tab: string = 'ability';

  constructor() {}

  ngOnChanges(changes:SimpleChanges):void {
    if(changes['report']) {
      console.log('Squad Report', this.report);
    }
  }

  attacks(){
    return this.report.reports;
  }

  abilities(){
    let abilityReports = [];
    this.report.reports.forEach(attackReport =>abilityReports = abilityReports.concat(attackReport.abilityReports));
    return abilityReports;
  }
}
