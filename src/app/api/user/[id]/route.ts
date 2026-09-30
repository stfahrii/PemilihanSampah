import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { jenisBangunan: true, wilayah: true },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Only allow safe fields to be updated
    const allowedFields: Record<string, unknown> = {};
    if (body.nama !== undefined)       allowedFields.nama = body.nama;
    if (body.noHp !== undefined)       allowedFields.noHp = body.noHp;
    if (body.alamat !== undefined)     allowedFields.alamat = body.alamat;
    if (body.rt !== undefined)         allowedFields.rt = body.rt;
    if (body.rw !== undefined)         allowedFields.rw = body.rw;
    if (body.fotoProfil !== undefined) allowedFields.fotoProfil = body.fotoProfil;

    const updated = await prisma.user.update({
      where: { id },
      data: allowedFields,
      include: { jenisBangunan: true, wilayah: true },
    });

    const { password: _, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 500 });
  }
}
