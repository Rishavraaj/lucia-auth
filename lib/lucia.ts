import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "./prisma";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(db.session, db.user);

//this lucia instance is used to create users and sessions
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "lucia",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUser = async () => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    return null;
  }

  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      //refresh the session cookie
      const sessionCookie = await lucia.createSessionCookie(session.id);
      (await cookies()).set(
        lucia.sessionCookieName,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      //delete the session cookie
      const blankSessionCookie = await lucia.createBlankSessionCookie();
      (await cookies()).set(
        lucia.sessionCookieName,
        blankSessionCookie.value,
        blankSessionCookie.attributes
      );
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  const dbUser = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return dbUser;
};
