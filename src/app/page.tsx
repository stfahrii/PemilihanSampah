"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";
import Icon from "@/components/ui/Icon";

interface CommentItem {
  id: string;
  nama: string;
  bangunan: string;
  rating: number;
  pesan: string;
  waktu: string;
}

interface CatalogItem {
  id: string;
  nama: string;
  kategori: string;
  image: string;
  deskripsi: string;
  panduan: string;
  badge: string;
  rating: number;
  stokWadah: string;
  tutorialSteps: { step: string; title: string; desc: string }[];
  comments: CommentItem[];
}

const catalogData: CatalogItem[] = [
  {
    id: "organik",
    nama: "Sampah Organik",
    kategori: "Organik",
    image: "/images/organik.jpg",
    deskripsi: "Sisa makanan, dedaunan, sisa sayuran, dan bahan organik lain yang mudah terurai secara alami.",
    panduan: "Wadah Warna Hijau · Pisahkan dari plastik · Siap dijadikan pupuk kompos",
    badge: "badge-green",
    rating: 4.9,
    stokWadah: "WADAH: HIJAU",
    tutorialSteps: [
      { step: "01", title: "Pemisahan dari Sumber", desc: "Pisahkan sisa makanan, kulit buah, nasi, & dedaunan dari wadah plastik/kertas." },
      { step: "02", title: "Penyimpanan Tempat Sampah Hijau", desc: "Masukkan ke dalam wadah warna hijau bertutup. Taburi sedikit dedaunan kering untuk menyerap kelembapan & cegah bau." },
      { step: "03", title: "Pengolahan Pupuk Kompos", desc: "Serahkan pada armada pengangkut harian Senayan jam 06.00 WIB untuk diolah jadi pupuk organik nutrisi tinggi." },
    ],
    comments: [
      { id: "c1", nama: "Pak Budi", bangunan: "Rumah Benhil", rating: 5, pesan: "Pemilahan sampah organik sangat mudah! Dapur jadi bersih tanpa bau sejak pakai wadah hijau bertutup.", waktu: "2 hari lalu" },
      { id: "c2", nama: "Rina S.", bangunan: "Resto Senayan", rating: 5, pesan: "Restoran kami menyetorkan 40kg organik setiap hari. Dikelola cepat & ditukar pupuk kompos gratis!", waktu: "3 hari lalu" },
    ],
  },
  {
    id: "anorganik",
    nama: "Sampah Anorganik",
    kategori: "Anorganik",
    image: "/images/anorganik.jpg",
    deskripsi: "Botol plastik, wadah kaca, kaleng aluminium, kardus, dan kemasan daur ulang.",
    panduan: "Wadah Warna Biru · Bersihkan dari sisa cairan · Keringkan sebelum disetor",
    badge: "badge-blue",
    rating: 4.8,
    stokWadah: "WADAH: BIRU",
    tutorialSteps: [
      { step: "01", title: "Bilas & Keringkan", desc: "Bersihkan botol plastik, kaleng, & wadah kaca dari sisa cairan/makanan." },
      { step: "02", title: "Press & Pipihkan", desc: "Pipihkan botol plastik dan potong/lipat kardus rata untuk menghemat ruang wadah biru." },
      { step: "03", title: "Setor Bank Sampah", desc: "Kumpulkan dalam kantong biru bersih untuk didaur ulang menjadi produk bernilai ekonomi tinggi." },
    ],
    comments: [
      { id: "c3", nama: "Heri P.", bangunan: "Gedung Perkantoran Sudirman", rating: 5, pesan: "Melipat kardus hingga rata menghemat tempat sampah kantor sampai 60%. Sangat praktis!", waktu: "1 hari lalu" },
    ],
  },
  {
    id: "b3",
    nama: "Bahan Berbahaya & Beracun (B3)",
    kategori: "B3",
    image: "/images/b3.jpg",
    deskripsi: "Baterai bekas, lampu neon, kaleng cat, pestisida, dan oli bekas yang berisiko merusak lingkungan.",
    panduan: "Wadah Warna Kuning · Tutup rapat · Jangan dicampur sampah lain",
    badge: "badge-amber",
    rating: 4.9,
    stokWadah: "WADAH: KUNING",
    tutorialSteps: [
      { step: "01", title: "Isolasi Wadah Kuning", desc: "Masukkan baterai bekas, kaleng cat, & botol kimia ke dalam kontainer kuning kedap udara." },
      { step: "02", title: "Hindari Penggabungan", desc: "Jangan sekali-kali mencampur baterai atau lampu neon rusak dengan sampah cair/organik." },
      { step: "03", title: "Penjemputan Khusus DLH", desc: "Petugas khusus dekontaminasi DLH Senayan akan memproses sesuai standar penanganan B3 resmi." },
    ],
    comments: [
      { id: "c4", nama: "Dokter Maya", bangunan: "Klinik Medika", rating: 5, pesan: "Wadah kuning sangat penting untuk baterai & neon bekas. Keamanan lingkungan kerja jadi terjaga.", waktu: "4 hari lalu" },
    ],
  },
  {
    id: "residu",
    nama: "Sampah Residu",
    kategori: "Residu",
    image: "/images/residu.jpg",
    deskripsi: "Popok bayi, tisu bekas, puntung rokok, dan sampah yang tidak dapat didaur ulang.",
    panduan: "Wadah Warna Abu-abu · Bungkus rapi · Siap diangkut ke TPA",
    badge: "badge-rose",
    rating: 4.7,
    stokWadah: "WADAH: ABU-ABU",
    tutorialSteps: [
      { step: "01", title: "Pembungkusan Rapi", desc: "Bungkus popok sekali pakai, tisu bekas, & puntung rokok dalam kantong plastik terikat rapat." },
      { step: "02", title: "Tempat Sampah Residu", desc: "Masukkan ke dalam wadah khusus residu warna abu-abu." },
      { step: "03", title: "Pengangkutan TPA", desc: "Diangkut langsung oleh armada truk menuju TPA resmi DKI Jakarta tanpa penumpukan." },
    ],
    comments: [
      { id: "c5", nama: "Ibu Rahma", bangunan: "Apartemen Senayan", rating: 4, pesan: "Panduan ikat kantong residu rapi bikin lorong apartemen bersih dan tidak bau.", waktu: "5 hari lalu" },
    ],
  },
  {
    id: "elektronik",
    nama: "Sampah Elektronik (E-Waste)",
    kategori: "Elektronik",
    image: "/images/elektronik.jpg",
    deskripsi: "Handphone bekas, kabel, papan sirkuit PCB, komponen komputer, dan peralatan elektronik.",
    panduan: "Wadah Khusus E-Waste · Lepaskan baterai · Disetor ke depo khusus",
    badge: "badge-blue",
    rating: 4.9,
    stokWadah: "WADAH: UNGU",
    tutorialSteps: [
      { step: "01", title: "Lepaskan Baterai", desc: "Copot baterai bekas dari HP atau perangkat elektronik sebelum disetor." },
      { step: "02", title: "Simpan Box Kering", desc: "Masukkan kabel, mainboard PCB, & perangkat bekas ke kardus/box kering." },
      { step: "03", title: "Drop Depo Kelurahan", desc: "Setorkan ke Depo E-Waste di Kantor Kelurahan terdekat tanpa biaya." },
    ],
    comments: [
      { id: "c6", nama: "Fahri K.", bangunan: "Bengkel Komputer", rating: 5, pesan: "Depo E-Waste kelurahan sangat membantu membuang kabel & PCB bekas toko kami.", waktu: "1 minggu lalu" },
    ],
  },
  {
    id: "medis",
    nama: "Limbah Medis & Kesehatan",
    kategori: "Medis",
    image: "/images/medis.jpg",
    deskripsi: "Masker sekali pakai, sarung tangan medis, wadah obat, dan limbah medis fasilitas kesehatan.",
    panduan: "Wadah Warna Merah · Label Biohazard · Penanganan khusus medis",
    badge: "badge-rose",
    rating: 5.0,
    stokWadah: "WADAH: MERAH",
    tutorialSteps: [
      { step: "01", title: "Kantong Plastik Merah", desc: "Gunakan kantong merah berlabel Biohazard resmi untuk limbah kesehatan." },
      { step: "02", title: "Desinfeksi & Gunting Masker", desc: "Semprot desinfektan dan gunting tali masker sekali pakai sebelum dibuang." },
      { step: "03", title: "Insinerator Resmi DLH", desc: "Diangkut khusus untuk dimusnahkan secara aman pada fasilitas insinerasi medis berizin." },
    ],
    comments: [
      { id: "c7", nama: "Nurse Lina", bangunan: "Puskesmas Senayan", rating: 5, pesan: "Prosedur kantong merah sangat aman. Petugas angkut medis selalu siaga.", waktu: "3 hari lalu" },
    ],
  },
  {
    id: "industri",
    nama: "Limbah Industri Pabrik",
    kategori: "Industri",
    image: "/images/industri.jpg",
    deskripsi: "Sisa kain tekstil, potongan logam, drum sisa produksi, dan bahan sisa pabrik.",
    panduan: "Kontainer Khusus Pabrik · Timbang berat di lokasi · Angkut truk khusus",
    badge: "badge-amber",
    rating: 4.8,
    stokWadah: "WADAH: COKELAT",
    tutorialSteps: [
      { step: "01", title: "Pemisahan Jenis Bahan", desc: "Pisahkan kain tekstil, potongan drum, & serbuk logam pada zona penyimpanan pabrik." },
      { step: "02", title: "Pencatatan Timbangan", desc: "Timbang berat total per kontainer sebelum membuat laporan angkut aplikasi." },
      { step: "03", title: "Truk Kontainer Khusus", desc: "Diangkut armada truk berat sesuai jadwal penugasan admin kecamatan." },
    ],
    comments: [
      { id: "c8", nama: "Agus T.", bangunan: "Pabrik Tekstil", rating: 5, pesan: "Pencatatan berat digital via aplikasi memudahkan laporan bulanan limbah pabrik kami.", waktu: "4 hari lalu" },
    ],
  },
  {
    id: "komersial",
    nama: "Limbah Komersial Usaha",
    kategori: "Komersial",
    image: "/images/komersial.jpg",
    deskripsi: "Kardus pembungkus stok barang, limbah restoran/cafe, kemasan toko, dan kertas perkantoran.",
    panduan: "Press kardus rata · Pilah botol & kemasan · Jadwalkan harian",
    badge: "badge-blue",
    rating: 4.9,
    stokWadah: "WADAH: ORANYE",
    tutorialSteps: [
      { step: "01", title: "Pilah Kertas & Kemasan", desc: "Pisahkan kardus stok toko dari sisa sampah makanan dapur cafe." },
      { step: "02", title: "Ikat Rapi Rata", desc: "Lipat dus pembungkus dan ikat dengan tali goni." },
      { step: "03", title: "Penjemputan Komersial", desc: "Petugas patroli komersial mengambil sampah toko/cafe setiap sore." },
    ],
    comments: [
      { id: "c9", nama: "Dewi S.", bangunan: "Cafe Gelora", rating: 5, pesan: "Kardus bekas stok cafe terikat rapi, penjemputan sore selalu tepat waktu!", waktu: "2 hari lalu" },
    ],
  },
  {
    id: "pertanian",
    nama: "Limbah Pertanian & Kebun",
    kategori: "Pertanian",
    image: "/images/pertanian.jpg",
    deskripsi: "Jerami, ranting pohon, sisa potongan rumput taman, dedaunan gugur, dan batang tanaman.",
    panduan: "Ikat ranting rapi · Kumpulkan dalam karung tumpuk compost",
    badge: "badge-green",
    rating: 4.8,
    stokWadah: "WADAH: COKELAT MUDA",
    tutorialSteps: [
      { step: "01", title: "Cacah Ranting Kebun", desc: "Potong ranting pohon panjang menjadi ukuran maksimal 50cm." },
      { step: "02", title: "Karung Rumput & Daun", desc: "Kumpulkan rumput tebasan & dedaunan gugur dalam karung ramah lingkungan." },
      { step: "03", title: "Pengolahan Kompos Kebun", desc: "Diolah menjadi kompos kebun komunitas di RPTRA Kecamatan Senayan." },
    ],
    comments: [
      { id: "c10", nama: "Pak Bambang", bangunan: "Taman Gelora", rating: 5, pesan: "Potongan rumput dan ranting kebun langsung diolah jadi pupuk hijau kawasan.", waktu: "6 hari lalu" },
    ],
  },
  {
    id: "konstruksi",
    nama: "Sampah Puing Konstruksi",
    kategori: "Konstruksi",
    image: "/images/konstruksi.jpg",
    deskripsi: "Puing pecahan semen, sisa batu bata, potongan kayu konstruksi, dan ubin sisa renovasi.",
    panduan: "Gunakan terpal rapat · Angkut dengan armada berat khusus puing",
    badge: "badge-amber",
    rating: 4.9,
    stokWadah: "WADAH: HITAM",
    tutorialSteps: [
      { step: "01", title: "Karung Puing Tebal", desc: "Masukkan pecahan semen, bata, & ubin sisa renovasi ke karung tebal." },
      { step: "02", title: "Tutup Terpal Kedap", desc: "Tutup area penumpukan puing dengan terpal rapat agar debu semen tidak mencemari udara." },
      { step: "03", title: "Penjemputan Dump Truck", desc: "Diangkut oleh armada dump truck berat puing konstruksi." },
    ],
    comments: [
      { id: "c11", nama: "Mandor Joko", bangunan: "Proyek Renovasi Benhil", rating: 5, pesan: "Dump truck puing angkut cepat, area renovasi bersih tanpa debu semen liar.", waktu: "1 hari lalu" },
    ],
  },
];

