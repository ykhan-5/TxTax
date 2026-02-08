import { NextRequest, NextResponse } from "next/server";
import { isTexasZip, isValidZipFormat } from "@/lib/utils/validation";
import { calculateSpending } from "@/lib/calculations/per-capita";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ zipcode: string }> }
) {
  const { zipcode } = await params;

  if (!isValidZipFormat(zipcode)) {
    return NextResponse.json(
      { error: "Invalid ZIP code format. Must be 5 digits." },
      { status: 400 }
    );
  }

  if (!isTexasZip(zipcode)) {
    return NextResponse.json(
      { error: "Not a Texas ZIP code. Only Texas ZIPs are supported." },
      { status: 404 }
    );
  }

  try {
    const result = await calculateSpending(zipcode);
    if (!result) {
      return NextResponse.json(
        { error: "No data available for this ZIP code." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(`Error calculating spending for ZIP ${zipcode}:`, error);
    return NextResponse.json(
      { error: "Internal server error. Data files may not be generated yet." },
      { status: 500 }
    );
  }
}
