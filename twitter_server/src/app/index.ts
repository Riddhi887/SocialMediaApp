import express from "express";
import bodyParser, { BodyParser } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5"; 
import { prismaClient } from "../clients/db";

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

export async function initServer() {
  const app = express();

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await graphqlServer.start();

  app.use(bodyParser.json());
    app.use("/graphql", expressMiddleware(graphqlServer));
  return app;
}