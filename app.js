const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: buildSchema(`
        type Event {
            _id : ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
                        
        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }
    
        type RootMutation {
            createEvent(eventInput: EventInput!): Event
            createUser(userInput: UserInput!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
            
    `),
    rootValue: {
        events: () => {
            return Event.find().then().catch(err => {
                console.log(err);
                throw err;
            });

        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5ea32c1b41bf8621eaf1a5cb'
            });

            let createdEvents;

            return event.save()
                .then( result => {
                    createdEvents = result;
                    return User.findById('5ea32c1b41bf8621eaf1a5cb');
                })
                .then( user => {
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
                    return { ...result._doc, password: null };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });



            return user.save()
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }
    }
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-flywy.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        throw err;
    });

