import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      isSubscribed: boolean;
      promptCount: number;
      image: string;
      lastReset: DateTime
    };
  }

  interface User {
    id: string;
    email: string;
    isSubscribed: boolean;
    promptCount: number
  }
}
