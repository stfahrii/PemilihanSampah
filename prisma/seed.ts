import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database EcoSort Senayan...");

  // ── Jenis Bangunan ─────────────────────────────────────────
  const jenisBangunanData = [
    { namaJenisBangunan: "Rumah" },
    { namaJenisBangunan: "Gedung" },
    { namaJenisBangunan: "Pabrik" },
    { namaJenisBangunan: "Rumah Sakit" },
    { namaJenisBangunan: "Hotel" },
    { namaJenisBangunan: "Mall" },
    { namaJenisBangunan: "Sekolah" },
    { namaJenisBangunan: "Perkantoran" },
    { namaJenisBangunan: "Tempat Ibadah" },
    { namaJenisBangunan: "Bangunan Lainnya" },
  ];

  for (const jb of jenisBangunanData) {
    await prisma.jenisBangunan.upsert({
      where: { namaJenisBangunan: jb.namaJenisBangunan },
      update: {},
      create: jb,
    });
  }
  console.log("✅ Jenis Bangunan seeded.");

  // ── Wilayah ────────────────────────────────────────────────
  const wilayahData = [
    { namaWilayah: "RW 01", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" },
    { namaWilayah: "RW 02", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" },
    { namaWilayah: "RW 03", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" },
    { namaWilayah: "RW 04", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" },
    { namaWilayah: "Area GBK", kelurahan: "Gelora", kecamatan: "Tanah Abang" },
    { namaWilayah: "Komplek DPR", kelurahan: "Gelora", kecamatan: "Tanah Abang" },
    { namaWilayah: "Bendungan Hilir", kelurahan: "Benhil", kecamatan: "Tanah Abang" },
  ];

  for (const w of wilayahData) {
    await prisma.wilayah.upsert({
      where: { namaWilayah: w.namaWilayah },
      update: {},
      create: w,
    });
  }
  console.log("✅ Wilayah seeded.");

  // ── Jenis Sampah ───────────────────────────────────────────
  const jenisSampahData = [
    { namaJenis: "Organik", deskripsi: "Sampah mudah terurai seperti sisa makanan, dedaunan" },
    { namaJenis: "Anorganik", deskripsi: "Plastik, kaca, logam, kertas" },
    { namaJenis: "B3", deskripsi: "Bahan berbahaya dan beracun" },
    { namaJenis: "Residu", deskripsi: "Sampah yang tidak dapat didaur ulang" },
    { namaJenis: "Elektronik", deskripsi: "Sampah peralatan elektronik" },
    { namaJenis: "Medis", deskripsi: "Limbah rumah sakit dan fasilitas kesehatan" },
    { namaJenis: "Industri", deskripsi: "Limbah sisa proses produksi pabrik" },
    { namaJenis: "Komersial", deskripsi: "Limbah dari kegiatan usaha dan perdagangan" },
    { namaJenis: "Pertanian", deskripsi: "Limbah dari kegiatan pertanian dan perkebunan" },
    { namaJenis: "Konstruksi", deskripsi: "Puing dan sisa material bangunan" },
  ];

  for (const js of jenisSampahData) {
    await prisma.jenisSampah.upsert({
      where: { namaJenis: js.namaJenis },
      update: {},
      create: js,
    });
  }
  console.log("✅ Jenis Sampah seeded.");

  // ── Voucher Reward ──────────────────────────────────────────
  const voucherData = [
    { namaVoucher: "Voucher Listrik PLN Rp 20.000", deskripsi: "Diskon token listrik PLN sebesar Rp 20.000", hargaKoin: 50, stok: 100, kategori: "Listrik" },
    { namaVoucher: "Voucher Sembako Indomaret Rp 50.000", deskripsi: "Voucher belanja minyak goreng & beras di Indomaret", hargaKoin: 100, stok: 50, kategori: "Sembako" },
    { namaVoucher: "Pulsa / E-Wallet Rp 10.000", deskripsi: "Top up pulsa atau saldo GoPay/OVO/Dana Rp 10.000", hargaKoin: 25, stok: 200, kategori: "Pulsa" },
  ];

  for (const v of voucherData) {
    await prisma.voucherReward.upsert({
      where: { namaVoucher: v.namaVoucher },
      update: {},
      create: v,
    });
  }
  console.log("✅ Voucher Reward seeded.");


  // ── Petugas ────────────────────────────────────────────────
  const petugasData = [
    { namaPetugas: "Ahmad Fauzi", email: "ahmad@senayan.go.id", noHp: "081234567801", jabatan: "Koordinator", fotoProfil: "/images/petugas/ahmad.jpg" },
    { namaPetugas: "Rina Lestari", email: "rina@senayan.go.id", noHp: "081234567802", jabatan: "Petugas Lapangan", fotoProfil: "/images/petugas/rina.jpg" },
    { namaPetugas: "Budi Santoso", email: "budi@senayan.go.id", noHp: "081234567803", jabatan: "Pengemudi", fotoProfil: "/images/petugas/budi.jpg" },
    { namaPetugas: "Siti Rahma", email: "siti@senayan.go.id", noHp: "081234567804", jabatan: "Petugas Lapangan", fotoProfil: "/images/petugas/siti.jpg" },
    { namaPetugas: "Dedi Kurniawan", email: "dedi@senayan.go.id", noHp: "081234567805", jabatan: "Admin", fotoProfil: "/images/petugas/dedi.jpg" },
  ];

  for (const p of petugasData) {
    await prisma.petugas.upsert({
      where: { email: p.email },
      update: { fotoProfil: p.fotoProfil },
      create: p,
    });
  }
  console.log("✅ Petugas seeded (with profile photos).");

  // ── Admin User ─────────────────────────────────────────────
  const rumahJB = await prisma.jenisBangunan.findFirst({ where: { namaJenisBangunan: "Perkantoran" } });
  const wilayahAdmin = await prisma.wilayah.findFirst({ where: { namaWilayah: "Komplek DPR" } });

  if (rumahJB && wilayahAdmin) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@ecosort.id" },
      update: {
        password: adminPassword,
      },
      create: {
        nama: "Admin Kecamatan",
        email: "admin@ecosort.id",
        noHp: "081000000000",
        nik: "0000000000000001",
        password: adminPassword,
        alamat: "Jl. Admin No. 1, Senayan",
        role: "Admin",
        jenisBangunanId: rumahJB.id,
        wilayahId: wilayahAdmin.id,
      },
    });
    console.log("✅ Admin user seeded (email: admin@ecosort.id, password: admin123)");
  }

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
