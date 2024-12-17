import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "./prisma";

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
