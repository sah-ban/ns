import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    if (!name) {
      return NextResponse.json({ error: "Missing ENS or address" }, { status: 400 });
    }

    // Build ENSData URL — you can add ?farcaster=true or ?expiry=true
    const url = `https://ensdata.net/${encodeURIComponent(name)}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "ens-client" },
      next: { revalidate: 0 }, // always fresh
    });

    if (!res.ok) {
      return NextResponse.json({ error: "ENS not found" }, { status: 404 });
    }

    const data = await res.json();

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
