--
-- PostgreSQL database dump
--

\restrict c6HIJ9rqkdI322cyjCcL6NatjnWq0mlV8pl4MDPmSYmLaUhRpU8SoRwIgXnVC1b

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: DetailPemilahan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetailPemilahan" (
    id text NOT NULL,
    berat numeric(10,2) NOT NULL,
    keterangan text,
    "laporanId" text NOT NULL,
    "jenisSampahId" text NOT NULL
);


ALTER TABLE public."DetailPemilahan" OWNER TO postgres;

--
-- Name: FotoSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FotoSampah" (
    id text NOT NULL,
    "namaFile" text NOT NULL,
    "pathFile" text NOT NULL,
    "tanggalUpload" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "laporanId" text NOT NULL
);


ALTER TABLE public."FotoSampah" OWNER TO postgres;

--
-- Name: JadwalPengangkutan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JadwalPengangkutan" (
    id text NOT NULL,
    "tanggalAngkut" date NOT NULL,
    "jamAngkut" time(6) without time zone NOT NULL,
    "statusPengangkutan" text DEFAULT 'Terjadwal'::text NOT NULL,
    "laporanId" text NOT NULL,
    "petugasId" text NOT NULL,
    "wilayahId" text NOT NULL
);


ALTER TABLE public."JadwalPengangkutan" OWNER TO postgres;

--
-- Name: JenisBangunan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisBangunan" (
    id text NOT NULL,
    "namaJenisBangunan" text NOT NULL
);


ALTER TABLE public."JenisBangunan" OWNER TO postgres;

--
-- Name: JenisSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisSampah" (
    id text NOT NULL,
    "namaJenis" text NOT NULL,
    deskripsi text
);


ALTER TABLE public."JenisSampah" OWNER TO postgres;

--
-- Name: PemilahanSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PemilahanSampah" (
    id text NOT NULL,
    "tanggalLapor" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'Menunggu'::text NOT NULL,
    "userId" text NOT NULL,
    "petugasId" text,
    "jenisSampahId" text,
    "wilayahId" text
);


ALTER TABLE public."PemilahanSampah" OWNER TO postgres;

--
-- Name: Petugas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Petugas" (
    id text NOT NULL,
    "namaPetugas" text NOT NULL,
    email text NOT NULL,
    "noHp" text NOT NULL,
    jabatan text NOT NULL,
    status text DEFAULT 'Aktif'::text NOT NULL
);


ALTER TABLE public."Petugas" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "noHp" text NOT NULL,
    nik text NOT NULL,
    password text NOT NULL,
    alamat text NOT NULL,
    rt text,
    rw text,
    role text DEFAULT 'User'::text NOT NULL,
    "fotoProfil" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "jenisBangunanId" text NOT NULL,
    "wilayahId" text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Wilayah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilayah" (
    id text NOT NULL,
    "namaWilayah" text NOT NULL,
    kelurahan text NOT NULL,
    kecamatan text NOT NULL
);


ALTER TABLE public."Wilayah" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: DetailPemilahan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetailPemilahan" (id, berat, keterangan, "laporanId", "jenisSampahId") FROM stdin;
\.


--
-- Data for Name: FotoSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FotoSampah" (id, "namaFile", "pathFile", "tanggalUpload", "laporanId") FROM stdin;
\.


--
-- Data for Name: JadwalPengangkutan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPengangkutan" (id, "tanggalAngkut", "jamAngkut", "statusPengangkutan", "laporanId", "petugasId", "wilayahId") FROM stdin;
\.


--
-- Data for Name: JenisBangunan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisBangunan" (id, "namaJenisBangunan") FROM stdin;
67223ebb-417c-4467-a5a0-4c57fd98af00	Rumah
391c7e72-5345-470c-a348-b2db02b080f4	Gedung
dfbce0da-fae5-4ed1-9ac6-448ba0b15d38	Pabrik
ccc5797b-1947-4cac-82cd-bc18af53c3e9	Rumah Sakit
f9e44c00-e80c-4748-9521-22b867cd845d	Hotel
ecf56e41-e534-4e9c-b086-c4566d81e50f	Mall
24631bfe-549f-4228-8cd6-cbfeffeb192e	Sekolah
03c38555-7571-46a1-b6bb-688bb4bc8df2	Perkantoran
a3247fd6-3ab3-4e1f-8747-9582b605105f	Tempat Ibadah
abc725cf-16d5-46b7-afd2-2c1fbb304280	Bangunan Lainnya
\.


