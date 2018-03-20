let Report = require('./report.class');
module.exports = class extends Report{

    constructor(caster, target, roll, hit, type) {
        super(caster, target, type || 'attack');
        this.roll = roll;
        this.hit = hit;
        this.enemyKilled = false;
        this.damage = 0;
        this.abilityReports = [];
    }

};