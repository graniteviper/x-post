import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isSubscribed = user.isSubscribed ?? false;
        session.user.promptCount = user.promptCount ?? 0;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };



















// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import { prisma } from "@/lib/prisma";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   session: {
//     strategy: "database",
//   },
//   callbacks: {
//     async session({ session, user }: any) {
//       if (session.user) {
//         session.user.id = user.id;
//         session.user.isSubscribed = user.isSubscribed ?? false;
//         session.user.promptCount = user.promptCount ?? 0;
//       }
//       return session;
//     },
//   },
// };
