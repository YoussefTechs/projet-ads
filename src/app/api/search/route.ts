import { NextRequest, NextResponse } from "next/server";
import { instantSearch } from "@/server/search";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`search:${ip}`, { limit: 40, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ results: [] }, { status: 429 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await instantSearch(q);
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "private, max-age=10" } },
  );
}
