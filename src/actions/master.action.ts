"use server";

import { prisma } from "@/lib/prisma";

// ── CRUD Jenis Bangunan ───────────────────────────────────────
export async function getJenisBangunanList() {
  return prisma.jenisBangunan.findMany({ orderBy: { namaJenisBangunan: "asc" } });
}

export async function createJenisBangunanAction(nama: string) {
  try {
    if (!nama.trim()) throw new Error("Nama jenis bangunan wajib diisi.");
    await prisma.jenisBangunan.create({ data: { namaJenisBangunan: nama.trim() } });
    return { success: true, message: "Jenis bangunan berhasil ditambahkan!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan." };
  }
}

export async function updateJenisBangunanAction(id: string, nama: string) {
  try {
    if (!nama.trim()) throw new Error("Nama jenis bangunan wajib diisi.");
    await prisma.jenisBangunan.update({ where: { id }, data: { namaJenisBangunan: nama.trim() } });
    return { success: true, message: "Jenis bangunan berhasil diperbarui!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui." };
  }
}

export async function deleteJenisBangunanAction(id: string) {
  try {
    await prisma.jenisBangunan.delete({ where: { id } });
    return { success: true, message: "Jenis bangunan berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus! Data masih digunakan oleh user." };
  }
}

// ── CRUD Wilayah ──────────────────────────────────────────────
export async function getWilayahList() {
  return prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } });
}

export async function createWilayahAction(namaWilayah: string, kelurahan: string, kecamatan: string) {
  try {
    if (!namaWilayah || !kelurahan || !kecamatan) throw new Error("Semua field wajib diisi.");
    await prisma.wilayah.create({ data: { namaWilayah, kelurahan, kecamatan } });
    return { success: true, message: "Wilayah berhasil ditambahkan!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan." };
  }
}

export async function updateWilayahAction(id: string, namaWilayah: string, kelurahan: string, kecamatan: string) {
  try {
    if (!namaWilayah || !kelurahan || !kecamatan) throw new Error("Semua field wajib diisi.");
    await prisma.wilayah.update({ where: { id }, data: { namaWilayah, kelurahan, kecamatan } });
    return { success: true, message: "Wilayah berhasil diperbarui!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui." };
  }
}

export async function deleteWilayahAction(id: string) {
  try {
    await prisma.wilayah.delete({ where: { id } });
    return { success: true, message: "Wilayah berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus! Data masih digunakan." };
  }
}

// ── CRUD Jenis Sampah ─────────────────────────────────────────
export async function getJenisSampahList() {
  return prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } });
}

export async function createJenisSampahAction(namaJenis: string, deskripsi?: string) {
  try {
    if (!namaJenis) throw new Error("Nama jenis sampah wajib diisi.");
    await prisma.jenisSampah.create({ data: { namaJenis, deskripsi: deskripsi || null } });
    return { success: true, message: "Jenis sampah berhasil ditambahkan!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan." };
  }
}

export async function updateJenisSampahAction(id: string, namaJenis: string, deskripsi?: string) {
  try {
    if (!namaJenis) throw new Error("Nama jenis sampah wajib diisi.");
    await prisma.jenisSampah.update({ where: { id }, data: { namaJenis, deskripsi: deskripsi || null } });
    return { success: true, message: "Jenis sampah berhasil diperbarui!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui." };
  }
}

export async function deleteJenisSampahAction(id: string) {
  try {
    await prisma.jenisSampah.delete({ where: { id } });
    return { success: true, message: "Jenis sampah berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus! Data masih digunakan dalam laporan (onDelete: Restrict)." };
  }
}

// ── CRUD Petugas ──────────────────────────────────────────────
export async function createPetugasAction(namaPetugas: string, email: string, noHp: string, jabatan: string, fotoProfil?: string) {
  try {
    if (!namaPetugas || !email || !noHp || !jabatan) throw new Error("Semua field wajib diisi.");
    await prisma.petugas.create({ data: { namaPetugas, email, noHp, jabatan, status: "Aktif", fotoProfil: fotoProfil || null } });
    return { success: true, message: "Petugas berhasil ditambahkan!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan." };
  }
}

export async function updatePetugasAction(id: string, namaPetugas: string, email: string, noHp: string, jabatan: string, status: string, fotoProfil?: string) {
  try {
    if (!namaPetugas || !email || !noHp || !jabatan) throw new Error("Semua field wajib diisi.");
    const updateData: Record<string, unknown> = { namaPetugas, email, noHp, jabatan, status };
    if (fotoProfil !== undefined) updateData.fotoProfil = fotoProfil;
    await prisma.petugas.update({ where: { id }, data: updateData });
    return { success: true, message: "Petugas berhasil diperbarui!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui." };
  }
}

export async function deletePetugasAction(id: string) {
  try {
    await prisma.petugas.delete({ where: { id } });
    return { success: true, message: "Petugas berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus! Petugas masih memiliki penugasan." };
  }
}

// ── CRUD User ─────────────────────────────────────────────────
export async function getUsersList() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { jenisBangunan: true, wilayah: true },
  });
}

export async function updateUserAction(id: string, nama: string, email: string, noHp: string, nik: string) {
  try {
    if (!nama || !email || !noHp || !nik) throw new Error("Semua field wajib diisi.");
    await prisma.user.update({ where: { id }, data: { nama, email, noHp, nik } });
    return { success: true, message: "Data pengguna berhasil diperbarui!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui pengguna." };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true, message: "User berhasil dihapus (laporan user otomatis terhapus via Cascade)." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menghapus user." };
  }
}
