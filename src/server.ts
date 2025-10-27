import express from "express";
import { app } from "./app.ts";

app.listen(3000, () => {
  console.log(`server is running on port ${3000}`);
});
