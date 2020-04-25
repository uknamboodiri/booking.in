const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');

const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: graphQLSchema,
    rootValue: graphQLResolvers
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-flywy.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        throw err;
    });

