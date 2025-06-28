import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions"; // aggiorna il path se necessario

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
