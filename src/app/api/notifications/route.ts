import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ notifications: [] });
    }

    // Fetch user's own reports only
    const laporan = await prisma.pemilahanSampah.findMany({
      where: { userId },
      orderBy: { tanggalLapor: "desc" },
      take: 5,
      include: {
        detail: { include: { jenisSampah: true } },
        jadwal: { include: { petugas: true, wilayah: true } },
      },
    });

    const notifications = [];

    // General announcement (common for all users)
    notifications.push({
      id: `announcement-senayan`,
      title: "📢 Himbauan Pemilahan Sampah",
      desc: "Pastikan sampah B3 dan Medis diletakkan pada wadah bertutup berlabel khusus.",
      time: "Pengumuman Resmi",
      type: "warning",
    });

    // Generate notifications specific to this user's reports
    laporan.forEach((item) => {
      const jenisText = item.detail.map((d) => d.jenisSampah.namaJenis).join(", ") || "Sampah";
      const dateFormatted = new Date(item.tanggalLapor).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      if (item.status === "Selesai") {
        notifications.push({
          id: `notif-selesai-${item.id}`,
          title: "✅ Pengangkutan Selesai",
          desc: `Laporan ${jenisText} Anda (${dateFormatted}) telah selesai diangkut. EcoPoints bertambah!`,
          time: dateFormatted,
          type: "success",
        });
      } else if (item.status === "Diproses") {
        const namaPetugas = item.jadwal?.petugas?.namaPetugas || "Petugas DLH";
        notifications.push({
          id: `notif-diproses-${item.id}`,
          title: "🚛 Laporan Diproses Petugas",
          desc: `Petugas ${namaPetugas} telah ditugaskan untuk mengangkut laporan ${jenisText} Anda.`,
          time: dateFormatted,
          type: "info",
        });
      } else {
        notifications.push({
          id: `notif-menunggu-${item.id}`,
          title: "📌 Laporan Berhasil Dikirim",
          desc: `Laporan ${jenisText} Anda (${dateFormatted}) sedang dalam antrean verifikasi Admin Kecamatan.`,
          time: dateFormatted,
          type: "info",
        });
      }
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}
