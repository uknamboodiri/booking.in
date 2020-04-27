const authResolver = require('./auth');
const bookingResolver = require('./booking');
const eventsResolver = require('./events');

const rootResolvers = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver
}

module.exports = rootResolvers;