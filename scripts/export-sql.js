const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportSql() {
  console.log("Exporting database to SQL...");
  
  let sql = `-- ============================================================
-- DATABASE DUMP: ecosort_senayan_db
-- Tema: Sistem Informasi Pemilahan Sampah Kecamatan Senayan
-- Generated for Submission Assignment (Integrasi RDBMS NextJS)
-- ============================================================

CREATE DATABASE IF NOT EXISTS senayan_waste_db;
USE senayan_waste_db;

-- ------------------------------------------------------------
-- 1. TABEL: JenisBangunan (Master Data)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS "FotoSampah" CASCADE;
DROP TABLE IF EXISTS "JadwalPengangkutan" CASCADE;
DROP TABLE IF EXISTS "DetailPemilahan" CASCADE;
DROP TABLE IF EXISTS "PemilahanSampah" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Petugas" CASCADE;
DROP TABLE IF EXISTS "JenisSampah" CASCADE;
DROP TABLE IF EXISTS "Wilayah" CASCADE;
DROP TABLE IF EXISTS "JenisBangunan" CASCADE;

CREATE TABLE "JenisBangunan" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaJenisBangunan" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "Wilayah" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaWilayah" VARCHAR(255) NOT NULL UNIQUE,
    "kelurahan" VARCHAR(255) NOT NULL,
    "kecamatan" VARCHAR(255) NOT NULL
);

CREATE TABLE "JenisSampah" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaJenis" VARCHAR(255) NOT NULL UNIQUE,
    "deskripsi" TEXT
);

CREATE TABLE "Petugas" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaPetugas" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "noHp" VARCHAR(50) NOT NULL UNIQUE,
    "jabatan" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    "fotoProfil" TEXT
);

CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "noHp" VARCHAR(50) NOT NULL UNIQUE,
    "nik" VARCHAR(50) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" VARCHAR(10),
    "rw" VARCHAR(10),
    "role" VARCHAR(50) NOT NULL DEFAULT 'User',
    "fotoProfil" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenisBangunanId" VARCHAR(36) NOT NULL,
    "wilayahId" VARCHAR(36) NOT NULL,
    CONSTRAINT "fk_user_jenis_bangunan" FOREIGN KEY ("jenisBangunanId") REFERENCES "JenisBangunan"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_user_wilayah" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT
);

CREATE TABLE "PemilahanSampah" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "tanggalLapor" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Menunggu',
    "jamPenjemputan" VARCHAR(100) DEFAULT '08:00 - 11:00 (Sesi Pagi)',
    "userId" VARCHAR(36) NOT NULL,
    "petugasId" VARCHAR(36),
    "jenisSampahId" VARCHAR(36),
    "wilayahId" VARCHAR(36),
    CONSTRAINT "fk_laporan_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_laporan_petugas" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE SET NULL,
    CONSTRAINT "fk_laporan_jenis_sampah" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_laporan_wilayah" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT
);

CREATE TABLE "FotoSampah" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaFile" VARCHAR(255) NOT NULL,
    "pathFile" TEXT NOT NULL,
    "tanggalUpload" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laporanId" VARCHAR(36) NOT NULL UNIQUE,
    CONSTRAINT "fk_foto_laporan" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE
);

CREATE TABLE "DetailPemilahan" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "berat" DECIMAL(10,2) NOT NULL,
    "keterangan" TEXT,
    "laporanId" VARCHAR(36) NOT NULL,
    "jenisSampahId" VARCHAR(36) NOT NULL,
    CONSTRAINT "fk_detail_laporan" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_detail_jenis_sampah" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT,
    CONSTRAINT "unique_laporan_jenis" UNIQUE ("laporanId", "jenisSampahId")
);

CREATE TABLE "JadwalPengangkutan" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "tanggalAngkut" DATE NOT NULL,
    "jamAngkut" TIME NOT NULL,
    "statusPengangkutan" VARCHAR(50) NOT NULL DEFAULT 'Terjadwal',
    "laporanId" VARCHAR(36) NOT NULL UNIQUE,
    "petugasId" VARCHAR(36) NOT NULL,
    "wilayahId" VARCHAR(36) NOT NULL,
    CONSTRAINT "fk_jadwal_laporan" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_jadwal_petugas" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_jadwal_wilayah" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT
);

-- ============================================================
-- DUMP DATA
-- ============================================================
`;

  // Fetch data
  const jenisBangunan = await prisma.jenisBangunan.findMany();
  for (const item of jenisBangunan) {
    sql += `INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('${item.id}', '${item.namaJenisBangunan.replace(/'/g, "''")}');\n`;
  }

  const wilayah = await prisma.wilayah.findMany();
  for (const item of wilayah) {
    sql += `INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('${item.id}', '${item.namaWilayah.replace(/'/g, "''")}', '${item.kelurahan.replace(/'/g, "''")}', '${item.kecamatan.replace(/'/g, "''")}');\n`;
  }

  const jenisSampah = await prisma.jenisSampah.findMany();
  for (const item of jenisSampah) {
    sql += `INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('${item.id}', '${item.namaJenis.replace(/'/g, "''")}', ${item.deskripsi ? `'${item.deskripsi.replace(/'/g, "''")}'` : 'NULL'});\n`;
  }

  const petugas = await prisma.petugas.findMany();
  for (const item of petugas) {
    sql += `INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('${item.id}', '${item.namaPetugas.replace(/'/g, "''")}', '${item.email}', '${item.noHp}', '${item.jabatan}', '${item.status}', ${item.fotoProfil ? `'${item.fotoProfil}'` : 'NULL'});\n`;
  }

  const users = await prisma.user.findMany();
  for (const item of users) {
    sql += `INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('${item.id}', '${item.nama.replace(/'/g, "''")}', '${item.email}', '${item.noHp}', '${item.nik}', '${item.password}', '${item.alamat.replace(/'/g, "''")}', '${item.rt || ''}', '${item.rw || ''}', '${item.role}', ${item.fotoProfil ? `'${item.fotoProfil}'` : 'NULL'}, '${item.jenisBangunanId}', '${item.wilayahId}');\n`;
  }

  const laporan = await prisma.pemilahanSampah.findMany();
  for (const item of laporan) {
    sql += `INSERT INTO "PemilahanSampah" ("id", "tanggalLapor", "status", "jamPenjemputan", "userId", "petugasId", "jenisSampahId", "wilayahId") VALUES ('${item.id}', '${item.tanggalLapor.toISOString()}', '${item.status}', '${item.jamPenjemputan || ''}', '${item.userId}', ${item.petugasId ? `'${item.petugasId}'` : 'NULL'}, ${item.jenisSampahId ? `'${item.jenisSampahId}'` : 'NULL'}, ${item.wilayahId ? `'${item.wilayahId}'` : 'NULL'});\n`;
  }

  const foto = await prisma.fotoSampah.findMany();
  for (const item of foto) {
    sql += `INSERT INTO "FotoSampah" ("id", "namaFile", "pathFile", "laporanId") VALUES ('${item.id}', '${item.namaFile.replace(/'/g, "''")}', '${item.pathFile}', '${item.laporanId}');\n`;
  }

  const detail = await prisma.detailPemilahan.findMany();
  for (const item of detail) {
    sql += `INSERT INTO "DetailPemilahan" ("id", "berat", "keterangan", "laporanId", "jenisSampahId") VALUES ('${item.id}', ${item.berat}, ${item.keterangan ? `'${item.keterangan.replace(/'/g, "''")}'` : 'NULL'}, '${item.laporanId}', '${item.jenisSampahId}');\n`;
  }

  const jadwal = await prisma.jadwalPengangkutan.findMany();
  for (const item of jadwal) {
    sql += `INSERT INTO "JadwalPengangkutan" ("id", "tanggalAngkut", "jamAngkut", "statusPengangkutan", "laporanId", "petugasId", "wilayahId") VALUES ('${item.id}', '${item.tanggalAngkut.toISOString().split('T')[0]}', '${item.jamAngkut.toISOString().split('T')[1]}', '${item.statusPengangkutan}', '${item.laporanId}', '${item.petugasId}', '${item.wilayahId}');\n`;
  }

  const targetPath = path.join(__dirname, '..', 'database_ecosort_senayan.sql');
  fs.writeFileSync(targetPath, sql, 'utf8');
  console.log(`Export complete: ${targetPath}`);
}

exportSql().catch(console.error).finally(() => prisma.$disconnect());
