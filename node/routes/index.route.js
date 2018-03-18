const AbilityApi = require('../api/ability.api');

module.exports = {
    path: '/',
    http: ['get', 'post'][0],
    route: (req, res, q) => {



        res.send(JSON.stringify(q));
    }
};