import {
  boolean,
  date,
  integer,
  text,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  describtion: text("describtion"),
  thumbnailUrl: text("thumbnail_url"),
  youtubePlaylistId: varchar("youtube_playlist_id", { length: 255 }).unique(),
  totalDurationSeconds: integer("total_duration_second").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  coursesId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  youtubeVideoId: varchar("youtube_video_id", { length: 255 })
    .notNull()
    .unique(),
  title: text("title").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  order: integer("order").default(0),
});

export const progress = pgTable(
  "progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    watchedSeconds: integer("watched_seconds").default(0).notNull(),
    completed: boolean("completed").default(false).notNull(),
    lastWatchedAt: timestamp("last_watched_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.videoId] })]
);

export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  watchedSeconds: integer("watched_seconds").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const dailyActivity = pgTable(
  "daily_activity",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    totalSeconds: integer("total_seconds").default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.date] })]
);

export const courseProgress = pgTable(
  "course_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    coursesId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    totalWatchedSeconds: integer("total_watched_seconds").default(0).notNull(),
    completedVideos: integer("completed_videos").default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.coursesId] })]
);

//////----//////
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  progress: many(progress),
  userActivity: many(userActivity),
  dailyActivity: many(dailyActivity),
  courseProgress: many(courseProgress),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  videos: many(videos),
  courseProgress: many(courseProgress),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  course: one(courses, {
    fields: [videos.coursesId],
    references: [courses.id],
  }),
  progress: many(progress),
  userActivity: many(userActivity),
}));
