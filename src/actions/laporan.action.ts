"use server";

import { prisma } from "@/lib/prisma";

// ── Fetch dropdown options ─────────────────────────────────────
export async function getFormOptions() {
  const [jenisSampah, wilayah] = await Promise.all([
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } }),
  ]);
  return { jenisSampah, wilayah };
}

// ── Create Laporan Sampah ──────────────────────────────────────
export async function createLaporanAction(formData: FormData) {
  try {
    const userId         = formData.get("userId") as string;
    const jamPenjemputan = (formData.get("jamPenjemputan") as string) || "08:00 - 11:00 (Sesi Pagi)";
    const jenisList      = formData.getAll("jenisSampahId") as string[];
    const beratList      = formData.getAll("berat") as string[];
    const namaFile       = formData.get("namaFile") as string;
    const pathFile       = formData.get("pathFile") as string;

    if (!userId)         throw new Error("User tidak teridentifikasi. Silakan login ulang.");
    if (jenisList.length === 0) throw new Error("Pilih minimal 1 jenis sampah.");
    if (!namaFile || !pathFile) throw new Error("Foto sampah wajib dilampirkan.");

    // Validasi berat > 0
    for (const b of beratList) {
      if (parseFloat(b) <= 0) throw new Error("Berat sampah harus lebih dari 0 kg.");
    }

    // Ambil wilayahId dari data user (untuk FK langsung di PemilahanSampah)
    let validUserId = userId;
    let userdata = await prisma.user.findUnique({
      where: { id: userId },
      select: { wilayahId: true },
    });

    if (!userdata) {
      const anyUser = await prisma.user.findFirst({
        select: { id: true, wilayahId: true },
      });
      if (anyUser) {
        validUserId = anyUser.id;
        userdata = anyUser;
      }
    }

    // jenisSampahId utama = jenis sampah pertama yang dipilih user
    const jenisSampahUtamaId = jenisList[0] ?? null;
    const wilayahId = userdata?.wilayahId ?? null;

    // Prisma transaction: laporan + detail + foto sekaligus
    const laporan = await prisma.$transaction(async (tx) => {
      // 1. Buat laporan utama (dengan FK langsung ke JenisSampah & Wilayah)
      const newLaporan = await tx.pemilahanSampah.create({
        data: {
          userId: validUserId,
          status: "Menunggu",
          jamPenjemputan,
          jenisSampahId: jenisSampahUtamaId, // FK ke JenisSampah (onDelete: Restrict)
          wilayahId: wilayahId,              // FK ke Wilayah (onDelete: Restrict)
        },
      });

      // 2. Buat detail (many-to-many dengan JenisSampah)
      for (let i = 0; i < jenisList.length; i++) {
        await tx.detailPemilahan.create({
          data: {
            laporanId: newLaporan.id,
            jenisSampahId: jenisList[i],
            berat: parseFloat(beratList[i] ?? "0"),
          },
        });
      }

      // 3. Buat foto (one-to-one)
      await tx.fotoSampah.create({
        data: {
          namaFile,
          pathFile,
          laporanId: newLaporan.id,
        },
      });

      return newLaporan;
    });

    return { success: true, message: "Laporan berhasil disimpan!", id: laporan.id };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menyimpan laporan." };
  }
}

// ── Get laporan user ───────────────────────────────────────────
export async function getUserLaporan(userId: string) {
  const result = await prisma.pemilahanSampah.findMany({
    where: { userId },
    orderBy: { tanggalLapor: "desc" },
    include: {
      foto: true,
      detail: { include: { jenisSampah: true } },
      jadwal: { include: { petugas: true, wilayah: true } },
    },
  });

  return result.map((item) => ({
    ...item,
    detail: item.detail.map((d) => ({
      ...d,
      berat: Number(d.berat),
    })),
  }));
}

