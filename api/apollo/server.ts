import { ApolloServer } from "apollo-server-express";
import { buildSchemaSync } from "type-graphql";

import * as resolvers from "../resolvers";

export const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [...Object.values(resolvers)],
    emitSchemaFile: true,
    validate: {
      validationError: {
        value: false,
      },
    },
  }),
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  introspection: true,
  debug: process.env.NODE_ENV !== "production",
});
