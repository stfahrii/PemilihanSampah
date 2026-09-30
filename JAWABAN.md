# Jawaban Praktikum: Penerapan Constraint pada Prisma Schema (Next.js + PostgreSQL)

Dokumen ini berisi jawaban lengkap untuk Soal Praktikum Penerapan Constraint pada Prisma Schema berdasarkan studi kasus aplikasi web **Pengelolaan Sampah**.

---

## Soal 1 (Primary Key dan Unique Constraint) & Soal 2 (Unique Constraint)

### Implementasi pada `schema.prisma`

Berikut adalah definisi model `User`, `JenisSampah`, dan `Wilayah` pada `prisma/schema.prisma` yang memenuhi ketentuan:
- Menggunakan UUID sebagai Primary Key (`id`).
- Email harus unik (`@unique`).
- Nomor HP harus unik (`@unique`).
- Nama wajib diisi (`nama String`, tidak opsional).
- NIK tidak boleh duplikat (`nik String @unique`).
- Nama jenis sampah tidak boleh duplikat (`namaJenis String @unique`).
- Nama wilayah tidak boleh duplikat (`namaWilayah String @unique`).

```prisma
model User {
  id            String          @id @default(uuid())
  nama          String          // Wajib diisi (tidak ada tanda ?)
  email         String          @unique // Harus unik
  noHp          String          @unique // Harus unik
  nik           String          @unique // NIK tidak boleh duplikat
  password      String          // Digunakan untuk kebutuhan autentikasi aplikasi
  laporanSampah LaporanSampah[] // Relasi One-to-Many ke LaporanSampah
}

model JenisSampah {
  id            String          @id @default(uuid())
  namaJenis     String          @unique // Nama jenis sampah tidak boleh duplikat
  laporanSampah LaporanSampah[] // Relasi One-to-Many ke LaporanSampah
}

model Wilayah {
  id            String          @id @default(uuid())
  namaWilayah   String          @unique // Nama wilayah tidak boleh duplikat
  laporanSampah LaporanSampah[] // Relasi One-to-Many ke LaporanSampah
}
```

---

## Soal 3 (Foreign Key Constraint)

### Implementasi pada `schema.prisma`

Berikut adalah definisi model `LaporanSampah` yang menghubungkan `User`, `JenisSampah`, dan `Wilayah`:
- **Satu User** dapat memiliki banyak laporan (`User.laporanSampah`).
- **Satu Jenis Sampah** dapat digunakan pada banyak laporan (`JenisSampah.laporanSampah`).
- **Satu Wilayah** dapat memiliki banyak laporan (`Wilayah.laporanSampah`).
- Jika `User` dihapus, seluruh laporannya ikut terhapus (`onDelete: Cascade`).
- Jika `Jenis Sampah` atau `Wilayah` masih digunakan pada laporan, data tersebut tidak boleh dihapus (`onDelete: Restrict`).

```prisma
model LaporanSampah {
  id            String      @id @default(uuid())
  berat         Float
  tanggalLapor  DateTime    @default(now())
  userId        String
  jenisSampahId String
  wilayahId     String
  
  // onDelete: Cascade -> jika User dihapus, LaporanSampah miliknya juga terhapus
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // onDelete: Restrict -> jika JenisSampah/Wilayah masih digunakan di laporan, penghapusan ditolak
  jenisSampah   JenisSampah @relation(fields: [jenisSampahId], references: [id], onDelete: Restrict)
  wilayah       Wilayah     @relation(fields: [wilayahId], references: [id], onDelete: Restrict)
  
  fotoSampah    FotoSampah? // Relasi One-to-One ke FotoSampah
}
```

### Penjelasan Constraint `onDelete`:
1. **`onDelete: Cascade` (pada relasi `User`):**
   Memastikan integritas referensial di mana jika data induk (`User`) dihapus, sistem PostgreSQL secara otomatis akan menghapus semua baris data anak (`LaporanSampah`) yang merujuk pada `User` tersebut. Hal ini mencegah terjadinya data yatim piatu (*orphan data*).
2. **`onDelete: Restrict` (pada relasi `JenisSampah` dan `Wilayah`):**
   Mencegah penghapusan data master (`JenisSampah` atau `Wilayah`) jika masih ada data transaksi (`LaporanSampah`) yang menggunakannya. Database akan melempar error dan membatalkan operasi penghapusan demi menjaga keakuratan riwayat laporan.

---

## Soal 4 (One-to-One Relationship)

### Implementasi pada `schema.prisma`

Untuk memastikan hubungan **One-to-One** antara `LaporanSampah` dan `FotoSampah` (satu laporan hanya memiliki satu foto, dan setiap foto terhubung ke tepat satu laporan):

```prisma
model FotoSampah {
  id        String        @id @default(uuid())
  imageUrl  String
  laporanId String        @unique // Menjamin One-to-One Relationship
  laporan   LaporanSampah @relation(fields: [laporanId], references: [id], onDelete: Cascade)
}
```

