-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "role" TEXT NOT NULL DEFAULT 'User',
    "fotoProfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jenisBangunanId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisBangunan" (
    "id" TEXT NOT NULL,
    "namaJenisBangunan" TEXT NOT NULL,

    CONSTRAINT "JenisBangunan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wilayah" (
    "id" TEXT NOT NULL,
    "namaWilayah" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,

    CONSTRAINT "Wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisSampah" (
    "id" TEXT NOT NULL,
    "namaJenis" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "JenisSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSampah" (
    "id" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "pathFile" TEXT NOT NULL,
    "tanggalUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laporanId" TEXT NOT NULL,

    CONSTRAINT "FotoSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PemilahanSampah" (
    "id" TEXT NOT NULL,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "userId" TEXT NOT NULL,
    "petugasId" TEXT,
    "jenisSampahId" TEXT,
    "wilayahId" TEXT,

    CONSTRAINT "PemilahanSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPemilahan" (
    "id" TEXT NOT NULL,
    "berat" DECIMAL(10,2) NOT NULL,
    "keterangan" TEXT,
    "laporanId" TEXT NOT NULL,
    "jenisSampahId" TEXT NOT NULL,

    CONSTRAINT "DetailPemilahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petugas" (
    "id" TEXT NOT NULL,
    "namaPetugas" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aktif',

    CONSTRAINT "Petugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalPengangkutan" (
    "id" TEXT NOT NULL,
    "tanggalAngkut" DATE NOT NULL,
    "jamAngkut" TIME(6) NOT NULL,
    "statusPengangkutan" TEXT NOT NULL DEFAULT 'Terjadwal',
    "laporanId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "JadwalPengangkutan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_noHp_key" ON "User"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_noHp_key" ON "User"("email", "noHp");

-- CreateIndex
CREATE UNIQUE INDEX "JenisBangunan_namaJenisBangunan_key" ON "JenisBangunan"("namaJenisBangunan");

-- CreateIndex
CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON "Wilayah"("namaWilayah");

-- CreateIndex
CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON "JenisSampah"("namaJenis");

-- CreateIndex
CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON "FotoSampah"("laporanId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailPemilahan_laporanId_jenisSampahId_key" ON "DetailPemilahan"("laporanId", "jenisSampahId");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_email_key" ON "Petugas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_noHp_key" ON "Petugas"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "JadwalPengangkutan_laporanId_key" ON "JadwalPengangkutan"("laporanId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jenisBangunanId_fkey" FOREIGN KEY ("jenisBangunanId") REFERENCES "JenisBangunan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSampah" ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemilahanSampah" ADD CONSTRAINT "PemilahanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemilahanSampah" ADD CONSTRAINT "PemilahanSampah_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemilahanSampah" ADD CONSTRAINT "PemilahanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemilahanSampah" ADD CONSTRAINT "PemilahanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPemilahan" ADD CONSTRAINT "DetailPemilahan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPemilahan" ADD CONSTRAINT "DetailPemilahan_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPengangkutan" ADD CONSTRAINT "JadwalPengangkutan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "PemilahanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPengangkutan" ADD CONSTRAINT "JadwalPengangkutan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPengangkutan" ADD CONSTRAINT "JadwalPengangkutan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
