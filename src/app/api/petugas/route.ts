import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const petugas = await prisma.petugas.findMany({
      orderBy: { namaPetugas: "asc" },
    });
    return NextResponse.json({ petugas });
  } catch (error) {
    console.error("Error fetching petugas:", error);
    return NextResponse.json({ petugas: [] }, { status: 500 });
  }
}