### Penjelasan Hubungan One-to-One:
Untuk membuat relasi 1:1 di Prisma, kita harus meletakkan constraint `@unique` pada kolom foreign key (`laporanId`) di salah satu sisi relasi (dalam hal ini `FotoSampah`). 
- Constraint `@unique` pada `laporanId` memastikan bahwa tidak boleh ada dua baris data `FotoSampah` yang merujuk pada `laporanId` yang sama.
- Dengan demikian, satu `LaporanSampah` hanya dapat memiliki tepat satu `FotoSampah`.

---

## Soal 5 (Validasi Constraint)

Tabel berikut menjelaskan cara terbaik untuk memastikan aturan-aturan bisnis di bawah ini berjalan dengan aman di aplikasi Next.js + PostgreSQL:

| No | Aturan Bisnis | Tempat Penerapan | Penjelasan & Alasan |
| :--- | :--- | :--- | :--- |
| **1** | **Berat sampah harus lebih dari 0 kg** | **PostgreSQL** dan **Next.js** | **Next.js**: Validasi menggunakan Zod schema (misal: `z.number().positive()`) di server action atau API route untuk memberikan respons error yang ramah pengguna.<br>**PostgreSQL**: Menggunakan **CHECK Constraint** (`CHECK (berat > 0)`) langsung di tingkat basis data sebagai pertahanan terakhir (*last line of defense*) karena Prisma Schema tidak mendukung check constraint numerik secara bawaan. |
| **2** | **Email tidak boleh sama** | **Prisma Schema** & **Next.js** | **Prisma**: Menambahkan decorator `@unique` pada field email, yang secara otomatis diterjemahkan menjadi **UNIQUE index/constraint** di PostgreSQL.<br>**Next.js**: Melakukan query pengecekan email sebelum menyimpan data baru (`prisma.user.findUnique`) agar bisa menampilkan pesan error yang ramah tanpa menyebabkan database melemparkan *database exception error*. |
| **3** | **Nama wilayah tidak boleh kosong** | **Prisma Schema** & **Next.js** | **Prisma Schema & PostgreSQL**: Field didefinisikan sebagai `namaWilayah String` (bukan opsional `String?`), sehingga terbuat sebagai **NOT NULL** di PostgreSQL.<br>**Next.js**: Validasi form (misal: `z.string().min(1)`) untuk menyaring string kosong (`""`) atau string berisi spasi saja (`"   "`), karena database NOT NULL masih memperbolehkan string kosong masuk. |
| **4** | **Setiap laporan harus memiliki foto** | **Next.js** | Karena foreign key terletak di model `FotoSampah`, relasi di `LaporanSampah` harus bersifat opsional secara skema database (`fotoSampah FotoSampah?`) untuk menghindari masalah siklus pembuatan data (*chicken-and-egg problem*).<br>Oleh karena itu, aturan ini **wajib diterapkan di Next.js** dengan cara: memvalidasi bahwa input foto telah diunggah di form, lalu menyimpannya dalam **Prisma Transaction (`$transaction`)** untuk memastikan data `LaporanSampah` dan `FotoSampah` dibuat secara bersamaan (atomik). |

---

## Bonus (Composite Unique Constraint)

### Sintaks Prisma (`schema.prisma`)

Untuk menambahkan constraint unik gabungan (*composite unique*) pada model `LaporanSampah`, kita menggunakan block attribute `@@unique` di tingkat model:

```prisma
model LaporanSampah {
  id            String      @id @default(uuid())
  berat         Float
  tanggalLapor  DateTime    @default(now())
  userId        String
  jenisSampahId String
  wilayahId     String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  jenisSampah   JenisSampah @relation(fields: [jenisSampahId], references: [id], onDelete: Restrict)
  wilayah       Wilayah     @relation(fields: [wilayahId], references: [id], onDelete: Restrict)
  fotoSampah    FotoSampah?

  // Composite Unique Constraint (Bonus)
  @@unique([userId, jenisSampahId, tanggalLapor, wilayahId])
}
```

### Fungsi Constraint
*Composite Unique Constraint* `@@unique([userId, jenisSampahId, tanggalLapor, wilayahId])` berfungsi untuk memastikan bahwa **tidak boleh ada kombinasi nilai yang sama** untuk keempat kolom tersebut di dalam database.
- **Kasus Penggunaan:** Seorang pengguna (`userId`) tidak diperbolehkan mengirimkan dua laporan terpisah dengan jenis sampah yang sama (`jenisSampahId`) pada waktu yang sama (`tanggalLapor`) di wilayah yang sama (`wilayahId`).
- Jika aplikasi mencoba menyimpan laporan baru dengan kombinasi nilai yang sama yang sudah ada di database, PostgreSQL akan menolak dan Prisma akan mengembalikan error kode `P2002` (Unique constraint failed).
- **Catatan Praktis:** Karena `tanggalLapor` menyimpan data tanggal dan waktu (timestamp), constraint ini berlaku untuk detil waktu yang sama persis. Di Next.js, jika ingin membatasi laporan per *hari kalender*, kita perlu memotong waktu ke pukul `00:00:00` sebelum menyimpan nilai `tanggalLapor` ke database.
