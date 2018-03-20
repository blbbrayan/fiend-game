const ReportApi = require('../api/report.api');
const AbilityApi = require('../api/ability.api');
module.exports = class extends AbilityApi.Ability {

    constructor() {
        super('undying', AbilityApi.events.onDeath, AbilityApi.stats(.8, .8, 0), 'onDeath this unit revives with 1 health.');
    }

    run(caster, target, allies, enemies, team, enemyTeam) {
        caster.health = 1;
        caster.ability = null;
        return new ReportApi.AbilityReport(caster, null, this)
            .setDesc('Skeleton activates undying. Skeleton\'s health is set to 1 instead of dying.')
    }

};