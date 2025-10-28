import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users, type User, type NewUser } from "../db/schema.ts";

export async function findUserByGoogleId(
  googleId: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);

  return result[0];
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
}

export async function createUser(userData: NewUser): Promise<User> {
  const result = await db.insert(users).values(userData).returning();

  if (!result[0]) {
    throw new Error("Failed to create user");
  }

  return result[0];
}

export async function findOrCreateUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<User> {
  let user = await findUserByGoogleId(profile.googleId);

  if (user) {
    return user;
  }

  user = await findUserByEmail(profile.email);

  if (user) {
    const updated = await db
      .update(users)
      .set({ googleId: profile.googleId })
      .where(eq(users.id, user.id))
      .returning();

    if (!updated[0]) {
      throw new Error("Failed to update user");
    }

    return updated[0];
  }

  return await createUser({
    googleId: profile.googleId,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
  });
}