--
-- Data for Name: JenisSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisSampah" (id, "namaJenis", deskripsi) FROM stdin;
528af5a5-94a7-4add-b9b0-e59e63219d1b	Organik	Sampah mudah terurai seperti sisa makanan, dedaunan
a2667b30-4ec4-4c36-9b3b-4342fa67caa2	Anorganik	Plastik, kaca, logam, kertas
609ec15f-4908-4910-98b9-97c686ce5366	B3	Bahan berbahaya dan beracun
286e8961-258a-4f1c-8697-639f5b2540b0	Residu	Sampah yang tidak dapat didaur ulang
062b79f2-ebf9-433d-9f88-ba5a83ea7865	Elektronik	Sampah peralatan elektronik
f0cac20b-ad98-4f6a-a581-2e146b88817f	Medis	Limbah rumah sakit dan fasilitas kesehatan
c3a200fa-bea0-48d6-893d-3e93580be2ab	Industri	Limbah sisa proses produksi pabrik
060a6c80-b597-4951-8255-c3cef0b9310c	Komersial	Limbah dari kegiatan usaha dan perdagangan
189aa1e6-0f8a-452f-b967-5c159c1eb35a	Pertanian	Limbah dari kegiatan pertanian dan perkebunan
6ba84697-50e4-48e1-8f9f-b7c7e7243464	Konstruksi	Puing dan sisa material bangunan
\.


--
-- Data for Name: PemilahanSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PemilahanSampah" (id, "tanggalLapor", status, "userId", "petugasId", "jenisSampahId", "wilayahId") FROM stdin;
\.


--
-- Data for Name: Petugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Petugas" (id, "namaPetugas", email, "noHp", jabatan, status) FROM stdin;
4c1ef30c-23c2-4084-8f19-7a637d9b50d6	Ahmad Fauzi	ahmad@senayan.go.id	081234567801	Koordinator	Aktif
b48e7ad0-0283-4dc9-9fb6-7bc6b441bd79	Rina Lestari	rina@senayan.go.id	081234567802	Petugas Lapangan	Aktif
bd4b76f7-dd00-45dd-902d-5a75053ff059	Budi Santoso	budi@senayan.go.id	081234567803	Pengemudi	Aktif
b8a5ba7f-7c11-44a2-823c-56506c5e522f	Siti Rahma	siti@senayan.go.id	081234567804	Petugas Lapangan	Aktif
8ae94b6c-a1fb-4243-9f64-e3f7f6b68ae2	Dedi Kurniawan	dedi@senayan.go.id	081234567805	Admin	Aktif
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nama, email, "noHp", nik, password, alamat, rt, rw, role, "fotoProfil", "createdAt", "updatedAt", "jenisBangunanId", "wilayahId") FROM stdin;
e40d2921-a6e6-4359-9480-58341ff60469	Admin Kecamatan	admin@ecosort.id	081000000000	0000000000000001	$2b$10$kLvakKfetujCZB3g/QLiaOvM/WFTWO3lxL0BBKYTK0VOT8dZsCPii	Jl. Admin No. 1, Senayan	\N	\N	Admin	\N	2026-08-03 04:17:26.162	2026-08-03 04:17:26.162	03c38555-7571-46a1-b6bb-688bb4bc8df2	ec746bdb-5f66-45f6-9d41-6adb95129e4c
\.


--
-- Data for Name: Wilayah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilayah" (id, "namaWilayah", kelurahan, kecamatan) FROM stdin;
18b84959-da71-4646-8317-ef277deb9902	RW 01	Senayan	Kebayoran Baru
a6b11db6-c71d-4070-8b39-d59adad1cd29	RW 02	Senayan	Kebayoran Baru
2d1121cb-a566-4da2-b613-f403b086c516	RW 03	Senayan	Kebayoran Baru
c61b2919-9a40-43fb-86b7-2fdeee714d3c	RW 04	Senayan	Kebayoran Baru
3cd860a3-bc19-4c90-880b-679125e5e0ed	Area GBK	Gelora	Tanah Abang
ec746bdb-5f66-45f6-9d41-6adb95129e4c	Komplek DPR	Gelora	Tanah Abang
40f1a07b-4e56-48c1-884a-80c4b2da71d5	Bendungan Hilir	Benhil	Tanah Abang
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
89fe0a7c-c48b-4ff6-a80c-f9da4c4156e4	a8f8e8dfcc277b8803316136a7e53dc41b8266760efd0249c74230b619b1dcbf	2026-08-03 11:16:25.244832+07	20260803041624_init_with_fk_constraints	\N	\N	2026-08-03 11:16:24.907349+07	1
\.