/* ── Ad Carousel Slides Data ─────────────────────────────── */
const adSlides = [
  {
    id: 1,
    title: "Gebyar Senayan Clean & Green 2026",
    subtitle: "Pilah 10 jenis sampah dari bangunan Anda & dapatkan Sertifikat Bangunan Ramah Lingkungan DLH DKI.",
    image: "/images/iklan1.jpg",
    badge: "IKLAN RESMI DLH",
    badgeColor: "bg-emerald-600",
    actionText: "Daftar Bangunan Sekarang",
    actionLink: "/register",
  },
  {
    id: 2,
    title: "Program Setor Sampah Dapatkan Kompos Gratis",
    subtitle: "Setiap 50kg sampah organik yang dilaporkan dapat ditukar dengan 5kg kompos organik nutrisi tinggi.",
    image: "/images/iklan2.jpg",
    badge: "PROGRAM APRESIASI",
    badgeColor: "bg-amber-600",
    actionText: "Lihat Katalog Sampah",
    actionLink: "#katalog",
  },
  {
    id: 3,
    title: "Penanganan Khusus Limbah B3 & Medis",
    subtitle: "Limbah bahan berbahaya & medis diproses dengan armada dekontaminasi berspesifikasi tinggi.",
    image: "/images/medis.jpg",
    badge: "STANDAR BIOHAZARD",
    badgeColor: "bg-rose-600",
    actionText: "Pelajari Prosedur",
    actionLink: "#katalog",
  },
  {
    id: 4,
    title: "Layanan Armada Berat Sampah Puing & Renovasi",
    subtitle: "Armada truk kontainer siap diangkut langsung dari lokasi proyek bangunan di seluruh Senayan.",
    image: "/images/konstruksi.jpg",
    badge: "ARMADA KHUSUS",
    badgeColor: "bg-blue-600",
    actionText: "Lapor Sampah Puing",
    actionLink: "/register",
  },
];

