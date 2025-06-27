import { NextResponse } from "next/server";
import { seedCryptoDescriptions } from "../../../lib/fetchCryptosDescription";
export async function GET() {
  await seedCryptoDescriptions(); // chiami lo stesso codice qui
  return NextResponse.json({ success: true });
}
