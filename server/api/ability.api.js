const fs = require('fs');
const Ability = require('../classes/ability.class');

//data
const dir = __dirname.indexOf('/') !== -1 ? '/' : '\\';
const abilities = __dirname.replace('api', `abilities`);
const abilityFile = '.ability.js';

module.exports = {
    Ability,
    events: {
        onDeath: 'onDeath',
        onMiss: 'onMiss',
        onHit: 'onHit',
        onKill: 'onKill',
        onHitEnemy: 'onHitEnemy',
        onTurnStart: 'onTurnStart',
        onTurnEnd: 'onTurnEnd'
    },
    stats: (health, damage, accuracy) => {return {health: health || 1, damage: damage || 1, accuracy: accuracy || 1}},
    loadAbility: name => {
        if(fs.existsSync(abilities+dir+name+abilityFile))
            return new (require(`../abilities/${name}.ability`))();
    }
};