const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                }
            });
        })
        .catch(err => {
            throw err;
        });
}

const user = (userId) => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                password: null,
                createdEvents: events.bind(this,user._doc.createdEvents)
            };
        })
        .catch((err) => {
            throw err
        });
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        creator: user.bind(this, event._doc.creator) //store user instead
                    }
                })
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
            creator: '5ea34470af68fc328e934a22'
        });

        let createdEvents;

        return event.save()
            .then(result => {
                createdEvents = {
                    ...result._doc,
                    creator: user.bind(this,result.creator)
                };
                return User.findById('5ea34470af68fc328e934a22');
            })
            .then(user => {
                if (!user) {
                    throw new Error('User does not exist');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvents;
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already');
                }
                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPassword => {
                return user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
            })
            .then(user => {
                return user.save();
            })
            .then(result => {
                return { ...result._doc, 
                    password: null                    
                 };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }
}