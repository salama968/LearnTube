import express from "express";
import { db } from "./db/index.ts";
import * as schema from "./db/schema.ts";
const app = express();

app.get("/test-db", async (req, res) => {
  try {
    // A simple query to test the connection
    const result = await db.select().from(schema.users);
    res.json({ status: "ok", db_test: result });
  } catch (e) {
    res.status(500).json({ status: "error", e });
  }
});

export { app };
