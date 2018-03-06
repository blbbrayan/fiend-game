import {Fiend} from "./fiend";
import {SquadReport} from "./squad-report";
import {AttackReport} from "./attack-report";

export class FiendGroup{

  squad: Fiend[];
  baseHealth: number;
  baseDamage: number;
  baseAccuracy: number;

  constructor(unit: Fiend) {
    this.squad = [];
    for (let i = 0; i < unit.size; i++)
      this.squad.push(unit.clone());
    this.baseHealth = this.unit().health;
    this.baseDamage = this.unit().damage;
    this.baseAccuracy = this.unit().accuracy;
  }

  attack(group) {
    let report = new SquadReport();

    this.squad.forEach(unit => {
      const enemy = group.squad.filter(unit => unit.health > 0)[0];
      let attackReport: AttackReport;
      if (enemy) {
        attackReport = unit.attack(enemy);
        report.reports.push(attackReport);
        if (attackReport.hit)
          report.hits++;
      }
    });

    if (group.squad.filter(unit => unit.health > 0).length <= 0)
      report.enemyKilled = true;

    this.update();
    group.update();

    return report;
  }

  update(){
    this.squad = this.squad.filter(u=>u.health>0);
  }

  unit(){
    return this.squad[0];
  }

}
