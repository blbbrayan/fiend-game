import {AttackReport} from "./attack-report";

export class SquadReport{

  hits: number;
  enemyKilled: boolean;
  reports: AttackReport[];
  time: number;

  constructor(){
    this.hits = 0;
    this.enemyKilled = false;
    this.reports = [];
    this.time = new Date().getTime();
  }

}
