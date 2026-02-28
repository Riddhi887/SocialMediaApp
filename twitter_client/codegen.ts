
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  schema: "http://localhost:8000/graphql",  //get the schema from server side
  documents: [
    "app/**/*.{tsx,ts}",
    "components/**/*.{tsx,ts}",
    "graphql/**/*.{tsx,ts}",
    "!node_modules/**",
    "!.next/**",
    "!gql/**"
  ],
  
  //generate all the typescript in the frontend
  generates: {  
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
