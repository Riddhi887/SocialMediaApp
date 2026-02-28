import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { User } from "./user/index";
import cors from "cors";

export async function initServer() {
  const app = express();

  const corsOptions: cors.CorsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

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

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // CORS for graphql route (important)
  app.options("/graphql", cors(corsOptions));
  app.use("/graphql", cors(corsOptions), expressMiddleware(server));

  app.get("/", (_req, res) => {
    res.json({ message: "Twitter Server is running!" });
  });

  app.listen(8000, () => {
    console.log("Server ready at http://localhost:8000");
    console.log("GraphQL ready at http://localhost:8000/graphql");
  });

  return app;
}