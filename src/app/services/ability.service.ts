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
    onHitEnemy: 'onHitEnemy',
    onTurnStart: 'onTurnStart'
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
    this.abilityEvent(this.abilityEvents.onTurnStart, report, caster, null, allies, null, team, enemyTeam, ability); //caster fires onTurnStart

    if (hit) {
      target.health -= caster.damage;
      report.damage = caster.damage;
      report.enemyKilled = target.health <= 0;
      this.abilityEvent(this.abilityEvents.onHitEnemy, report, caster, target, allies, enemies, team, enemyTeam, ability); //caster fires onhit
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
        let report = new AbilityReport(caster, target, this);

        enemies.squad.forEach(fiend=>
            report.attacks.push(this.attackFiend(caster, fiend, allies, enemies, team, enemyTeam, true))
        );

        report.desc = `The Blademaster attacks all fiends in group (${report.attacks.filter(a=>a.hit).length} hits)`;

        return report;
      }, 'OnHitEnemy attack all enemies in a squad.');
      case 'cleanse': return new Ability('cleanse', 'onTurnStart', {health: .8, damage: 1.3}, (caster, target, allies)=> {
          if(caster.health < allies.baseHealth)
            caster.health += caster.rarity + caster.level;
          if(caster.damage < allies.baseDamage)
            caster.damage += caster.rarity + caster.length;

          let report = new AbilityReport(caster, null, this);

          report.desc = `Shamfie cleanse themselves, returning ${caster.rarity + caster.level} health and / or damage`;
          return report;
        }
        ,'OnTurnStart Shamfie cleanse themselves, returning to base stats');
      case 'shapeshift': return new Ability('shapeshift', 'onKill', {health: 1.4, damage: 0.6}, (caster, target, allies)=> {

          let report = new AbilityReport(caster, null, this);

          switch(allies.squad.length){
            case 3:
              allies.squad = [
                new Fiend('silver-wolf', caster.rarity, caster.level, caster.attribute, 3, caster.animations, this.getAbility('life-siphon')),
                new Fiend('silver-wolf', caster.rarity, caster.level, caster.attribute, 3, caster.animations, this.getAbility('life-siphon')),
                new Fiend('silver-wolf', caster.rarity, caster.level, caster.attribute, 3, caster.animations, this.getAbility('life-siphon'))
              ];
              report.desc = `The Druids shapeshift into silver wolves!`;
              break;
            case 2:
              allies.squad = [
                new Fiend('dire-wolf', caster.rarity, caster.level, caster.attribute, 2, caster.animations, this.getAbility('life-siphon')),
                new Fiend('dire-wolf', caster.rarity, caster.level, caster.attribute, 2, caster.animations, this.getAbility('life-siphon'))
              ];
              report.desc = `The Druids shapeshift into dire wolves!`;
              break;
            case 1:
              allies.squad = [
                new Fiend('dark-hound', caster.rarity, caster.level, caster.attribute, 1, caster.animations, this.getAbility('life-siphon'))
              ];
              report.desc = `The Druid shapeshifts into a Dark Hound!`;
              break;
          }

          allies.baseHealth = allies.squad[0].health;
          allies.baseDamage = allies.squad[0].damage;
          allies.baseAccuracy = allies.squad[0].accuracy;

          return report;
        }
        ,'OnKill The Druid will shapeshift into a wolf with life-siphon. The wolf has the same rarity, level, and attribute of the druid. The Wolf\'s size is based on how many druids are alive.');
      case 'life-siphon': return new Ability('cleanse', 'onHitEnemy', {health: .7, damage: 1.5}, (caster, target, allies)=> {
          caster.health += (4-caster.size) * ((caster.rarity + caster.level) / 2);

          let report = new AbilityReport(caster, null, this);

          report.desc = `${caster.name} gains ${(4-caster.size) * ((caster.rarity + caster.level) / 2)} health`;
          return report;
        }
        ,'OnHitEnemy gain health based on size (the larger the more health).');
      case 'voodoo': return new Ability('voodoo', 'onHit', {health: 1.1, damage: 0.9}, (caster, target, allies, enemies)=> {

          enemies.squad.forEach(fiend=>{
            fiend.health -= ~~((caster.rarity + caster.level) / 2);
          });

          let report = new AbilityReport(caster, null, this);

          report.desc = `Attacking Fetish deals ${~~((caster.rarity + caster.level) / 2)} voodoo damage`;
          return report;
        }
        ,'OnHit deal damage to all enemy squad attackers.');
    }
  }

}
