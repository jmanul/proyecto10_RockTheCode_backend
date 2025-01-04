
const upSeed = require('./logic');
const Event = require('../../api/models/events');
const eventDate = require('../../data/events');

upSeed(Event, eventDate, 'eventos');