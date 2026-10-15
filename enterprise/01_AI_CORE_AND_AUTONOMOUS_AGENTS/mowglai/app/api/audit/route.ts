import { NextRequest, NextResponse } from "next/server";
import { runAuditEngine } from "@/app/audit/actions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = body?.url;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'url' parameter in JSON payload." },
                { status: 400 }
            );
        }

        const result = await runAuditEngine(url.trim());
        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Internal error running audit";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            { success: false, error: "Provide a 'url' query parameter. Example: /api/audit?url=https://mowglai.com" },
            { status: 400 }
        );
    }

    try {
        const result = await runAuditEngine(url.trim());
        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Internal error running audit";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
