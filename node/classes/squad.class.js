module.exports = class{

    constructor(unit, team) {
        this.fiends = [];
        for (let i = 0; i < unit.size; i++)
            this.fiends.push(Object.assign({team: team, unit}));
        this.baseHealth = this.unit().health;
        this.baseDamage = this.unit().damage;
        this.baseAccuracy = this.unit().accuracy;
        this.team = team;
    }

    unit(){
        return this.fiends[0];
    }

};