import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jadwal = await prisma.jadwalPengangkutan.findMany({
      orderBy: { tanggalAngkut: "asc" },
      include: {
        petugas: true,
        wilayah: true,
        laporan: {
          include: {
            user: { include: { jenisBangunan: true } },
            detail: { include: { jenisSampah: true } },
          },
        },
      },
    });
    return NextResponse.json(jadwal);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
