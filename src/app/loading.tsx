import TruckLoader from "@/components/ui/TruckLoader";

export default function GlobalLoading() {
  return (
    <TruckLoader
      message="Truk Sampah Sedang Meluncur..."
      submessage="EcoSort Senayan — Memuat data & mempersiapkan halaman..."
      fullScreen={true}
    />
  );
}
