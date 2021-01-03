const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');

// Connect DB
connectDB();

//Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //console.log(req.headers['authorization']);
    const token = req.headers['authorization'] || '';
    if (token) {
      try {
        const usuario = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.SECRET
        );
        return {
          usuario
        };
      } catch (error) {
        console.log('Hubo un error');
        console.log(error);
      }
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);
});