// ── Get user stats ─────────────────────────────────────────────
export async function getUserStats(userId: string) {
  const [totalLaporan, laporan] = await Promise.all([
    prisma.pemilahanSampah.count({ where: { userId } }),
    prisma.pemilahanSampah.findMany({
      where: { userId },
      include: { detail: true },
    }),
  ]);

  const totalBerat = laporan.reduce((sum, l) =>
    sum + l.detail.reduce((s, d) => s + Number(d.berat), 0), 0
  );

  const selesai = laporan.filter((l) => l.status === "Selesai").length;
  const menunggu = laporan.filter((l) => l.status === "Menunggu").length;
  const diproses = laporan.filter((l) => l.status === "Diproses").length;

  return { totalLaporan, totalBerat, selesai, menunggu, diproses };
}

// ── Admin: Get all laporan ─────────────────────────────────────
export async function getAllLaporan() {
  const result = await prisma.pemilahanSampah.findMany({
    orderBy: { tanggalLapor: "desc" },
    include: {
      user: { include: { jenisBangunan: true, wilayah: true } },
      foto: true,
      detail: { include: { jenisSampah: true } },
      jadwal: { include: { petugas: true } },
    },
  });

  return result.map((item) => ({
    ...item,
    detail: item.detail.map((d) => ({
      ...d,
      berat: Number(d.berat),
    })),
  }));
}

// ── Admin: Assign petugas & jadwal ────────────────────────────
export async function assignPetugasAction(formData: FormData) {
  try {
    const laporanId    = formData.get("laporanId") as string;
    const petugasId    = formData.get("petugasId") as string;
    const wilayahId    = formData.get("wilayahId") as string;
    const tanggalAngkut = formData.get("tanggalAngkut") as string;
    const jamAngkut    = formData.get("jamAngkut") as string;

    await prisma.$transaction(async (tx) => {
      // VALIDASI: Cek apakah petugas sedang bertugas (status "Diproses" di laporan lain)
      const busyCheck = await tx.pemilahanSampah.findFirst({
        where: { status: "Diproses", petugasId, id: { not: laporanId } }
      });
      if (busyCheck) throw new Error("Petugas ini sedang aktif bertugas di lokasi lain. Selesaikan tugasnya dahulu.");

      // Update status laporan
      await tx.pemilahanSampah.update({
        where: { id: laporanId },
        data: { status: "Diproses", petugasId },
      });

      // Create jadwal (or update if exists)
      const existing = await tx.jadwalPengangkutan.findUnique({ where: { laporanId } });
      if (existing) {
        await tx.jadwalPengangkutan.update({
          where: { laporanId },
          data: { petugasId, wilayahId, tanggalAngkut: new Date(tanggalAngkut), jamAngkut: new Date(`1970-01-01T${jamAngkut}:00Z`) },
        });
      } else {
        await tx.jadwalPengangkutan.create({
          data: {
            laporanId,
            petugasId,
            wilayahId,
            tanggalAngkut: new Date(tanggalAngkut),
            jamAngkut: new Date(`1970-01-01T${jamAngkut}:00Z`),
            statusPengangkutan: "Terjadwal",
          },
        });
      }
    });

    return { success: true, message: "Petugas dan jadwal berhasil ditugaskan!" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menugaskan petugas." };
  }
}

// ── Admin: Update status selesai ──────────────────────────────
export async function updateStatusSelesaiAction(laporanId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.pemilahanSampah.update({ where: { id: laporanId }, data: { status: "Selesai" } });
      await tx.jadwalPengangkutan.update({
        where: { laporanId },
        data: { statusPengangkutan: "Selesai" },
      });
    });
    return { success: true, message: "Status laporan diperbarui menjadi Selesai." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal update status." };
  }
}

// ── Admin stats ────────────────────────────────────────────────
export async function getAdminStats() {
  const [totalUser, totalLaporan, totalPetugas, semuaDetail] = await Promise.all([
    prisma.user.count({ where: { role: "User" } }),
    prisma.pemilahanSampah.count(),
    prisma.petugas.count({ where: { status: "Aktif" } }),
    prisma.detailPemilahan.findMany(),
  ]);
  const totalBerat = semuaDetail.reduce((s, d) => s + Number(d.berat), 0);
  return { totalUser, totalLaporan, totalPetugas, totalBerat };
}