--
-- Name: DetailPemilahan DetailPemilahan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetailPemilahan"
    ADD CONSTRAINT "DetailPemilahan_pkey" PRIMARY KEY (id);


--
-- Name: FotoSampah FotoSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_pkey" PRIMARY KEY (id);


--
-- Name: JadwalPengangkutan JadwalPengangkutan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_pkey" PRIMARY KEY (id);


--
-- Name: JenisBangunan JenisBangunan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisBangunan"
    ADD CONSTRAINT "JenisBangunan_pkey" PRIMARY KEY (id);


--
-- Name: JenisSampah JenisSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_pkey" PRIMARY KEY (id);


--
-- Name: PemilahanSampah PemilahanSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PemilahanSampah"
    ADD CONSTRAINT "PemilahanSampah_pkey" PRIMARY KEY (id);


--
-- Name: Petugas Petugas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Petugas"
    ADD CONSTRAINT "Petugas_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wilayah Wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilayah"
    ADD CONSTRAINT "Wilayah_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: DetailPemilahan_laporanId_jenisSampahId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "DetailPemilahan_laporanId_jenisSampahId_key" ON public."DetailPemilahan" USING btree ("laporanId", "jenisSampahId");


--
-- Name: FotoSampah_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON public."FotoSampah" USING btree ("laporanId");


--
-- Name: JadwalPengangkutan_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JadwalPengangkutan_laporanId_key" ON public."JadwalPengangkutan" USING btree ("laporanId");


--
-- Name: JenisBangunan_namaJenisBangunan_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisBangunan_namaJenisBangunan_key" ON public."JenisBangunan" USING btree ("namaJenisBangunan");


--
-- Name: JenisSampah_namaJenis_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON public."JenisSampah" USING btree ("namaJenis");


--
-- Name: Petugas_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Petugas_email_key" ON public."Petugas" USING btree (email);


--
-- Name: Petugas_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Petugas_noHp_key" ON public."Petugas" USING btree ("noHp");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_email_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_noHp_key" ON public."User" USING btree (email, "noHp");


--
-- Name: User_nik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_nik_key" ON public."User" USING btree (nik);


--
-- Name: User_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_noHp_key" ON public."User" USING btree ("noHp");


--
-- Name: Wilayah_namaWilayah_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON public."Wilayah" USING btree ("namaWilayah");


--
-- Name: DetailPemilahan DetailPemilahan_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetailPemilahan"
    ADD CONSTRAINT "DetailPemilahan_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DetailPemilahan DetailPemilahan_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetailPemilahan"
    ADD CONSTRAINT "DetailPemilahan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."PemilahanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FotoSampah FotoSampah_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."PemilahanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JadwalPengangkutan JadwalPengangkutan_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."PemilahanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JadwalPengangkutan JadwalPengangkutan_petugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES public."Petugas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JadwalPengangkutan JadwalPengangkutan_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PemilahanSampah PemilahanSampah_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PemilahanSampah"
    ADD CONSTRAINT "PemilahanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PemilahanSampah PemilahanSampah_petugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PemilahanSampah"
    ADD CONSTRAINT "PemilahanSampah_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES public."Petugas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PemilahanSampah PemilahanSampah_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PemilahanSampah"
    ADD CONSTRAINT "PemilahanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PemilahanSampah PemilahanSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PemilahanSampah"
    ADD CONSTRAINT "PemilahanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_jenisBangunanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_jenisBangunanId_fkey" FOREIGN KEY ("jenisBangunanId") REFERENCES public."JenisBangunan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict c6HIJ9rqkdI322cyjCcL6NatjnWq0mlV8pl4MDPmSYmLaUhRpU8SoRwIgXnVC1b

