"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = initServer;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
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
async function initServer() {
    const app = (0, express_1.default)();
    const graphqlServer = new server_1.ApolloServer({
        typeDefs,
        resolvers,
    });
    await graphqlServer.start();
    app.use(body_parser_1.default.json());
    app.use("/graphql", (0, express5_1.expressMiddleware)(graphqlServer));
    return app;
}