export async function getAllPetugas() {
  const allPetugas = await prisma.petugas.findMany({ orderBy: { namaPetugas: "asc" } });
  
  // Dapatkan daftar petugas yang sedang memproses laporan (status "Diproses")
  const activeAssignments = await prisma.pemilahanSampah.findMany({
    where: { status: "Diproses", petugasId: { not: null } },
    select: { petugasId: true }
  });
  
  const busyIds = activeAssignments.map(a => a.petugasId).filter(Boolean) as string[];
  
  return allPetugas.map(p => ({
    ...p,
    isBusy: busyIds.includes(p.id)
  }));
}

export async function getAllWilayah() {
  return prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } });
}

export async function getJadwalHariIni() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end   = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return prisma.jadwalPengangkutan.findMany({
    where: { tanggalAngkut: { gte: start, lt: end } },
    include: { petugas: true, laporan: { include: { user: true } }, wilayah: true },
  });
}

// ── Analytics: Jenis Sampah Terbanyak ──────────────────────────
export async function getJenisSampahStats() {
  const details = await prisma.detailPemilahan.findMany({
    include: { jenisSampah: true },
  });
  const map: Record<string, { nama: string; totalBerat: number; count: number }> = {};
  for (const d of details) {
    const key = d.jenisSampahId;
    if (!map[key]) map[key] = { nama: d.jenisSampah.namaJenis, totalBerat: 0, count: 0 };
    map[key].totalBerat += Number(d.berat);
    map[key].count += 1;
  }
  return Object.values(map).sort((a, b) => b.totalBerat - a.totalBerat);
}

// ── Analytics: Wilayah Laporan Terbanyak ───────────────────────
export async function getWilayahStats() {
  const laporan = await prisma.pemilahanSampah.findMany({
    include: { user: { include: { wilayah: true } }, detail: true },
  });
  const map: Record<string, { nama: string; totalLaporan: number; totalBerat: number }> = {};
  for (const l of laporan) {
    const wilayah = l.user?.wilayah;
    if (!wilayah) continue;
    const key = wilayah.id;
    if (!map[key]) map[key] = { nama: wilayah.namaWilayah, totalLaporan: 0, totalBerat: 0 };
    map[key].totalLaporan += 1;
    map[key].totalBerat += l.detail.reduce((s, d) => s + Number(d.berat), 0);
  }
  return Object.values(map).sort((a, b) => b.totalLaporan - a.totalLaporan);
}

// ── Analytics: Laporan per Bulan (12 bulan terakhir) ───────────
export async function getLaporanPerBulan() {
  const laporan = await prisma.pemilahanSampah.findMany({
    select: { tanggalLapor: true },
    orderBy: { tanggalLapor: "asc" },
  });
  const map: Record<string, number> = {};
  const bulanNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  for (const l of laporan) {
    const d = new Date(l.tanggalLapor);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] ?? 0) + 1;
  }
  // Return last 6 months
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ bulan: bulanNames[d.getMonth()], count: map[key] ?? 0 });
  }
  return result;
}

// ── Analytics: Petugas Sedang Bertugas ─────────────────────────
export async function getPetugasSedangBertugas() {
  return prisma.pemilahanSampah.findMany({
    where: { status: "Diproses", petugasId: { not: null } },
    include: {
      petugas: true,
      user: { include: { wilayah: true } },
      jadwal: true,
    },
  });
}

// ── User: Total jenis sampah unik pernah dilaporkan ────────────
export async function getUserTotalJenisSampah(userId: string) {
  const details = await prisma.detailPemilahan.findMany({
    where: { laporan: { userId } },
    select: { jenisSampahId: true },
  });
  const unique = new Set(details.map((d) => d.jenisSampahId));
  return unique.size;
}

