// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../../lib/mongodb";

// Configurazione di NextAuth separata
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Callback per il signIn, in cui viene aggiunto l'ID nel token
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("crypto-db");
        const usersCollection = db.collection("users");

        // Verifica se l'utente esiste nel DB tramite email
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          // Se l'utente non esiste, crealo
          const insertResult = await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });

          // Aggiungi _id all'oggetto user
          user._id = insertResult.insertedId.toString(); // Conversione in stringa
        } else {
          // Se l'utente esiste, assegna l'ID esistente
          user._id = existingUser._id.toString(); // Conversione in stringa
        }

        console.log("User ID in signIn callback:", user._id); // Verifica che l'ID venga aggiunto

        // Restituisci true per completare il login
        return true;
      } catch (error) {
        console.error("Errore nel signIn callback:", error);
        return false;
      }
    },

    // Callback per il jwt che aggiunge l'ID dell'utente al token
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString(); // Aggiungi l'ID al token
      }
      return token; // Restituisci il token con l'ID
    },

    // Callback per la sessione che estrae l'ID dal token
    async session({ session, token }) {
      if (token && token.id) {
        session.user.id = token.id; // Usa l'ID dal token per la sessione
        console.log("Session user ID:", session.user.id); // Logga l'ID della sessione
      } else {
        console.log("Token ID is undefined in session callback");
      }

      return session; // Restituisci la sessione aggiornata
    },
  },
};

// Handler che gestisce GET e POST per NextAuth
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
