import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/hash";

// ── Register ──────────────────────────────────────────────────
interface RegisterUserData {
  nama: string;
  email: string;
  password: string;
  noHp: string;
  nik: string;
  alamat: string;
  rt?: string;
  rw?: string;
  jenisBangunanId: string;
  wilayahId: string;
}

export async function registerUser(data: RegisterUserData) {
  if (await prisma.user.findUnique({ where: { email: data.email } }))
    throw new Error("Email sudah digunakan.");
  if (await prisma.user.findUnique({ where: { noHp: data.noHp } }))
    throw new Error("Nomor HP sudah digunakan.");
  if (await prisma.user.findUnique({ where: { nik: data.nik } }))
    throw new Error("NIK sudah digunakan.");

  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      noHp: data.noHp,
      nik: data.nik,
      alamat: data.alamat,
      rt: data.rt || null,
      rw: data.rw || null,
      jenisBangunanId: data.jenisBangunanId,
      wilayahId: data.wilayahId,
    },
  });
}

// ── Login ─────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { jenisBangunan: true, wilayah: true },
  });

  if (!user) throw new Error("Email atau password salah.");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Email atau password salah.");

  return user;
}

// ── Get dropdown data ─────────────────────────────────────────
export async function getJenisBangunan() {
  return prisma.jenisBangunan.findMany({ orderBy: { namaJenisBangunan: "asc" } });
}

export async function getWilayah() {
  return prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } });
}