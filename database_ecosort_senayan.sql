-- ============================================================
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
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('67223ebb-417c-4467-a5a0-4c57fd98af00', 'Rumah');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('391c7e72-5345-470c-a348-b2db02b080f4', 'Gedung');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('dfbce0da-fae5-4ed1-9ac6-448ba0b15d38', 'Pabrik');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('ccc5797b-1947-4cac-82cd-bc18af53c3e9', 'Rumah Sakit');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('f9e44c00-e80c-4748-9521-22b867cd845d', 'Hotel');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('ecf56e41-e534-4e9c-b086-c4566d81e50f', 'Mall');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('24631bfe-549f-4228-8cd6-cbfeffeb192e', 'Sekolah');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('03c38555-7571-46a1-b6bb-688bb4bc8df2', 'Perkantoran');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('a3247fd6-3ab3-4e1f-8747-9582b605105f', 'Tempat Ibadah');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('abc725cf-16d5-46b7-afd2-2c1fbb304280', 'Minimarket');
INSERT INTO "JenisBangunan" ("id", "namaJenisBangunan") VALUES ('c1b22068-0e70-43ff-9a8e-72cdecc3da9c', 'Bangunan Lainnya');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('18b84959-da71-4646-8317-ef277deb9902', 'RW 01', 'Senayan', 'Kebayoran Baru');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('a6b11db6-c71d-4070-8b39-d59adad1cd29', 'RW 02', 'Senayan', 'Kebayoran Baru');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('2d1121cb-a566-4da2-b613-f403b086c516', 'RW 03', 'Senayan', 'Kebayoran Baru');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('c61b2919-9a40-43fb-86b7-2fdeee714d3c', 'RW 04', 'Senayan', 'Kebayoran Baru');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('3cd860a3-bc19-4c90-880b-679125e5e0ed', 'Area GBK', 'Gelora', 'Tanah Abang');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('ec746bdb-5f66-45f6-9d41-6adb95129e4c', 'Komplek DPR', 'Gelora', 'Tanah Abang');
INSERT INTO "Wilayah" ("id", "namaWilayah", "kelurahan", "kecamatan") VALUES ('40f1a07b-4e56-48c1-884a-80c4b2da71d5', 'Bendungan Hilir', 'Benhil', 'Tanah Abang');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('528af5a5-94a7-4add-b9b0-e59e63219d1b', 'Organik', 'Sampah mudah terurai seperti sisa makanan, dedaunan');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('a2667b30-4ec4-4c36-9b3b-4342fa67caa2', 'Anorganik', 'Plastik, kaca, logam, kertas');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('609ec15f-4908-4910-98b9-97c686ce5366', 'B3', 'Bahan berbahaya dan beracun');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('286e8961-258a-4f1c-8697-639f5b2540b0', 'Residu', 'Sampah yang tidak dapat didaur ulang');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('062b79f2-ebf9-433d-9f88-ba5a83ea7865', 'Elektronik', 'Sampah peralatan elektronik');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('f0cac20b-ad98-4f6a-a581-2e146b88817f', 'Medis', 'Limbah rumah sakit dan fasilitas kesehatan');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('c3a200fa-bea0-48d6-893d-3e93580be2ab', 'Industri', 'Limbah sisa proses produksi pabrik');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('060a6c80-b597-4951-8255-c3cef0b9310c', 'Komersial', 'Limbah dari kegiatan usaha dan perdagangan');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('189aa1e6-0f8a-452f-b967-5c159c1eb35a', 'Pertanian', 'Limbah dari kegiatan pertanian dan perkebunan');
INSERT INTO "JenisSampah" ("id", "namaJenis", "deskripsi") VALUES ('6ba84697-50e4-48e1-8f9f-b7c7e7243464', 'Konstruksi', 'Puing dan sisa material bangunan');
INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('4c1ef30c-23c2-4084-8f19-7a637d9b50d6', 'Anjas Ardiansyah', 'anjas@senayan.go.id', '081234567801', 'Koordinator', 'Aktif', '/images/petugas/petugas-1787275236532-uevfl299a2o.jpg');
INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('bd4b76f7-dd00-45dd-902d-5a75053ff059', 'Revansyah Putra', 'rev@senayan.go.id', '081234567803', 'Pengemudi', 'Aktif', '/images/petugas/petugas-1787275032753-eb5cj0psn8s.jpeg');
INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('b8a5ba7f-7c11-44a2-823c-56506c5e522f', 'Dimas Wangsa', 'wangsa@senayan.go.id', '081234567804', 'Petugas Lapangan', 'Aktif', '/images/petugas/petugas-1787275152273-gs0joqbbqrp.jpeg');
INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('8ae94b6c-a1fb-4243-9f64-e3f7f6b68ae2', 'Muhammad Raafi', 'raafi@senayan.go.id', '081234567805', 'Admin', 'Aktif', '/images/petugas/petugas-1787275196648-asdg796drnn.jpeg');
INSERT INTO "Petugas" ("id", "namaPetugas", "email", "noHp", "jabatan", "status", "fotoProfil") VALUES ('b48e7ad0-0283-4dc9-9fb6-7bc6b441bd79', 'Maulidya Niftaul', 'lidya@senayan.go.id', '081234567802', 'Petugas Lapangan', 'Aktif', '/images/petugas/petugas-1787275352723-xtb392zbi29.jpeg');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('8c85af1d-77ee-4f33-9767-0a985bcbd02e', 'Neiman Timora', 'neiman@gmail.com', '081098765432', '1615141312111098', '$2b$10$Re7Dvpimj9v89War30otFO/SzQTf55wAvNaTT5cpgpwItJ6eZxZ0W', 'Jl. Mawar No. 3', '007', '002', 'User', NULL, '391c7e72-5345-470c-a348-b2db02b080f4', 'ec746bdb-5f66-45f6-9d41-6adb95129e4c');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('c98cf351-c130-4136-b2b1-68e32b4f7a0a', 'Humaira Yumna', 'rara@gmail.com', '08131522483', '123456789123456', '$2b$10$ArzU.oJQSBg4qLjcLjVBL.IOAt9pgvNHC2zlglRUzh6eliSYBK2IG', 'Jl. Merdeka No. 19', '003', '003', 'User', NULL, '67223ebb-417c-4467-a5a0-4c57fd98af00', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('68c1e793-2464-41bb-b94c-66361ec4c7fa', 'Fahri Hasan Mustofa', 'fahri@gmail.com', '081513522483', '1234567890123456', '$2b$10$mVzTv11Pa0PEaJ78QKnEf.puwVkp9NS64Crn/BOWt2TD.KsOMPDJe', 'Jl. Melati No. 1', '008', '001', 'User', '/uploads/avatars/avatar-1786123630683-6ev1kl3pv0y.jpeg', 'a3247fd6-3ab3-4e1f-8747-9582b605105f', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('cd54b7b0-d453-46c6-9c2c-a511ee9e49f6', 'Rafael', 'rafael@gmail.con', '085647382910', '5647382910293847', '$2b$10$1K1ueRsQeri/3rlmEgIq5Oy.7UNJ.gB0pbrzbqOeCX/IuD21VhAu.', 'Jl. Anggrek No. 4', '005', '001', 'User', NULL, 'ccc5797b-1947-4cac-82cd-bc18af53c3e9', '40f1a07b-4e56-48c1-884a-80c4b2da71d5');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('e40d2921-a6e6-4359-9480-58341ff60469', 'Admin Kecamatan', 'admin@ecosort.id', '081000000000', '0000000000000001', '$2b$10$zti0aFq/jvYpnPavTIEHzOJfDO9UQ0pKwmn3frUorEYgeft8/ZNNu', 'Jl. Admin No. 1, Senayan', '', '', 'Admin', NULL, '03c38555-7571-46a1-b6bb-688bb4bc8df2', 'ec746bdb-5f66-45f6-9d41-6adb95129e4c');
INSERT INTO "User" ("id", "nama", "email", "noHp", "nik", "password", "alamat", "rt", "rw", "role", "fotoProfil", "jenisBangunanId", "wilayahId") VALUES ('5ad00b44-d878-4bce-ab74-bd562972703a', 'Sultan Rasyid Abidin', 'rasyid@gmail.com', '081928374651', '0081928374655564738', '$2b$10$XzcDOyk2BRLMeIh.fkdhIubDquDMwlnsEYPKXpoFYMhwD0yVxqlW.', 'Jl. Merdeka No. 19', '010', '005', 'User', NULL, '67223ebb-417c-4467-a5a0-4c57fd98af00', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "PemilahanSampah" ("id", "tanggalLapor", "status", "jamPenjemputan", "userId", "petugasId", "jenisSampahId", "wilayahId") VALUES ('edcc11aa-f1dc-471b-bc0c-37e2f77febf3', '2026-08-03T06:22:29.031Z', 'Menunggu', '08:00 - 11:00 (Sesi Pagi)', 'c98cf351-c130-4136-b2b1-68e32b4f7a0a', NULL, '189aa1e6-0f8a-452f-b967-5c159c1eb35a', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "PemilahanSampah" ("id", "tanggalLapor", "status", "jamPenjemputan", "userId", "petugasId", "jenisSampahId", "wilayahId") VALUES ('07b32597-496b-4043-92c4-85a986aafed0', '2026-08-03T06:16:05.640Z', 'Selesai', '08:00 - 11:00 (Sesi Pagi)', '8c85af1d-77ee-4f33-9767-0a985bcbd02e', '4c1ef30c-23c2-4084-8f19-7a637d9b50d6', '062b79f2-ebf9-433d-9f88-ba5a83ea7865', 'ec746bdb-5f66-45f6-9d41-6adb95129e4c');
INSERT INTO "PemilahanSampah" ("id", "tanggalLapor", "status", "jamPenjemputan", "userId", "petugasId", "jenisSampahId", "wilayahId") VALUES ('a2fbb1ee-6c04-4da5-9ef8-e66c118290bd', '2026-08-03T06:12:59.201Z', 'Diproses', '08:00 - 11:00 (Sesi Pagi)', '68c1e793-2464-41bb-b94c-66361ec4c7fa', 'b48e7ad0-0283-4dc9-9fb6-7bc6b441bd79', '060a6c80-b597-4951-8255-c3cef0b9310c', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "PemilahanSampah" ("id", "tanggalLapor", "status", "jamPenjemputan", "userId", "petugasId", "jenisSampahId", "wilayahId") VALUES ('74b0c21a-1bdb-4e02-bf3c-96e7d680729a', '2026-08-07T18:04:14.280Z', 'Menunggu', '08:00 - 11:00 (Sesi Pagi)', '68c1e793-2464-41bb-b94c-66361ec4c7fa', NULL, 'a2667b30-4ec4-4c36-9b3b-4342fa67caa2', '18b84959-da71-4646-8317-ef277deb9902');
INSERT INTO "FotoSampah" ("id", "namaFile", "pathFile", "laporanId") VALUES ('515a9dc5-0c3c-49a9-8b91-cb993f74616f', '1785737579071-flaimlnlhc9.jpeg', '/uploads/1785737579071-flaimlnlhc9.jpeg', 'a2fbb1ee-6c04-4da5-9ef8-e66c118290bd');
INSERT INTO "FotoSampah" ("id", "namaFile", "pathFile", "laporanId") VALUES ('d8295f40-6e74-4b03-b04c-99196588719c', '1785737765604-sd8as63lsno.png', '/uploads/1785737765604-sd8as63lsno.png', '07b32597-496b-4043-92c4-85a986aafed0');
INSERT INTO "FotoSampah" ("id", "namaFile", "pathFile", "laporanId") VALUES ('49d6870d-12d7-4e74-9525-9172172c4bf0', '1785738148985-69ji6n7bub9.jpeg', '/uploads/1785738148985-69ji6n7bub9.jpeg', 'edcc11aa-f1dc-471b-bc0c-37e2f77febf3');
INSERT INTO "FotoSampah" ("id", "namaFile", "pathFile", "laporanId") VALUES ('7fa32673-f4d4-423e-818a-6651d836f102', '1786125854062-2ti5wqce57r.jpeg', '/uploads/1786125854062-2ti5wqce57r.jpeg', '74b0c21a-1bdb-4e02-bf3c-96e7d680729a');
INSERT INTO "DetailPemilahan" ("id", "berat", "keterangan", "laporanId", "jenisSampahId") VALUES ('a313225a-f560-4e55-9034-c515070ed705', 0.5, NULL, 'a2fbb1ee-6c04-4da5-9ef8-e66c118290bd', '060a6c80-b597-4951-8255-c3cef0b9310c');
INSERT INTO "DetailPemilahan" ("id", "berat", "keterangan", "laporanId", "jenisSampahId") VALUES ('db106e17-1634-403f-b02f-84508271016f', 5.5, NULL, '07b32597-496b-4043-92c4-85a986aafed0', '062b79f2-ebf9-433d-9f88-ba5a83ea7865');
INSERT INTO "DetailPemilahan" ("id", "berat", "keterangan", "laporanId", "jenisSampahId") VALUES ('eef8419a-0e9b-4591-9983-2495d2fe9f39', 2, NULL, 'edcc11aa-f1dc-471b-bc0c-37e2f77febf3', '189aa1e6-0f8a-452f-b967-5c159c1eb35a');
INSERT INTO "DetailPemilahan" ("id", "berat", "keterangan", "laporanId", "jenisSampahId") VALUES ('5a5e1076-8536-465f-86f3-46ca15bbd274', 4.5, NULL, '74b0c21a-1bdb-4e02-bf3c-96e7d680729a', 'a2667b30-4ec4-4c36-9b3b-4342fa67caa2');
INSERT INTO "JadwalPengangkutan" ("id", "tanggalAngkut", "jamAngkut", "statusPengangkutan", "laporanId", "petugasId", "wilayahId") VALUES ('4b6c2c6c-4f8f-4d8c-92cf-47a945b9bd88', '2026-08-03', '16:25:00.000Z', 'Selesai', '07b32597-496b-4043-92c4-85a986aafed0', '4c1ef30c-23c2-4084-8f19-7a637d9b50d6', 'ec746bdb-5f66-45f6-9d41-6adb95129e4c');
INSERT INTO "JadwalPengangkutan" ("id", "tanggalAngkut", "jamAngkut", "statusPengangkutan", "laporanId", "petugasId", "wilayahId") VALUES ('affad142-33f8-496f-8298-bd513edb53e4', '2026-08-04', '18:20:00.000Z', 'Terjadwal', 'a2fbb1ee-6c04-4da5-9ef8-e66c118290bd', 'b48e7ad0-0283-4dc9-9fb6-7bc6b441bd79', '18b84959-da71-4646-8317-ef277deb9902');

-- ============================================================
-- FITUR TRANSAKSI PENUKARAN KOIN (EcoCoin Rewards)
-- ============================================================
CREATE TABLE IF NOT EXISTS "VoucherReward" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "namaVoucher" VARCHAR(255) NOT NULL UNIQUE,
    "deskripsi" TEXT,
    "hargaKoin" INT NOT NULL,
    "stok" INT NOT NULL DEFAULT 100,
    "kategori" VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "PenukaranKoin" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "tanggalTukar" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlahKoin" INT NOT NULL,
    "kodeVoucher" VARCHAR(100) NOT NULL UNIQUE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Berhasil',
    "userId" VARCHAR(36) NOT NULL,
    "voucherId" VARCHAR(36) NOT NULL,
    CONSTRAINT "fk_tukar_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_tukar_voucher" FOREIGN KEY ("voucherId") REFERENCES "VoucherReward"("id") ON DELETE RESTRICT
);

-- Data Sampel Voucher Reward
INSERT INTO "VoucherReward" ("id", "namaVoucher", "deskripsi", "hargaKoin", "stok", "kategori") VALUES 
('vch-001', 'Voucher Listrik PLN Rp 20.000', 'Diskon token listrik PLN sebesar Rp 20.000', 50, 100, 'Listrik'),
('vch-002', 'Voucher Sembako Indomaret Rp 50.000', 'Voucher belanja minyak goreng & beras di Indomaret', 100, 50, 'Sembako'),
('vch-003', 'Pulsa / E-Wallet Rp 10.000', 'Top up pulsa atau saldo GoPay/OVO/Dana Rp 10.000', 25, 200, 'Pulsa');

