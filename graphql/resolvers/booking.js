const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { tranformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return tranformBooking(booking);
            });
        }
        catch (err) { throw err; }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                event: fetchedEvent,
                user: '5ea70861c26caa1de0a9c7c0'
            });
            const result = await booking.save();
            return tranformBooking(result);
        }
        catch (err) { throw err; }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        }
        catch (err) { throw err; }
    }
}