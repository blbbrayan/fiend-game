let Report = require('./report.class');
module.exports = class extends Report{

    constructor(caster, target, ability) {
        super(caster, target, 'ability');
        this.ability = ability;
        this.attacks = [];
    }

    setDesc(desc) {
        this.desc = desc;
        return this;
    }

};