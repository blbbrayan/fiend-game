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
    onHit: 'onHit',
    onKill: 'onKill',
    onHitEnemy: 'onHitEnemy'
  };

  abilityEvent(event: string, attackReport: AttackReport, caster, target, allies, enemies, team, enemyTeam, ability?: boolean){
    if(caster.ability && caster.ability.event === event && !ability) {
      console.log('ability event', event, caster.ability);
      attackReport.abilityReports.push(caster.ability.run(caster, target, allies, enemies, team, enemyTeam));
    }
  }

  attackFiend(caster: Fiend, target: Fiend, allies: FiendGroup, enemies: FiendGroup, team, enemyTeam, ability?: boolean){
    const roll = Math.ceil(Math.random() * 100);
    const hit = caster.accuracy >= roll;

    let report = new AttackReport(caster, target, roll, hit);

    if (hit) {
      target.health -= caster.damage;
      report.damage = caster.damage;
      report.enemyKilled = target.health <= 0;
      this.abilityEvent(this.abilityEvents.onHitEnemy, report, caster, target, allies, enemies, team, enemyTeam); //caster fires onhit
      this.abilityEvent(this.abilityEvents.onHit, report, target, caster, enemies, allies, enemyTeam, team); //enemy fires onhit
      if(report.enemyKilled){
        this.abilityEvent(this.abilityEvents.onDeath, report, target, caster, enemies, allies, enemyTeam, team);//enemy fires ondeath
        this.abilityEvent(this.abilityEvents.onKill, report, caster, target, allies, enemies, team, enemyTeam, ability);//caster fires onkill
      }
    }else
      this.abilityEvent(this.abilityEvents.onMiss, report, caster, target, enemies, allies, team, enemyTeam, ability);//caster fires onmiss

    return report;
  }

  attackFiendGroup(caster:FiendGroup, target:FiendGroup, team: FiendGroup[], enemyTeam: FiendGroup[]){
    let report = new SquadReport();

    caster.squad.forEach(unit => {
      const enemy = target.squad.filter(unit => unit.health > 0)[0];
      let attackReport: AttackReport;
      if (enemy) {
        attackReport = this.attackFiend(unit, enemy, caster, target, team, enemyTeam);
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
        let report = new AbilityReport(caster, null, this);
        report.desc = 'Skeleton activates undying. Skeleton\'s health is set to 1 instead of dying.';
        return report;
      }, 'onDeath this unit revives with 1 health.');
      case 'precision': return new Ability('precision', 'onMiss', {acc: .9, damage:.9}, (caster, target, allies, enemies, team, enemyTeam)=>{
        let acc = caster.accuracy + 0;
        caster.accuracy = ~~(caster.accuracy / 2);
        let report = new AbilityReport(caster, target, this);
        report.attacks = [this.attackFiend(caster, target, allies, enemies, team, enemyTeam, true)];
        caster.accuracy = acc;

        report.desc = 'Archer missed. Archer activates Precision. Archer fires one more time. ' + (report.attacks[0].hit ? 'Hit.' : 'Miss.');
        return report;
      }, 'onMiss attack again at half accuracy');
      case 'rage': return new Ability('rage', 'onHit', {health: 1.4, damage:.6}, (caster, target)=> {
          caster.damage += ~~((caster.level + caster.rarity) / 2);

          let report = new AbilityReport(caster, target, this);

          report.desc = `Upon Barbarians being attacked, they gain ${~~((caster.level + caster.rarity) / 2)} damage.` + ` (total ${caster.damage} damage)`;
          return report;
        }
      ,'onHit gain increased damage permanently');
      case 'gentle-giant': return new Ability('gentle-giant', 'onDeath', {damage: 1.4, health:.8}, (caster, target, allies: FiendGroup, enemies, team: FiendGroup[]) =>{
        console.log('gentle-giant being run', team);
        team.forEach(allySquad=>allySquad.squad.forEach(fiend=>{
          if(fiend !== caster){
            console.log('giving ' + fiend.name + ' ' + (caster.level + caster.rarity) + 'health');
            fiend.health += caster.level + caster.rarity;
          }
        }));
        let report = new AbilityReport(caster, target, this);

        report.desc = 'Upon dying, the Giant gifts its allies a health boost.' + ` (${caster.level + caster.rarity} health)`;
        return report;
      }, 'onDeath all allies gain a small boost of health');
      case 'wind-walk': return new Ability('wind-walk', 'onHitEnemy', {damage: 1.2}, (caster, target, allies, enemies, team, enemyTeam)=>{
        let miss = false;
        let report = new AbilityReport(caster, target, this);
        while(!miss){
          let attack = null;
          enemies.update();
          if(target.health > 0)
            attack = this.attackFiend(caster, target, allies, enemies, team, enemyTeam, true);
          else if(enemies.squad[0].health > 0)
            attack = this.attackFiend(caster, enemies.squad[0], allies, enemies, team, enemyTeam, true);
          if(attack === null)
            miss = true;
          else{
            console.log('windwalk attack', attack.caster, attack.target, caster, target, allies, enemies, team, enemyTeam);
            report.attacks.push(attack);
            miss = !attack.hit;
          }
        }
        report.desc = `The Blademaster swings until miss. (${report.attacks.length} hits)`;

        return report;
      }, 'OnKill this unit attacks any remaining units in a fiend group until it misses or until the fiend group is dead.')
    }
  }

}
