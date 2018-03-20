'use strict';
//libs
const
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    cors = require('cors'),
    expressValidator = require('express-validator'),
    fs = require('fs');

//config libs
const config = [
    express.static(path.join(__dirname, 'public')),
    cors(),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    expressValidator()
].forEach(option=>app.use(option));

//loads all route files in route folder
let routes = [];
fs.readdirSync(__dirname + '/routes').forEach(file=> routes.push(require(__dirname + '/routes/' + file)));

//load each route
routes.forEach(route =>
    app.route(route.path)[route.http]((req, res)=>route.route(req, res, {params : req.query, body: req.body}))
);

//start Server
const server = app.listen(80, ()=>console.log(`Listening to port ${server.address().port}`));