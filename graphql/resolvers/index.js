const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const transformEvent = (event) => {
    return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
};

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch (err) { throw err; }
}

const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) { throw err; }
}
const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    }
    catch (err) {
        throw err;
    }
}

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
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {

                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            });
        }
        catch (err) { throw err; }
    },
    createEvent: async (args) => {
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
    },
    createUser: async args => {
        try {

            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {                
                throw new Error('User exists already.');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return {
                ...result._doc,
                password: null
            };
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async (args) => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                event: fetchedEvent,
                user: '5ea70861c26caa1de0a9c7c0'
            });
            const result = await booking.save();
            return {
                ...result._doc,
                event: singleEvent.bind(this, booking._doc.event),
                user: user.bind(this, booking._doc.user),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        }
        catch (err) { throw err; }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        }
        catch (err) { throw err; }
    }
}