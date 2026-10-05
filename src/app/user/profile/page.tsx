"use client";

import { useEffect, useRef, useState } from "react";

/* ── Types ───────────────────────────────────────────────── */
type UserData = {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  nik: string;
  alamat: string;
  rt?: string;
  rw?: string;
  role: string;
  fotoProfil?: string;
  createdAt: string;
  jenisBangunan?: { namaJenisBangunan: string };
  wilayah?: { namaWilayah: string; kelurahan: string; kecamatan: string };
};

/* ── Helpers ─────────────────────────────────────────────── */
function initials(nama?: string | null) {
  if (!nama || typeof nama !== "string") return "U";
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const [user, setUser]       = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode]   = useState(false);
  const [preview, setPreview]     = useState<string | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragOver, setDragOver]   = useState(false);

  /* form fields */
  const [form, setForm] = useState({ nama: "", noHp: "", alamat: "", rt: "", rw: "" });

  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Load user ─────────────────────────────────────────── */
  useEffect(() => {
    const userId = sessionStorage.getItem("userId") ?? "";
    const storedNama = sessionStorage.getItem("userNama") ?? "Rumah Pak Budi";
    if (!userId) { setLoading(false); return; }

    fetch(`/api/user/${userId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Gagal mengambil data profil dari server.");
        return r.json();
      })
      .then((data: any) => {
        if (!data || data.error || !data.nama) {
          throw new Error(data?.error || "Data profil tidak valid.");
        }
        setUser(data);
        setForm({
          nama: data.nama ?? storedNama,
          noHp: data.noHp ?? "",
          alamat: data.alamat ?? "",
          rt: data.rt ?? "",
          rw: data.rw ?? "",
        });
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo user jika API gagal atau menggunakan akun demo
        const fallbackUser: UserData = {
          id: userId || "demo-user-id",
          nama: storedNama,
          email: "pakbudi.demo@ecosort.id",
          noHp: "081298765432",
          nik: "3171012345670001",
          alamat: "Jl. Bendungan Hilir No. 42",
          rt: "003",
          rw: "001",
          role: "User",
          createdAt: "2026-01-15T08:00:00.000Z",
          jenisBangunan: { namaJenisBangunan: "Rumah" },
          wilayah: { namaWilayah: "Bendungan Hilir", kelurahan: "Benhil", kecamatan: "Tanah Abang" },
        };
        setUser(fallbackUser);
        setForm({
          nama: fallbackUser.nama,
          noHp: fallbackUser.noHp,
          alamat: fallbackUser.alamat,
          rt: fallbackUser.rt ?? "",
          rw: fallbackUser.rw ?? "",
        });
        setLoading(false);
      });
  }, []);

  /* ── Avatar upload ─────────────────────────────────────── */
  async function handleAvatarFile(file: File) {
    if (!user) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("error", "Format file harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Ukuran foto maksimal 5 MB.");
      return;
    }

    // Preview instantly
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error(uploadData.error ?? "Upload gagal.");

      // Save path to database
      const patchRes = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fotoProfil: uploadData.pathFile }),
      });
      const updated: UserData = await patchRes.json();
      setUser(updated);
      setPreview(null);
      showToast("success", "Foto profil berhasil diperbarui! 🎉");
    } catch (e) {
      setPreview(null);
      showToast("error", e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleAvatarFile(file);
    e.target.value = ""; // reset input
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarFile(file);
  }

  /* ── Save profile edits ────────────────────────────────── */
  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal menyimpan perubahan.");
      const updated: UserData = await res.json();
      setUser(updated);
      if (updated.nama) sessionStorage.setItem("userNama", updated.nama);
      setEditMode(false);
      showToast("success", "Profil berhasil diperbarui! ✅");
    } catch (e) {
      if (user.id === "demo-user-id") {
        setUser((prev) => prev ? { ...prev, ...form } : prev);
        if (form.nama) sessionStorage.setItem("userNama", form.nama);
        setEditMode(false);
        showToast("success", "Profil demo berhasil diperbarui! ✅");
      } else {
        showToast("error", e instanceof Error ? e.message : "Gagal menyimpan.");
      }
    } finally {
      setSaving(false);
    }
  }

  /* ── Render states ─────────────────────────────────────── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="text-center py-20 text-slate-400">Gagal memuat profil. Silakan login ulang.</div>
  );

  const avatarSrc = preview ?? user.fotoProfil ?? null;

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "var(--sans)" }}>
      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div
          className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          style={{ position: "fixed", top: 24, right: 24, zIndex: 9999 }}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Profil Saya</h1>
          <p style={{ margin: 0 }}>Kelola informasi akun dan bangunan Anda</p>
        </div>
        {user.fotoProfil && (
          <button
            onClick={async () => {
              await fetch(`/api/user/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fotoProfil: null }),
              });
              setUser((u) => u ? { ...u, fotoProfil: undefined } : u);
              showToast("success", "Foto profil berhasil dihapus.");
            }}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Hapus Foto Profil
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          HERO CARD — Avatar + Info Utama
      ════════════════════════════════════════════════════ */}
      <div
        className="rounded-3xl mb-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #062414 0%, #0B3820 50%, #16A34A 100%)",
          boxShadow: "0 20px 60px rgba(22,163,74,0.25)",
        }}
      >
        {/* Top gradient strip */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #4ade80, #16a34a, #14b8a6)" }} />

        <div className="p-8 flex flex-col items-center gap-4">
          {/* ── Avatar with upload zone ─────────────────── */}
          <div className="relative group">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer select-none"
              style={{ position: "relative", width: 120, height: 120 }}
              title="Klik atau seret foto untuk mengganti"
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: dragOver ? "3px dashed #4ade80" : "3px solid rgba(255,255,255,0.25)",
                  background: avatarSrc ? "transparent" : "linear-gradient(135deg, #16a34a, #4ade80)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.2s, transform 0.2s",
                  transform: dragOver ? "scale(1.05)" : "scale(1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Foto Profil"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: -2 }}>
                    {initials(user.nama)}
                  </span>
                )}
              </div>

              {/* Hover overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: uploading ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
                className="group-hover:opacity-100"
              >
                {uploading ? (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      border: "3px solid #4ade80",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: 22 }}>📷</span>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 600, marginTop: 2 }}>Ganti Foto</span>
                  </>
                )}
              </div>

              {/* Edit badge */}
              {!uploading && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#16a34a",
                    border: "2px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  ✏️
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={onFileChange}
            />
          </div>

          {/* ── Name & Info ─────────────────────────────── */}
          <div className="text-center">
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
              {user.nama}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: "4px 0 10px" }}>{user.email}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "rgba(74,222,128,0.2)",
                  border: "1px solid rgba(74,222,128,0.4)",
                  color: "#4ade80",
                  borderRadius: 20,
                  padding: "3px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                ✅ {user.role}
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  borderRadius: 20,
                  padding: "3px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                🏢 {user.jenisBangunan?.namaJenisBangunan ?? "-"}
              </span>
            </div>
          </div>

          {/* ── Upload hint ──────────────────────────────── */}
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: 0, textAlign: "center" }}>
            Klik foto atau seret gambar ke lingkaran untuk mengganti • JPG, PNG, WebP • Maks 5 MB
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          DATA PRIBADI CARD
      ════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", margin: 0 }}>📋 Data Pribadi</h3>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              style={{
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ✏️ Edit Profil
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setEditMode(false); setForm({ nama: user.nama, noHp: user.noHp ?? "", alamat: user.alamat ?? "", rt: user.rt ?? "", rw: user.rw ?? "" }); }}
                style={{
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving ? "#86efac" : "linear-gradient(135deg, #16a34a, #4ade80)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {saving ? "Menyimpan…" : "💾 Simpan"}
              </button>
            </div>
          )}
        </div>

        {editMode ? (
          /* ── Edit Form ───────────────────────────────── */
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Nama Lengkap", key: "nama", type: "text", placeholder: "Nama lengkap Anda" },
              { label: "Nomor HP / WhatsApp", key: "noHp", type: "tel", placeholder: "08xxxxxxxxxx" },
              { label: "Alamat Lengkap", key: "alamat", type: "text", placeholder: "Jl. Contoh No. 1" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="input-base"
                  style={{ width: "100%" }}
                />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "RT", key: "rt", placeholder: "001" },
                { label: "RW", key: "rw", placeholder: "005" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="input-base"
                    style={{ width: "100%" }}
                  />
                </div>
              ))}
            </div>
            {/* Read-only fields notice */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, fontWeight: 600 }}>
                🔒 Email dan NIK tidak dapat diubah sendiri
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                Untuk perubahan data kritis, hubungi Admin Kecamatan Senayan melalui:
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a
                  href="mailto:admin@ecosort.id"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    color: "#16a34a", borderRadius: 8, padding: "6px 12px",
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                  }}
                >
                  admin@ecosort.id
                </a>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20ingin%20mengubah%20data%20akun%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    color: "#16a34a", borderRadius: 8, padding: "6px 12px",
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                  }}
                >
                  WhatsApp Admin
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ── View Mode ───────────────────────────────── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Nama Lengkap", value: user.nama },
              { label: "Email", value: user.email },
              { label: "Nomor HP", value: user.noHp },
              { label: "NIK", value: user.nik },
              { label: "RT / RW", value: `${user.rt ?? "-"} / ${user.rw ?? "-"}` },
              {
                label: "Bergabung",
                value: user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
                  : "15 Januari 2026",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{value ?? "-"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          INFORMASI BANGUNAN CARD
      ════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", margin: "0 0 20px" }}>Informasi Bangunan</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Jenis Bangunan", value: user.jenisBangunan?.namaJenisBangunan },
            { label: "Wilayah", value: user.wilayah?.namaWilayah },
            { label: "Kelurahan", value: user.wilayah?.kelurahan },
            { label: "Kecamatan", value: user.wilayah?.kecamatan },
            { label: "Alamat", value: user.alamat },
            { label: "RT / RW", value: `${user.rt ?? "-"} / ${user.rw ?? "-"}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "#f0fdf4",
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid #dcfce7",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{value ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