/* ── Component 1: Auto Sliding Photo Ad Banner ──────────── */
function AdCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % adSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = adSlides[current];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden card-lift relative">
      <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover opacity-85 transition-all duration-700 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 flex flex-col justify-end">
          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono-custom font-extrabold text-white uppercase tracking-wider mb-1.5 self-start ${slide.badgeColor}`}>
            {slide.badge}
          </span>
          <h4 className="text-base sm:text-lg font-black text-white leading-snug mb-1">{slide.title}</h4>
          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-3">{slide.subtitle}</p>
          <div className="flex items-center justify-between">
            <Link href={slide.actionLink} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono-custom">
              {slide.actionText} →
            </Link>
            <div className="flex gap-1.5">
              {adSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${idx === current ? "w-6 bg-emerald-400" : "w-2 bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] font-mono-custom text-slate-500">
        <button onClick={() => setCurrent((prev) => (prev === 0 ? adSlides.length - 1 : prev - 1))} className="hover:text-slate-900 font-bold">
          Prev Iklan
        </button>
        <span>Iklan {current + 1} dari {adSlides.length}</span>
        <button onClick={() => setCurrent((prev) => (prev + 1) % adSlides.length)} className="hover:text-slate-900 font-bold">
          Next Iklan
        </button>
      </div>
    </div>
  );
}

/* ── Component 2: Official Announcement Board ───────────── */
function PengumumanBoard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div className="flex items-center gap-2">
          <Icon name="bell" size={18} className="text-slate-700" />
          <h3 className="font-mono-custom text-xs font-bold uppercase tracking-wider text-slate-900">PENGUMUMAN & PEMBERITAHUAN</h3>
        </div>
        <span className="badge badge-rose">3 Info Baru</span>
      </div>

      <div className="space-y-3 font-mono-custom text-xs">
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-amber-900">Penyesuaian Jam Angkut Malam</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">PENTING</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Pekerjaan jalan di area Gelora Senayan dimajukan. Armada angkut malam beroperasi pukul 19:30 - 22:00 WIB.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-emerald-900">Fasilitas Depo E-Waste Gratis</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase">PROGRAM BARU</span>
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            Warga & bangunan di Senayan dapat menyetorkan baterai bekas & HP rusak di Kantor Kelurahan terdekat.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-blue-900">Inspeksi Kepatuhan Perda No 3</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900 uppercase">HIMBAUAN</span>
          </div>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            Tim DLH Senayan melakukan monitoring pemilahan wadah 10 jenis sampah pada seluruh gedung bertingkat.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Component 3: Event & Kerja Bakti Sekitar Senayan ─── */
function SenayanEventsWidget() {
  const events = [
    { title: "Kerja Bakti Massal Kebersihan Saluran", org: "Kelurahan Gelora & RT/RW", time: "Minggu · 06.00 WIB", loc: "Benhil & Gelora", status: "AKTIF" },
    { title: "Workshop Komposting Mandiri Organik", org: "Karang Taruna Senayan", time: "Sabtu · 09.00 WIB", loc: "RPTRA Senayan", status: "BARU" },
    { title: "Aksi Bersih Sampah Plastik Komunitas", org: "Komunitas Senayan Clean", time: "Jumat · 15.30 WIB", loc: "Taman Hutan GBK", status: "AGENDA" },
    { title: "Penanaman Pohon & Pemilahan Sampah", org: "DKI Hijau & Warga Local", time: "Sabtu depan · 07.00 WIB", loc: "Jl. Asia Afrika", status: "AGENDA" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div className="flex items-center gap-2">
          <Icon name="calendar" size={18} className="text-slate-700" />
          <h3 className="font-mono-custom text-xs font-bold uppercase tracking-wider text-slate-900">EVENT & KERJA BAKTI SEKITAR SENAYAN</h3>
        </div>
        <span className="badge badge-green">4 Agenda</span>
      </div>

      <div className="space-y-3 font-mono-custom text-xs">
        {events.map((ev, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-bold text-slate-900 truncate text-[11px]">{ev.title}</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">{ev.status}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{ev.org}</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">{ev.loc} · {ev.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tutorial & Komentar Modal Component ──────────────────── */
function TutorialModal({
  item,
  comments,
  onClose,
  onAddComment,
}: {
  item: CatalogItem;
  comments: CommentItem[];
  onClose: () => void;
  onAddComment: (itemId: string, newComment: CommentItem) => void;
}) {
  const [nama, setNama] = useState("");
  const [bangunan, setBangunan] = useState("");
  const [rating, setRating] = useState(5);
  const [pesan, setPesan] = useState("");
  const [activeTab, setActiveTab] = useState<"tutorial" | "komentar">("tutorial");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userNama = sessionStorage.getItem("userNama");
    if (userNama) {
      setNama(userNama);
      setBangunan("Bangunan Terdaftar");
      setIsLoggedIn(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;

    const newC: CommentItem = {
      id: Date.now().toString(),
      nama: nama.trim(),
      bangunan: bangunan.trim() || "Warga Senayan",
      rating,
      pesan: pesan.trim(),
      waktu: "Baru saja",
    };

    onAddComment(item.id, newC);
    if (!isLoggedIn) setNama("");
    if (!isLoggedIn) setBangunan("");
    setPesan("");
    alert("Terima kasih! Komentar & tips pemilahan Anda telah berhasil ditambahkan.");
    setActiveTab("komentar");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans-custom">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div>
              <span className={`inline-block text-[10px] font-mono-custom font-extrabold uppercase px-2 py-0.5 rounded ${item.badge}`}>
                {item.kategori}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                Tutorial & Komentar: {item.nama}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-all font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("tutorial")}
            className={`px-4 py-2.5 rounded-t-xl font-mono-custom text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tutorial"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-500"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Panduan Tutorial
          </button>
          <button
            onClick={() => setActiveTab("komentar")}
            className={`px-4 py-2.5 rounded-t-xl font-mono-custom text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "komentar"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-500"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Komentar Warga ({comments.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "tutorial" ? (
            <div className="space-y-6">
              {/* Image & Quick Guide Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
                <img src={item.image} alt={item.nama} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end">
                  <p className="text-white text-xs font-mono-custom font-bold">
                    {item.panduan}
                  </p>
                </div>
              </div>

              {/* Step by Step Tutorial */}
              <div>
                <h4 className="font-mono-custom text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  // LANGKAH-LANGKAH PENGELOLAAN RESMI
                </h4>
                <div className="space-y-3 font-sans-custom">
                  {item.tutorialSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-mono-custom text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm">
                        {step.step}
                      </span>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{step.title}</h5>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* List of Comments */}
              <div>
                <h4 className="font-mono-custom text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  // ULASAN & PENGALAMAN WARGA SENAYAN
                </h4>

                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">Belum ada komentar. Jadilah warga pertama yang membagikan pengalaman!</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-sans-custom">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                              {c.nama.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white text-xs">{c.nama}</span>
                              <span className="text-[10px] text-slate-400 ml-2 font-mono-custom">({c.bangunan})</span>
                            </div>
                          </div>
                          <div className="text-amber-500 text-xs">
                            {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed pl-9">{c.pesan}</p>
                        <div className="text-[10px] text-slate-400 font-mono-custom mt-2 pl-9">{c.waktu}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Tulis Tips / Komentar Kamu</h5>
                
                {isLoggedIn ? (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-xs font-mono-custom text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <span>Terautentikasi sebagai Akun Terdaftar: <strong>{nama}</strong></span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Kamu bisa tulis komentar langsung, atau{" "}
                    <Link href="/login" className="font-bold text-emerald-600 dark:text-emerald-400 underline">
                      Masuk Akun
                    </Link>{" "}
                    agar komentar terhubung dengan profil bangunanmu.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Lengkap kamu"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                      readOnly={isLoggedIn}
                      className="input-light text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Nama Bangunan (opsional)"
                      value={bangunan}
                      onChange={(e) => setBangunan(e.target.value)}
                      readOnly={isLoggedIn}
                      className="input-light text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-custom font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Rating Pengalaman:
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="input-light text-xs w-full"
                    >
                      <option value={5}>5/5 - Sangat Mudah</option>
                      <option value={4}>4/5 - Bagus</option>
                      <option value={3}>3/3 - Cukup</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Tulis tips pemilahan atau komentar kamu disini..."
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    required
                    rows={3}
                    className="input-light text-xs w-full"
                  />
                  <button type="submit" className="btn-eco w-full text-xs py-2.5 cursor-pointer">
                    Kirim Komentar Warga →
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemForTutorial, setSelectedItemForTutorial] = useState<CatalogItem | null>(null);
  const [userComments, setUserComments] = useState<{ [itemId: string]: CommentItem[] }>({});

  function handleAddComment(itemId: string, newComment: CommentItem) {
    setUserComments((prev) => ({
      ...prev,
      [itemId]: [newComment, ...(prev[itemId] || [])],
    }));
  }

  // Quick Demo Logins
  function handleDemoUser() {
    sessionStorage.setItem("userId", "demo-user-id");
    sessionStorage.setItem("userNama", "Rumah Pak Budi");
    sessionStorage.setItem("userRole", "User");
    router.push("/user/dashboard");
  }

  function handleDemoAdmin() {
    sessionStorage.setItem("userId", "admin-id");
    sessionStorage.setItem("userNama", "Admin Kecamatan");
    sessionStorage.setItem("userRole", "Admin");
    router.push("/admin/dashboard");
  }

  const categories = ["Semua", "Organik", "Anorganik", "B3", "Residu", "Elektronik", "Medis", "Industri", "Komersial", "Pertanian", "Konstruksi"];

  const filteredCatalog = catalogData.filter((item) => {
    const matchCat = filterCategory === "Semua" || item.kategori === filterCategory;
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const tickerItems = [
    "PAKET SAMPAH MANDIRI",
    "KALENDER PENGANGKUTAN",
    "AMAN & TERINTEGRASI",
    "SENAYAN CLEAN CITY",
    "500+ BANGUNAN TERDAFTAR",
    "10 KATEGORI SAMPAH TERDATA",
    "PETUGAS SIAP SIAGA",
    "KECAMATAN SENAYAN JAKARTA",
  ];

  return (
    <main className="min-h-screen relative overflow-hidden animated-grid-bg flex flex-col">

      {/* ── HERO ORBS ────────────────────────────────────────── */}
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* ── 1. NAVBAR WITH DEMO BUTTONS ──────── */}
      <nav className="relative z-30 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center p-1 bg-white border border-slate-100 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/logo.png"
              alt="EcoSort Senayan Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-black text-xl tracking-tight text-slate-900 leading-none">EcoSort</div>
            <div className="font-mono-custom text-xs text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Senayan</div>
          </div>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#katalog" className="nav-underline">
            Katalog 10 Sampah
          </a>
          <a href="#cara-kerja" className="nav-underline">
            Cara Kerja
          </a>
        </div>

        {/* Right Nav & Demo Buttons */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <Link href="/login" className="nav-underline hidden sm:inline-block">
            Masuk
          </Link>
          <Link href="/register" className="btn-primary">
            Daftar
          </Link>

          {/* Quick Demo Buttons */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="font-mono-custom text-[10px] text-slate-400 font-bold uppercase">DEMO:</span>
            <button onClick={handleDemoUser}
              className="px-3 py-1.5 rounded-lg font-mono-custom text-xs font-bold bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition-all border border-slate-200">
              Demo User
            </button>
            <button onClick={handleDemoAdmin}
              className="px-3 py-1.5 rounded-lg font-mono-custom text-xs font-bold bg-slate-900 text-white hover:bg-emerald-600 transition-all">
              Demo Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. TICKER MARQUEE ─────────────────────────────────── */}
      <div className="relative z-10 w-full py-2.5 bg-slate-900 text-white border-b border-slate-800">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="font-mono-custom text-xs font-bold tracking-wider text-emerald-400 uppercase mx-6 inline-flex items-center gap-3">
                <span className="pulse-dot" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. HERO SECTION ───────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto">

        {/* Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="badge-green shadow-sm">
            <span className="pulse-dot" />
            <span>PORTAL RESMI KECAMATAN SENAYAN</span>
          </div>
          <div className="badge-amber shadow-sm">
            10 KATEGORI SAMPAH TERSEDIA
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
          SISTEM INFORMASI PEMILAHAN <br />
          <span className="text-emerald-600">SAMPAH</span>
        </h1>

        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-sans-custom">
          Pengelolaan 10 jenis sampah terpadu dari seluruh bangunan di Kecamatan Senayan (Rumah, Gedung, Pabrik, Rumah Sakit, Hotel, Mall, Perkantoran).
        </p>

        {/* CTA & Quick Demo Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href="/register" className="btn-eco py-4 px-8 text-base shadow-xl">
            Mulai Lapor Sampah
          </Link>
          <a href="#katalog" className="btn-secondary py-4 px-8 text-base">
            Lihat Katalog 10 Sampah
          </a>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm font-mono-custom text-xs">
          <span className="text-slate-500 font-bold">COBA INSTAN:</span>
          <button onClick={handleDemoUser} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 transition-colors">
            Demo User (Pak Budi)
          </button>
          <button onClick={handleDemoAdmin} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-emerald-600 transition-colors">
            Demo Admin Kecamatan
          </button>
        </div>
      </div>

      {/* ── 4. CARA KERJA ── */}
      <section id="cara-kerja" className="relative z-10 dark-panel py-20 px-6 border-t border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono-custom text-xs text-emerald-400 font-bold tracking-widest uppercase mb-2">// CARA KERJA</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">MEKANISME PEMILAHAN & PENGANGKUTAN</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Alur pelaporan dari bangunan hingga pengangkutan sampah selesai oleh petugas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01/",
                title: "REGISTRASI BANGUNAN",
                desc: "Daftarkan 1 akun per bangunan (Rumah, Gedung, Pabrik, RS, Hotel, Perkantoran, Tempat Ibadah).",
              },
              {
                step: "02/",
                title: "TIMBANG & INPUT SAMPAH",
                desc: "Pilih dari 10 jenis sampah (Organik, B3, Medis, dll) dan isi berat (Kg) pada form.",
              },
              {
                step: "03/",
                title: "UPLOAD FOTO BUKTI",
                desc: "Lampirkan foto fisik sebagai bukti laporan resmi yang tersimpan di server local /public/uploads.",
              },
              {
                step: "04/",
                title: "PENUGASAN & ANGKUT",
                desc: "Admin Kecamatan tunjuk petugas & buat jadwal pengangkutan. Status berubah Selesai!",
              },
            ].map((card) => (
              <div key={card.step} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 card-lift">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-custom text-xs font-bold text-emerald-400">{card.step}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-sans-custom">{card.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. KATALOG 10 JENIS SAMPAH & EDUKASI ───────────────── */}
      <section id="katalog" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="font-mono-custom text-xs text-emerald-600 font-bold tracking-widest uppercase mb-2">// KATALOG LENGKAP 10 SAMPAH</div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Master 10 Jenis Sampah Kecamatan Senayan</h2>
        <p className="text-slate-500 text-sm mb-8">Pilah sampah bangunan Anda sesuai dengan 10 kategori resmi berikut:</p>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Filter & Cards Grid */}
          <div className="lg:col-span-2 space-y-6">

            {/* Filter Controls & Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="font-mono-custom text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Filter Kategori Sampah:</span>
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-mono-custom font-bold outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "Semua" ? "Semua 10 Jenis Sampah" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dari 10 jenis sampah atau panduan pemilahan..."
                className="input-light"
              />
            </div>

            {/* Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredCatalog.map((item) => {
                const customComments = userComments[item.id] || [];
                const allComments = [...customComments, ...item.comments];
                const totalComments = allComments.length;

                return (
                  <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm card-lift flex flex-col justify-between">
                    <div>
                      {/* Top Image Box */}
                      <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                        <img src={item.image} alt={item.nama} className="w-full h-full object-cover" />
                        
                        <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full font-mono-custom text-[10px] font-black text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                          {item.stokWadah}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-custom text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {item.kategori}
                          </span>
                          <div className="flex items-center gap-1 font-mono-custom text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="text-amber-500">★</span>
                            <span>{item.rating.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">({totalComments})</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 font-sans-custom">{item.nama}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">{item.deskripsi}</p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-mono-custom text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          PANDUAN PEMILAHAN
                        </div>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1 font-mono-custom">
                          <span>{totalComments} Ulasan & Tips</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedItemForTutorial(item)}
                        className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-mono-custom text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Tutorial
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Widgets & Sliders */}
          <div className="space-y-6">

            {/* Widget 1: Photo Banner Slider */}
            <AdCarousel />

            {/* Widget 2: Papan Pengumuman & Pemberitahuan Resmi */}
            <PengumumanBoard />

            {/* Widget 3: Event & Kerja Bakti Sekitar Senayan */}
            <SenayanEventsWidget />

            {/* Widget 4: 10 Jenis Sampah Summary */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-lift">
              <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <Icon name="reports" size={18} className="text-slate-700" />
                <h3 className="font-mono-custom text-xs font-bold uppercase tracking-wider text-slate-900">10 ENTITAS SAMPAH RESMI</h3>
              </div>

              <div className="space-y-2 font-mono-custom text-xs">
                {[
                  { n: "1. Organik" },
                  { n: "2. Anorganik" },
                  { n: "3. B3 (Berbahaya)" },
                  { n: "4. Residu" },
                  { n: "5. Elektronik" },
                  { n: "6. Medis" },
                  { n: "7. Industri" },
                  { n: "8. Komersial" },
                  { n: "9. Pertanian" },
                  { n: "10. Konstruksi" },
                ].map((s) => (
                  <div key={s.n} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800">{s.n}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">TERDATA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 5: CTA Card */}
            <div className="dark-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="font-mono-custom text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">DAFTAR BANGUNAN</div>
              <h3 className="text-xl font-black text-white mb-2">Gratis & Langsung Aktif</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Buat akun bangunan Anda sekarang dan pilih dari 10 jenis sampah untuk dilaporkan.
              </p>
              <Link href="/register" className="btn-eco w-full">
                Daftar Akun Gratis →
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ── 6. FOOTER ─────────────────────────────────────────── */}
      <footer className="relative z-10 text-center py-8 text-slate-400 font-mono-custom text-xs border-t border-slate-200 bg-white flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="EcoSort Senayan Logo" className="w-6 h-6 object-contain" />
          <span className="font-bold text-slate-700">EcoSort Senayan</span>
        </div>
        <div>© 2026 EcoSort Senayan · Sistem Informasi Pemilahan Sampah (10 Kategori Sampah Terdata)</div>
        <div className="text-emerald-600 font-bold mt-0.5">System Online & Ready</div>
      </footer>

      {/* Tutorial & Comment Modal */}
      {selectedItemForTutorial && (
        <TutorialModal
          item={selectedItemForTutorial}
          comments={[...(userComments[selectedItemForTutorial.id] || []), ...selectedItemForTutorial.comments]}
          onClose={() => setSelectedItemForTutorial(null)}
          onAddComment={handleAddComment}
        />
      )}

    </main>
  );
}