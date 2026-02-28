import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { User } from "./user/index";

export async function initServer() {
  const app = express();

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
  console.log("TYPEDEFS:", typeDefs);
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.get("/", (req, res) => {
    res.json({ message: "Twitter Server is running!" });
  });

  app.listen(8000, () => {
    console.log("Server ready at http://localhost:8000");
    console.log("GraphQL ready at http://localhost:8000/graphql");
  });

  return app;
}