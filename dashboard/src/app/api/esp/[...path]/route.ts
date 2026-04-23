import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const ip = searchParams.get("ip");

  if (!ip) {
    return NextResponse.json({ error: "No IP provided" }, { status: 400 });
  }
  
  const pathParams = await params;

  const espPath = pathParams.path.join("/");
  const url = `http://${ip}/${espPath}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      // Short timeout for local esp
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `ESP returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to connect to ESP32", details: err.message },
      { status: 500 }
    );
  }
}
