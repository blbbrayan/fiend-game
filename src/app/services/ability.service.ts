import {Injectable} from '@angular/core';
import {Global} from "../shared/global";
import {Ability} from "../shared/ability";
import {AbilityReport} from "../shared/ability-report";
import {AttackReport} from "../shared/attack-report";
import {FiendGroup} from "../shared/fiend-group";
import {Fiend} from "../shared/fiend";
import {SquadReport} from "../shared/squad-report";

@Injectable()
export class AbilityService {

  //This service is a fake data service - all abilities will be ran server-side

  abilityEvents = {
    onDeath: 'onDeath',
    onMiss: 'onMiss',
    onHit: 'onHit'
  };

  abilityEvent(event: string, attackReport: AttackReport, caster, target, allies, enemies){
    console.log('ability event', event, caster.ability);
    if(caster.ability && caster.ability.event === event)
      attackReport.abilityReports.push(caster.ability.run(caster, target, allies, enemies));
  }

  attackFiend(caster: Fiend, target: Fiend, allies: FiendGroup, enemies: FiendGroup){
    const roll = Math.ceil(Math.random() * 100);
    const hit = caster.accuracy >= roll;

    let report = new AttackReport(caster, target, roll, hit);

    if (hit) {
      target.health -= caster.damage;
      report.damage = caster.damage;
      report.enemyKilled = target.health <= 0;
      this.abilityEvent(this.abilityEvents.onHit, report, target, caster, enemies, allies); //enemy fires onhit
      if(report.enemyKilled){
        this.abilityEvent(this.abilityEvents.onDeath, report, target, caster, enemies, allies);//enemy fires ondeath
        //onKill
      }
    }else
      this.abilityEvent(this.abilityEvents.onMiss, report, caster, target, enemies, allies);//caster fires onmiss

    return report;
  }

  attackFiendGroup(caster:FiendGroup, target:FiendGroup){
    let report = new SquadReport();

    caster.squad.forEach(unit => {
      const enemy = target.squad.filter(unit => unit.health > 0)[0];
      let attackReport: AttackReport;
      if (enemy) {
        attackReport = this.attackFiend(unit, enemy, caster, target);
        report.reports.push(attackReport);
        if (attackReport.hit)
          report.hits++;
      }
    });

    if (target.squad.filter(unit => unit.health > 0).length <= 0)
      report.enemyKilled = true;

    caster.update();
    target.update();

    return report;
  }

  getAbility(name){
    switch (name){
      case 'undying': return new Ability('undying', 'onDeath', {health:.8,damage:.8}, caster => {
        caster.health = 1;
        caster.ability = null;
        let report = new AbilityReport();
        report.desc = 'Skeleton activates undying. Skeleton\'s health is set to 1 instead of dying.';
        return report;
      }, 'onDeath this unit revives with 1 health.');
      case 'precision': return new Ability('precision', 'onMiss', {acc: .9, damage:.9}, (caster, target)=>{
        console.log('precision ability ran');
        const roll = Math.ceil(Math.random() * 100);
        const hit = caster.accuracy / 2 >= roll;

        let report = new AbilityReport();
        let attackReport = new AttackReport(caster, target, roll, hit);

        if (hit) {
          target.health -= caster.damage;
          attackReport.damage = caster.damage;
          attackReport.enemyKilled = target.health <= 0;
          report.attacks = [];
          report.attacks.push(attackReport);
        }

        report.desc = 'Archer missed. Archer activates Precision. Archer fires one more time.';
        return report;
      }, 'onMiss attack again at half accuracy');
      case 'rage': return new Ability('rage', 'onHit', {health: 1.4, damage:.6}, caster=> {
          caster.damage *= 1.1;

          let report = new AbilityReport();

          report.desc = 'Upon Barbarians being attacked, they gain 10% damage.';
          return report;
        }
      ,'onHit gain 10% damage permanently');
      case 'gentle-giant': return new Ability('gentle-giant', 'onDeath', {damage: 1.3, health:.9}, (caster, target, allies: FiendGroup, enemies) =>{
        allies.squad.forEach(fiend=>{
          if(fiend !== caster)
            fiend.health += caster.level * caster.rarity;
        });
        let report = new AbilityReport();

        report.desc = 'Upon dying, the Giant gifts its allies a health boost.';
        return report;
      }, 'onDeath all allies gain a small boost of health');
    }
  }

}
