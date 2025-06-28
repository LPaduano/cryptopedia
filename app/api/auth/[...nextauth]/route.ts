import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../../lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db("crypto-db");
      const usersCollection = db.collection("users");

      const existingUser = await usersCollection.findOne({ email: user.email });

      if (!existingUser) {
        const insertResult = await usersCollection.insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date(),
        });
        user._id = insertResult.insertedId.toString();
      } else {
        user._id = existingUser._id.toString();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
