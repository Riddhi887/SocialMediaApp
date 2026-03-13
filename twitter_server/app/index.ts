import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { User } from "./user/index";
import JWTService from "../src/services/jwt";
import { GraphqlContext } from "../src/interfaces";

export async function initServer() {
  const app = express();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, apollo-require-preflight, x-apollo-operation-name"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(bodyParser.json());

  const typeDefs = `#graphql
    ${User.types}
    type Query {
      ${User.queries}
    }
  `;

  const resolvers = {
    Query: {
      ...User.resolvers.queries,
    },
  };

  const server = new ApolloServer<GraphqlContext>({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length).trim()
          : undefined;
        let user = undefined;
        if (token) {
        try {
          user = JWTService.decodeToken(token);
        } catch (err) {
          // Invalid or non-app token (e.g. Google OAuth token) — treat as unauthenticated
          user = undefined;
          }
        }
  return { user };
},
    })
  );

  app.get("/", (_req, res) => {
    res.json({ message: "Twitter Server is running!" });
  });

  return app;
}