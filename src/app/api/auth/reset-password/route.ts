import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const { email, nik, newPassword } = await req.json();

    if (!email || !nik || !newPassword) {
      return NextResponse.json({ success: false, error: "Email, NIK, dan password baru harus diisi." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password minimal 8 karakter." }, { status: 400 });
    }

    // Find user by email + NIK for identity verification
    const user = await prisma.user.findFirst({
      where: { email, nik },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau NIK tidak cocok. Pastikan data Anda benar." },
        { status: 404 }
      );
    }

    // Hash new password
    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: "Password berhasil diubah. Silakan login ulang." });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
