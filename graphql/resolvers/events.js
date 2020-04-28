const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        }
        catch (err) { throw err; }
    },
    createEvent: async (args, req) => {        
        if(!req.isAuthorized){
            throw new Error('Unauthorized');
        }
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date,
                creator: '5ea70861c26caa1de0a9c7c0'
            });

            //save the event
            let savedEvent;
            const result = await event.save();
            savedEvent = transformEvent(result);

            //update user Model
            const creator = await User.findById('5ea70861c26caa1de0a9c7c0');
            if (!creator) {
                throw new Error('User does not exist');
            }

            creator.createdEvents.push(event);
            await creator.save();

            return savedEvent;
        }
        catch (err) { throw err; }
    }
}