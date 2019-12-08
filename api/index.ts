import "dotenv/config";
import "reflect-metadata";
import "./db";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { apolloServer } from "./apollo/server";
import { ChartsPrefix, ChartsRouter } from "./routes/charts";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "15mb" }));

app.use("/api" + ChartsPrefix, ChartsRouter);

apolloServer.applyMiddleware({
  app,
  path: "/api/graphql",
});

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  app.listen(
    {
      port,
    },
    () => {
      process.send?.("ready");
      console.log(
        `🚀 API Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
      );
    }
  );
}
