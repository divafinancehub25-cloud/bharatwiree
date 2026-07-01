import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

// This endpoint runs the content pipeline. A scheduler (cron) can call it later;
// for now it also lets us test the flow. GET for easy manual testing.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  try {
    const result = await runPipeline();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
