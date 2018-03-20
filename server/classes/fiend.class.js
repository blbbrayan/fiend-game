module.exports = class {

    constructor(name, size, rarity, level, attr, animations, ability) {
        this.name = name;
        this.rarity = rarity;
        this.level = level;
        this.attribute = attr;
        this.size = size;
        this.animations = animations;
        this.ability = ability;

        this.update();
    }

    static fromUnit(unit, rarity, level, attr){
        this.name = unit.name;
        this.ability = unit.ability;
        this.animations = unit.animations;
        this.size = unit.size;
        this.tags = unit.tags;
        this.rarity = rarity;
        this.level = level;
        this.attribute = attr;
    }

};