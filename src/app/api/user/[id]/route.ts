import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Handle Demo User (Pak Budi)
    if (id === "demo-user-id") {
      try {
        const dbDemo = await prisma.user.findFirst({
          where: { email: { contains: "budi" } },
          include: { jenisBangunan: true, wilayah: true },
        });
        if (dbDemo) {
          const { password: _, ...safeUser } = dbDemo;
          return NextResponse.json(safeUser);
        }
      } catch (_) {}

      return NextResponse.json({
        id: "demo-user-id",
        nama: "Rumah Pak Budi",
        email: "pakbudi.demo@ecosort.id",
        noHp: "081298765432",
        nik: "3171012345670001",
        alamat: "Jl. Bendungan Hilir No. 42",
        rt: "003",
        rw: "001",
        role: "User",
        createdAt: "2026-01-15T08:00:00.000Z",
        jenisBangunan: { namaJenisBangunan: "Rumah" },
        wilayah: { namaWilayah: "Bendungan Hilir", kelurahan: "Benhil", kecamatan: "Tanah Abang" },
      });
    }

    // Handle Demo Admin (Admin Kecamatan)
    if (id === "admin-id") {
      try {
        const dbAdmin = await prisma.user.findFirst({
          where: { role: "Admin" },
          include: { jenisBangunan: true, wilayah: true },
        });
        if (dbAdmin) {
          const { password: _, ...safeUser } = dbAdmin;
          return NextResponse.json(safeUser);
        }
      } catch (_) {}

      return NextResponse.json({
        id: "admin-id",
        nama: "Admin Kecamatan",
        email: "admin@ecosort.id",
        noHp: "081000000000",
        nik: "0000000000000001",
        alamat: "Gedung Camat Senayan Lt. 3",
        rt: "001",
        rw: "001",
        role: "Admin",
        createdAt: "2026-01-01T00:00:00.000Z",
        jenisBangunan: { namaJenisBangunan: "Perkantoran" },
        wilayah: { namaWilayah: "Area GBK", kelurahan: "Gelora", kecamatan: "Tanah Abang" },
      });
    }

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

    // Handle Demo User updates without database error
    if (id === "demo-user-id" || id === "admin-id") {
      return NextResponse.json({
        id,
        nama: body.nama ?? (id === "admin-id" ? "Admin Kecamatan" : "Rumah Pak Budi"),
        email: id === "admin-id" ? "admin@ecosort.id" : "pakbudi.demo@ecosort.id",
        noHp: body.noHp ?? "081298765432",
        nik: "3171012345670001",
        alamat: body.alamat ?? "Jl. Bendungan Hilir No. 42",
        rt: body.rt ?? "003",
        rw: body.rw ?? "001",
        role: id === "admin-id" ? "Admin" : "User",
        fotoProfil: body.fotoProfil,
        createdAt: "2026-01-15T08:00:00.000Z",
        jenisBangunan: { namaJenisBangunan: id === "admin-id" ? "Perkantoran" : "Rumah" },
        wilayah: { namaWilayah: "Bendungan Hilir", kelurahan: "Benhil", kecamatan: "Tanah Abang" },
      });
    }

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
