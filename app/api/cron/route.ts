// app/api/cron/route.ts
import { NextResponse } from "next/server";
import { saveCryptoToDb } from "../../../lib/saveCryptoToDb";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await saveCryptoToDb();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore durante il cronjob:", error);
    return NextResponse.json(
      { error: "Errore durante il cronjob" },
      { status: 500 }
    );
  }
}
