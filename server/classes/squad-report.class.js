module.exports = class {

    constructor(){
        this.hits = 0;
        this.damage = 0;
        this.enemySquadKilled = false;
        this.reports = [];
        this.time = new Date().getTime();
    }

    add(report){
        this.reports.push(report);
        if(report.hit) {
            this.hits += report.hits;
            this.damage += report.damage;
        }
        if(report.abilityReports)
            report.abilityReports.forEach(abilityReport=>abilityReport.attacks.forEach(abilityAttackReport=>{
                if(abilityAttackReport.hit) {
                    this.hits += abilityAttackReport.hits;
                    this.damage += abilityAttackReport.damage;
                }
            }));
    }

};