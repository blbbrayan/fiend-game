const ReportsApi = require('./reports.api');
const AbilityApi = require('./ability.api');

function toSimpleCode() {
    return `${this.name}-${this.rarity}-${this.level}-${this.attribute}`;
}

function loadSimpleCode(code) {
    let keys = code.split('-');

    return {
        name: keys[0],
        rarity: keys[1],
        level: keys[2],
        attribute: keys[3]
    }
}

function initFiend() {
    this.health = (this.rarity + this.level + 40 - (this.size - 1) * 10); // 12 - 50
    this.damage = (this.rarity + this.level + 4 - this.size); // 2 - 13
    this.accuracy = (.4 + ((5 - this.size) / 4 * .2) + (this.rarity / 5 * .1)) * 100;

    if (ability)
        Object.keys(ability.stats).forEach(key => this[key] *= ability.stats[key]);
    this.ability = ability;

    switch (this.attribute) {
        case 'assassin':
            this.damage *= 1.3;
            break;
        case 'healthy':
            this.health *= 1.15;
            break;
        case 'precise':
            this.accuracy *= 1.05;
            break;
    }

    this.damage = ~~(this.damage);
    this.health = ~~(this.health);
    this.accuracy = ~~(this.accuracy);
}

function updateSquad(){
    this.fiends = this.fiends.filter(fiend=>fiend.health > 0);
    return this;
}

function abilityEvent(event, attackReport, caster, target, allies, enemies, team, enemyTeam, isAbilityAttack){
    if(caster.ability && caster.ability.event === event && !isAbilityAttack)
        attackReport.abilityReports.push(AbilityApi.loadAbility(caster.ability).run(caster, target, allies, enemies, team, enemyTeam));
}

function attackFiend(caster, target, allies, enemies, team, enemyTeam, isAbilityAttack){
    const roll = Math.ceil(Math.random() * 100);
    const hit = caster.accuracy >= roll;

    let attackReport = new ReportsApi.AttackReport(caster, target, roll, hit);
    abilityEvent(AbilityApi.events.onTurnStart, attackReport, caster, null, allies, null, team, enemyTeam, isAbilityAttack); //caster fires onTurnStart

    if (hit) {
        target.health -= caster.damage;
        attackReport.damage = caster.damage;
        attackReport.enemyKilled = target.health <= 0;
        abilityEvent(AbilityApi.events.onHitEnemy, attackReport, caster, target, allies, enemies, team, enemyTeam, isAbilityAttack); //caster fires onhit
        abilityEvent(AbilityApi.events.onHit, attackReport, target, caster, enemies, allies, enemyTeam, team); //enemy fires onhit
        if(attackReport.enemyKilled){
            abilityEvent(AbilityApi.events.onDeath, attackReport, target, caster, enemies, allies, enemyTeam, team);//enemy fires ondeath
            abilityEvent(AbilityApi.events.onKill, attackReport, caster, target, allies, enemies, team, enemyTeam, isAbilityAttack);//caster fires onkill
        }
    }else
        abilityEvent(AbilityApi.events.onMiss, attackReport, caster, target, enemies, allies, team, enemyTeam, isAbilityAttack);//caster fires onmiss

    return attackReport;
}

function attackSquad(allies, enemies, team, enemyTeam){
    let squadReport = new ReportsApi.SquadReport();

    allies.fiends.forEach(caster => {
        const target = enemies.squad.filter(unit => unit.health > 0)[0];
        if (target)
            squadReport.add(attackFiend(caster, target, allies, enemies, team, enemyTeam));
    });

    if (enemies.fiends.filter(fiend => fiend.health > 0).length <= 0)
        squadReport.enemySquadKilled = true;

    [allies, enemies].forEach(squad=>updateSquad.bind(squad)());

    return squadReport;
}

module.exports = {
    initFiend: fiend => initFiend.bind(fiend)(),
    updateSquad: squad => updateSquad.bind(squad)(),
    toSimpleCode: fiend => toSimpleCode.bind(fiend)(),
    loadSimpleCode: loadSimpleCode,
    attackFiend,
    attackSquad,
    onTurnStart: (report, caster, allies, team, enemyTeam) =>
        abilityEvent(AbilityApi.events.onTurnStart, report, caster, null, allies, null, team, enemyTeam),
    onTurnEnd: (report, caster, allies, team, enemyTeam) =>
        abilityEvent(AbilityApi.events.onTurnEnd, report, caster, null, allies, null, team, enemyTeam)
};