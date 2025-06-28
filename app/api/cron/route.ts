// import { NextResponse } from "next/server";
// import { saveCryptoToDb } from "../../../lib/saveCryptoToDb";

// export async function GET(req: Request) {
//   const auth = req.headers.get("Authorization");

//   if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   try {
//     await saveCryptoToDb();
//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("Errore cron job:", err);
//     return new NextResponse("Errore interno", { status: 500 });
//   }
// }
