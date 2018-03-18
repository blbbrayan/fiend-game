module.exports = class {

    constructor(caster, target, type){
        this.caster = caster;
        this.target = target;
        this.type = type;
        this.time = new Date().getTime();
    }

};