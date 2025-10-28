import express from "express";
import session from "express-session";
import passport from "passport";
import { db } from "./db/index.ts";
import * as schema from "./db/schema.ts";
import { configurePassport } from "./config/passport.ts";
import authRoutes from "./routes/auth.routes.ts";
import courseRoutes from "./routes/course.routes.ts";

const app = express();

configurePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);

export { app };
