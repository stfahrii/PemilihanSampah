"use server";

import { prisma } from "@/lib/prisma";

// ── Fetch semua voucher reward ────────────────────────────────
export async function getVouchersAction() {
  return prisma.voucherReward.findMany({
    orderBy: { hargaKoin: "asc" },
  });
}

// ── Transaksi Penukaran Koin (Atomic Transaction) ────────────
export async function tukarKoinAction(userId: string, voucherId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Validasi User & Cek Saldo Koin
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User tidak ditemukan.");

      // 2. Validasi Voucher & Stok
      const voucher = await tx.voucherReward.findUnique({ where: { id: voucherId } });
      if (!voucher) throw new Error("Voucher tidak ditemukan.");
      if (voucher.stok <= 0) throw new Error("Stok voucher ini telah habis.");
      if (user.saldoKoin < voucher.hargaKoin) {
        throw new Error(
          `Saldo koin Anda (${user.saldoKoin} EcoCoin) tidak mencukupi untuk menukar voucher ${voucher.namaVoucher} (${voucher.hargaKoin} EcoCoin).`
        );
      }

      // 3. Potong Saldo Koin User (Atomic Decrement)
      await tx.user.update({
        where: { id: userId },
        data: { saldoKoin: { decrement: voucher.hargaKoin } },
      });

      // 4. Kurangi Stok Voucher
      await tx.voucherReward.update({
        where: { id: voucherId },
        data: { stok: { decrement: 1 } },
      });

      // 5. Generate Kode Unik Voucher (contoh: ECO-PLN-8F92A)
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const katPrefix = voucher.kategori.substring(0, 3).toUpperCase();
      const kodeVoucher = `ECO-${katPrefix}-${randomCode}`;

      // 6. Simpan Record Transaksi Penukaran Koin
      const transaksi = await tx.penukaranKoin.create({
        data: {
          userId,
          voucherId,
          jumlahKoin: voucher.hargaKoin,
          kodeVoucher,
          status: "Berhasil",
        },
      });

      return {
        success: true,
        message: `Berhasil menukarkan ${voucher.hargaKoin} EcoCoin dengan ${voucher.namaVoucher}!`,
        kodeVoucher,
        transaksiId: transaksi.id,
      };
    });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memproses transaksi penukaran koin.",
    };
  }
}

// ── Fetch riwayat transaksi penukaran koin user ───────────────
export async function getHistoryPenukaranKoinAction(userId: string) {
  return prisma.penukaranKoin.findMany({
    where: { userId },
    orderBy: { tanggalTukar: "desc" },
    include: { voucher: true },
  });
}
