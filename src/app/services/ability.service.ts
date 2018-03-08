import {Injectable} from '@angular/core';
import {Global} from "../shared/global";
import {Ability} from "../shared/ability";
import {AbilityReport} from "../shared/ability-report";
import {AttackReport} from "../shared/attack-report";

@Injectable()
export class AbilityService {

  useAbility(name){
    switch (name){
      case 'undying': return new Ability('undying', 'onDeath', {health:.9,damage:.9}, caster => {
        caster.health = 1;
        caster.ability = null;
        let report = new AbilityReport();
        report.desc = 'Skeleton activates undying! Skeleton\'s health is set to 1 instead of dying.';
        return report;
      });
      case 'precision': return new Ability('precision', 'onMiss', {acc: .8}, (caster, target)=>{
        const roll = Math.ceil(Math.random() * 100);
        const hit = caster.accuracy >= roll;

        let report = new AbilityReport();
        let attackReport = new AttackReport(roll, hit);

        if (hit) {
          target.health -= caster.damage;
          attackReport.damage = caster.damage;
          attackReport.enemyKilled = target.health <= 0;
          report.attacks = [];
          report.attacks.push(attackReport);
        }

        report.desc = 'Archer missed! Archer activates Precision! Archer fires one more time.';
        return report;
      });
    }
  }

}
