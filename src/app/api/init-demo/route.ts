import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Demo user initialization is disabled. Only 4 core users are available.",
    error: "This feature has been disabled to maintain the 4-user system"
  }, { status: 403 });
}
