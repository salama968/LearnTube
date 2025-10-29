import { sql } from "drizzle-orm";
import { db } from "./index.ts";

async function applyMigration() {
  try {
    console.log("Dropping unique constraint on videos.youtube_video_id...");
    await db.execute(
      sql`ALTER TABLE "videos" DROP CONSTRAINT IF EXISTS "videos_youtube_video_id_unique"`
    );

    console.log("Dropping unique constraint on courses.youtube_playlist_id...");
    await db.execute(
      sql`ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_youtube_playlist_id_unique"`
    );

    console.log("Migration applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
