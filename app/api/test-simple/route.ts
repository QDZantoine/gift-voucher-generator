import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Test simple - Début");

    const body = await request.json();
    console.log("📋 Données reçues:", JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: "Test simple réussi",
      receivedData: body,
    });
  } catch (error) {
    console.error("❌ Erreur dans le test simple:", error);
    return NextResponse.json(
      { error: "Erreur dans le test simple", details: error.message },
      { status: 500 }
    );
  }
}

