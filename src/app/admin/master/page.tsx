"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  getJenisBangunanList, createJenisBangunanAction, updateJenisBangunanAction, deleteJenisBangunanAction,
  getWilayahList, createWilayahAction, updateWilayahAction, deleteWilayahAction,
  getJenisSampahList, createJenisSampahAction, updateJenisSampahAction, deleteJenisSampahAction,
  createPetugasAction, updatePetugasAction, deletePetugasAction,
  getUsersList, updateUserAction, deleteUserAction,
} from "@/actions/master.action";
import { getAllPetugas } from "@/actions/laporan.action";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Icon from "@/components/ui/Icon";

// ── HELPER: Upload foto ke /api/upload/petugas ─────────────────
async function uploadFotoPetugas(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload/petugas", { method: "POST", body: fd });
  if (!res.ok) return null;
  const data = await res.json();
  return data.pathFile ?? null;
}

// ── AVATAR COMPONENT ───────────────────────────────────────────
function Avatar({ src, alt, size = 40 }: { src?: string | null; alt: string; size?: number }) {
  const initials = alt.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (src) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <Image src={src} alt={alt} width={size} height={size} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
    );
  }
  const colors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  const color = colors[alt.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function AdminMasterPage() {
  const [tab, setTab] = useState<"bangunan" | "wilayah" | "sampah" | "petugas" | "users">("bangunan");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Lists
  const [bangunanList, setBangunanList] = useState<any[]>([]);
  const [wilayahList, setWilayahList] = useState<any[]>([]);
  const [sampahList, setSampahList] = useState<any[]>([]);
  const [petugasList, setPetugasList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // ── CONFIRM DIALOG STATE ──────────────────────
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm: () => void }>({
    open: false,
    message: "",
    onConfirm: () => {}
  });

  // Add state inputs
  const [newBangunan, setNewBangunan] = useState("");
  const [newWilayah, setNewWilayah] = useState({ namaWilayah: "", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" });
  const [newSampah, setNewSampah] = useState({ namaJenis: "", deskripsi: "" });
  const [newPetugas, setNewPetugas] = useState({ namaPetugas: "", email: "", noHp: "", jabatan: "Petugas Lapangan" });

  // Photo upload state (for Add Petugas form)
  const [newPetugasPhoto, setNewPetugasPhoto] = useState<File | null>(null);
  const [newPetugasPhotoPreview, setNewPetugasPhotoPreview] = useState<string | null>(null);
  const [addPhotoLoading, setAddPhotoLoading] = useState(false);
  const addFileRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [editItem, setEditItem] = useState<{ type: string; data: any } | null>(null);
  // Edit photo state (for Edit Petugas modal)
  const [editPetugasPhoto, setEditPetugasPhoto] = useState<File | null>(null);
  const [editPetugasPhotoPreview, setEditPetugasPhotoPreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  // View user photo modal
  const [viewUser, setViewUser] = useState<any | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function reloadAll() {
    setLoading(true);
    Promise.all([
      getJenisBangunanList(),
      getWilayahList(),
      getJenisSampahList(),
      getAllPetugas(),
      getUsersList(),
    ]).then(([b, w, s, p, u]) => {
      setBangunanList(b);
      setWilayahList(w);
      setSampahList(s);
      setPetugasList(p);
      setUsersList(u);
      setLoading(false);
    });
  }

  useEffect(() => { reloadAll(); }, []);

  // ── ADD HANDLERS ───────────────────────────────────────────
  async function handleAddBangunan(e: React.FormEvent) {
    e.preventDefault();
    const res = await createJenisBangunanAction(newBangunan);
    if (res.success) { showToast("success", res.message); setNewBangunan(""); reloadAll(); }
    else showToast("error", res.message);
  }

  async function handleAddWilayah(e: React.FormEvent) {
    e.preventDefault();
    const res = await createWilayahAction(newWilayah.namaWilayah, newWilayah.kelurahan, newWilayah.kecamatan);
    if (res.success) { showToast("success", res.message); setNewWilayah({ namaWilayah: "", kelurahan: "Senayan", kecamatan: "Kebayoran Baru" }); reloadAll(); }
    else showToast("error", res.message);
  }

  async function handleAddSampah(e: React.FormEvent) {
    e.preventDefault();
    const res = await createJenisSampahAction(newSampah.namaJenis, newSampah.deskripsi);
    if (res.success) { showToast("success", res.message); setNewSampah({ namaJenis: "", deskripsi: "" }); reloadAll(); }
    else showToast("error", res.message);
  }

  async function handleAddPetugas(e: React.FormEvent) {
    e.preventDefault();
    setAddPhotoLoading(true);
    try {
      let fotoPath: string | undefined;
      if (newPetugasPhoto) {
        const uploaded = await uploadFotoPetugas(newPetugasPhoto);
        if (!uploaded) { showToast("error", "Gagal upload foto. Coba lagi."); return; }
        fotoPath = uploaded;
      }
      const res = await createPetugasAction(newPetugas.namaPetugas, newPetugas.email, newPetugas.noHp, newPetugas.jabatan, fotoPath);
      if (res.success) {
        showToast("success", res.message);
        setNewPetugas({ namaPetugas: "", email: "", noHp: "", jabatan: "Petugas Lapangan" });
        setNewPetugasPhoto(null);
        setNewPetugasPhotoPreview(null);
        reloadAll();
      } else showToast("error", res.message);
    } finally {
      setAddPhotoLoading(false);
    }
  }

  // ── EDIT HANDLERS ──────────────────────────────────────────
  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    let res: { success: boolean; message: string } = { success: false, message: "" };

    if (editItem.type === "bangunan") {
      res = await updateJenisBangunanAction(editItem.data.id, editItem.data.namaJenisBangunan);
    } else if (editItem.type === "wilayah") {
      res = await updateWilayahAction(editItem.data.id, editItem.data.namaWilayah, editItem.data.kelurahan, editItem.data.kecamatan);
    } else if (editItem.type === "sampah") {
      res = await updateJenisSampahAction(editItem.data.id, editItem.data.namaJenis, editItem.data.deskripsi);
    } else if (editItem.type === "petugas") {
      let fotoPath: string | undefined;
      if (editPetugasPhoto) {
        const uploaded = await uploadFotoPetugas(editPetugasPhoto);
        if (!uploaded) { showToast("error", "Gagal upload foto. Coba lagi."); return; }
        fotoPath = uploaded;
      }
      res = await updatePetugasAction(
        editItem.data.id,
        editItem.data.namaPetugas,
        editItem.data.email,
        editItem.data.noHp,
        editItem.data.jabatan,
        editItem.data.status || "Aktif",
        fotoPath,
      );
    } else if (editItem.type === "user") {
      res = await updateUserAction(editItem.data.id, editItem.data.nama, editItem.data.email, editItem.data.noHp, editItem.data.nik);
    }

    if (res.success) {
      showToast("success", res.message);
      setEditItem(null);
      setEditPetugasPhoto(null);
      setEditPetugasPhotoPreview(null);
      reloadAll();
    } else {
      showToast("error", res.message);
    }
  }

  // ── DELETE HANDLERS ────────────────────────────────────────
  async function handleDeleteBangunan(id: string) {
    setConfirm({ open: true, message: "Hapus jenis bangunan ini?", onConfirm: async () => {
      const res = await deleteJenisBangunanAction(id);
      if (res.success) { showToast("success", res.message); reloadAll(); }
      else showToast("error", res.message);
    } });
  }

  async function handleDeleteWilayah(id: string) {
    setConfirm({ open: true, message: "Hapus wilayah ini?", onConfirm: async () => {
      const res = await deleteWilayahAction(id);
      if (res.success) { showToast("success", res.message); reloadAll(); }
      else showToast("error", res.message);
    } });
  }

  async function handleDeleteSampah(id: string) {
    setConfirm({ open: true, message: "Hapus jenis sampah ini?", onConfirm: async () => {
      const res = await deleteJenisSampahAction(id);
      if (res.success) { showToast("success", res.message); reloadAll(); }
      else showToast("error", res.message);
    } });
  }

  async function handleDeletePetugas(id: string) {
    setConfirm({ open: true, message: "Hapus petugas ini?", onConfirm: async () => {
      const res = await deletePetugasAction(id);
      if (res.success) { showToast("success", res.message); reloadAll(); }
      else showToast("error", res.message);
    } });
  }

  async function handleDeleteUser(id: string) {
    setConfirm({ open: true, message: "Hapus pengguna ini?", onConfirm: async () => {
      const res = await deleteUserAction(id);
      if (res.success) { showToast("success", res.message); reloadAll(); }
      else showToast("error", res.message);
    } });
  }

  // ── Photo picker helpers ───────────────────────────────────
  function handleNewPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPetugasPhoto(file);
    setNewPetugasPhotoPreview(URL.createObjectURL(file));
  }

  function handleEditPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPetugasPhoto(file);
    setEditPetugasPhotoPreview(URL.createObjectURL(file));
  }

  const tabCls = (t: string) => `px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
    tab === t
      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
  }`;

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* ── CONFIRM DIALOG ─────────────────────────────────── */}
      <ConfirmDialog
        open={confirm.open}
        title={"Konfirmasi"}
        message={confirm.message}
        confirmLabel={"Ya, Hapus"}
        cancelLabel={"Batal"}
        onConfirm={() => {
          confirm.onConfirm();
          setConfirm({ ...confirm, open: false });
        }}
        onCancel={() => setConfirm({ ...confirm, open: false })}
      />

      {/* ── VIEW USER PHOTO MODAL ─────────────────────────── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewUser(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-lg">👤 Profil Pengguna</h3>
              <button onClick={() => setViewUser(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "4px solid #e2e8f0", flexShrink: 0 }}>
                {viewUser.fotoProfil ? (
                  <Image src={viewUser.fotoProfil} alt={viewUser.nama} width={120} height={120} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 42 }}>
                    {viewUser.nama?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xl">{viewUser.nama}</p>
                <p className="text-sm text-slate-500">{viewUser.email}</p>
                <p className="text-xs text-slate-400 mt-1">📱 {viewUser.noHp || "-"}</p>
                <p className="text-xs text-slate-400">🪪 NIK: {viewUser.nik || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Jenis Bangunan</p>
                  <p className="font-semibold text-slate-700">{viewUser.jenisBangunan?.namaJenisBangunan ?? "-"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">Wilayah</p>
                  <p className="font-semibold text-slate-700">{viewUser.wilayah?.namaWilayah ?? "-"}</p>
                </div>
              </div>
              <span className={`badge ${viewUser.role === "Admin" ? "badge-dijadwalkan" : "badge-aktif"}`}>{viewUser.role}</span>
              <p className="text-xs text-slate-400 italic">⚠️ Profil user hanya dapat dilihat, tidak dapat diedit atau dihapus melalui panel ini.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ──────────────────────────────────────── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => { setEditItem(null); setEditPetugasPhoto(null); setEditPetugasPhotoPreview(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">✏️ Edit {editItem.type.toUpperCase()}</h3>
              <button onClick={() => { setEditItem(null); setEditPetugasPhoto(null); setEditPetugasPhotoPreview(null); }} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">

              {editItem.type === "bangunan" && (
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Jenis Bangunan</label>
                  <input value={editItem.data.namaJenisBangunan}
                    onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, namaJenisBangunan: e.target.value } })}
                    required className="input-light" />
                </div>
              )}

              {editItem.type === "wilayah" && (
                <>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Wilayah</label>
                    <input value={editItem.data.namaWilayah}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, namaWilayah: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Kelurahan</label>
                    <input value={editItem.data.kelurahan}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, kelurahan: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Kecamatan</label>
                    <input value={editItem.data.kecamatan}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, kecamatan: e.target.value } })}
                      required className="input-light" />
                  </div>
                </>
              )}

              {editItem.type === "sampah" && (
                <>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Jenis Sampah</label>
                    <input value={editItem.data.namaJenis}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, namaJenis: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Deskripsi</label>
                    <input value={editItem.data.deskripsi || ""}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, deskripsi: e.target.value } })}
                      className="input-light" />
                  </div>
                </>
              )}

              {editItem.type === "petugas" && (
                <>
                  {/* Foto Preview + Upload */}
                  <div className="flex flex-col items-center gap-3 pb-2">
                    <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid #e2e8f0" }}>
                      {editPetugasPhotoPreview ? (
                        <Image src={editPetugasPhotoPreview} alt="preview" width={90} height={90} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      ) : editItem.data.fotoProfil ? (
                        <Image src={editItem.data.fotoProfil} alt={editItem.data.namaPetugas} width={90} height={90} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 30 }}>
                          {editItem.data.namaPetugas?.charAt(0) || "P"}
                        </div>
                      )}
                    </div>
                    <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditPhotoChange} />
                    <button type="button" onClick={() => editFileRef.current?.click()}
                      className="text-xs px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all border border-slate-200">
                      📸 Ganti Foto Profil
                    </button>
                    {editPetugasPhoto && <p className="text-xs text-emerald-600">✓ {editPetugasPhoto.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Petugas</label>
                    <input value={editItem.data.namaPetugas}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, namaPetugas: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Email</label>
                    <input type="email" value={editItem.data.email}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, email: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nomor HP</label>
                    <input value={editItem.data.noHp}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, noHp: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Jabatan</label>
                    <select value={editItem.data.jabatan}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, jabatan: e.target.value } })}
                      required className="input-light">
                      <option value="Koordinator">Koordinator</option>
                      <option value="Petugas Lapangan">Petugas Lapangan</option>
                      <option value="Pengemudi">Pengemudi</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Status</label>
                    <select value={editItem.data.status || "Aktif"}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, status: e.target.value } })}
                      className="input-light">
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  </div>
                </>
              )}

              {editItem.type === "user" && (
                <>
                  {/* Foto Profil User (Read-Only) */}
                  <div className="flex flex-col items-center gap-2 pb-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <Avatar src={editItem.data.fotoProfil} alt={editItem.data.nama} size={70} />
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      🔒 Foto Profil (Read-Only)
                    </span>
                    <p className="text-[10px] text-slate-400 text-center">Foto profil pengguna tidak dapat diubah atau dihapus oleh Admin.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Pengelola / User</label>
                    <input value={editItem.data.nama}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, nama: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Email</label>
                    <input type="email" value={editItem.data.email}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, email: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nomor HP</label>
                    <input value={editItem.data.noHp}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, noHp: e.target.value } })}
                      required className="input-light" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-custom font-bold uppercase mb-1">NIK</label>
                    <input value={editItem.data.nik}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, nik: e.target.value } })}
                      required className="input-light" />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => { setEditItem(null); setEditPetugasPhoto(null); setEditPetugasPhotoPreview(null); }} className="btn-secondary flex-1">Batal</button>
                <button type="submit" className="btn-eco flex-1">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setTab("bangunan")} className={tabCls("bangunan")}>
          <span className="inline-flex items-center gap-2"><Icon name="building" size={16} /> Jenis Bangunan ({bangunanList.length})</span>
        </button>
        <button onClick={() => setTab("wilayah")} className={tabCls("wilayah")}>
          <span className="inline-flex items-center gap-2"><Icon name="location" size={16} /> Wilayah ({wilayahList.length})</span>
        </button>
        <button onClick={() => setTab("sampah")} className={tabCls("sampah")}>
          <span className="inline-flex items-center gap-2"><Icon name="trash-type" size={16} /> Jenis Sampah ({sampahList.length})</span>
        </button>
        <button onClick={() => setTab("petugas")} className={tabCls("petugas")}>
          <span className="inline-flex items-center gap-2"><Icon name="officers" size={16} /> Petugas ({petugasList.length})</span>
        </button>
        <button onClick={() => setTab("users")} className={tabCls("users")}>
          <span className="inline-flex items-center gap-2"><Icon name="users" size={16} /> Pengguna ({usersList.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div>
          {/* TAB 1: JENIS BANGUNAN */}
          {tab === "bangunan" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddBangunan} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 mb-4">+ Tambah Jenis Bangunan</h3>
                <div className="mb-4">
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Nama Jenis Bangunan</label>
                  <input value={newBangunan} onChange={(e) => setNewBangunan(e.target.value)} placeholder="Contoh: Rumah Sakit" required className="input-light" />
                </div>
                <button type="submit" className="btn-eco w-full">Simpan</button>
              </form>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>No</th><th>Nama Jenis Bangunan</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {bangunanList.map((b, i) => (
                      <tr key={b.id}>
                        <td className="text-slate-400 font-medium">{i + 1}</td>
                        <td className="font-semibold text-slate-800">{b.namaJenisBangunan}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setEditItem({ type: "bangunan", data: { ...b } })} className="text-xs text-blue-600 font-mono-custom font-bold hover:underline">✏️ Edit</button>
                            <button onClick={() => handleDeleteBangunan(b.id)} className="text-xs text-red-500 font-mono-custom font-bold hover:underline">🗑️ Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: WILAYAH */}
          {tab === "wilayah" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddWilayah} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-4">
                <h3 className="font-bold text-slate-800 mb-2">+ Tambah Wilayah</h3>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Nama Wilayah</label>
                  <input value={newWilayah.namaWilayah} onChange={(e) => setNewWilayah({ ...newWilayah, namaWilayah: e.target.value })} placeholder="RW 05 / Area X" required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Kelurahan</label>
                  <input value={newWilayah.kelurahan} onChange={(e) => setNewWilayah({ ...newWilayah, kelurahan: e.target.value })} required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Kecamatan</label>
                  <input value={newWilayah.kecamatan} onChange={(e) => setNewWilayah({ ...newWilayah, kecamatan: e.target.value })} required className="input-light" />
                </div>
                <button type="submit" className="btn-eco w-full">Simpan</button>
              </form>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>No</th><th>Nama Wilayah</th><th>Kelurahan</th><th>Kecamatan</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {wilayahList.map((w, i) => (
                      <tr key={w.id}>
                        <td className="text-slate-400 font-medium">{i + 1}</td>
                        <td className="font-semibold text-slate-800">{w.namaWilayah}</td>
                        <td className="text-slate-500 text-sm">{w.kelurahan}</td>
                        <td className="text-slate-500 text-sm">{w.kecamatan}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setEditItem({ type: "wilayah", data: { ...w } })} className="text-xs text-blue-600 font-mono-custom font-bold hover:underline">✏️ Edit</button>
                            <button onClick={() => handleDeleteWilayah(w.id)} className="text-xs text-red-500 font-mono-custom font-bold hover:underline">🗑️ Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: JENIS SAMPAH */}
          {tab === "sampah" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddSampah} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-4">
                <h3 className="font-bold text-slate-800 mb-2">+ Tambah Jenis Sampah</h3>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Nama Jenis Sampah</label>
                  <input value={newSampah.namaJenis} onChange={(e) => setNewSampah({ ...newSampah, namaJenis: e.target.value })} placeholder="Organik / B3 / Medis" required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Deskripsi</label>
                  <input value={newSampah.deskripsi} onChange={(e) => setNewSampah({ ...newSampah, deskripsi: e.target.value })} placeholder="Keterangan singkat" className="input-light" />
                </div>
                <button type="submit" className="btn-eco w-full">Simpan</button>
              </form>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>No</th><th>Jenis Sampah</th><th>Deskripsi</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {sampahList.map((s, i) => (
                      <tr key={s.id}>
                        <td className="text-slate-400 font-medium">{i + 1}</td>
                        <td className="font-semibold text-slate-800">{s.namaJenis}</td>
                        <td className="text-slate-500 text-sm">{s.deskripsi || "-"}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setEditItem({ type: "sampah", data: { ...s } })} className="text-xs text-blue-600 font-mono-custom font-bold hover:underline">✏️ Edit</button>
                            <button onClick={() => handleDeleteSampah(s.id)} className="text-xs text-red-500 font-mono-custom font-bold hover:underline">🗑️ Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PETUGAS — dengan upload foto */}
          {tab === "petugas" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddPetugas} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-4">
                <h3 className="font-bold text-slate-800 mb-2">+ Tambah Petugas</h3>

                {/* Foto Profil Upload */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "3px dashed #d1d5db", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {newPetugasPhotoPreview ? (
                      <Image src={newPetugasPhotoPreview} alt="preview" width={80} height={80} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    ) : (
                      <span style={{ fontSize: 28 }}>📷</span>
                    )}
                  </div>
                  <input ref={addFileRef} type="file" accept="image/*" className="hidden" onChange={handleNewPhotoChange} />
                  <button type="button" onClick={() => addFileRef.current?.click()}
                    className="text-xs px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all border border-slate-200">
                    📸 Pilih Foto Profil
                  </button>
                  {newPetugasPhoto && <p className="text-xs text-emerald-600 text-center">✓ {newPetugasPhoto.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Nama Petugas</label>
                  <input value={newPetugas.namaPetugas} onChange={(e) => setNewPetugas({ ...newPetugas, namaPetugas: e.target.value })} placeholder="Nama Lengkap" required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Email</label>
                  <input type="email" value={newPetugas.email} onChange={(e) => setNewPetugas({ ...newPetugas, email: e.target.value })} placeholder="petugas@senayan.go.id" required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Nomor HP</label>
                  <input value={newPetugas.noHp} onChange={(e) => setNewPetugas({ ...newPetugas, noHp: e.target.value })} placeholder="08xxxxxxxxxx" required className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-mono-custom font-bold uppercase mb-1 text-slate-700">Jabatan</label>
                  <select value={newPetugas.jabatan} onChange={(e) => setNewPetugas({ ...newPetugas, jabatan: e.target.value })} required className="input-light">
                    <option value="Koordinator">Koordinator</option>
                    <option value="Petugas Lapangan">Petugas Lapangan</option>
                    <option value="Pengemudi">Pengemudi</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn-eco w-full" disabled={addPhotoLoading}>
                  {addPhotoLoading ? "⏳ Menyimpan..." : "Simpan"}
                </button>
              </form>

              {/* Tabel Petugas dengan foto */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto</th>
                      <th>Nama Petugas</th>
                      <th>Email</th>
                      <th>Jabatan</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petugasList.map((p, i) => (
                      <tr key={p.id}>
                        <td className="text-slate-400 font-medium">{i + 1}</td>
                        <td>
                          <Avatar src={p.fotoProfil} alt={p.namaPetugas} size={40} />
                        </td>
                        <td className="font-semibold text-slate-800">{p.namaPetugas}</td>
                        <td className="text-slate-500 text-sm">{p.email}</td>
                        <td className="text-slate-500 text-sm">{p.jabatan}</td>
                        <td>
                          <span className={`badge ${p.status === "Aktif" ? "badge-aktif" : p.status === "Cuti" ? "badge-dijadwalkan" : "badge-nonaktif"}`}>
                            {p.status || "Aktif"}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button onClick={() => { setEditItem({ type: "petugas", data: { ...p } }); setEditPetugasPhoto(null); setEditPetugasPhotoPreview(null); }}
                              className="text-xs text-blue-600 font-mono-custom font-bold hover:underline">✏️ Edit</button>
                            <button onClick={() => handleDeletePetugas(p.id)} className="text-xs text-red-500 font-mono-custom font-bold hover:underline">🗑️ Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PENGGUNA — Admin bisa edit data & hapus user, FOTO PROFIL bersifat Read-Only */}
          {tab === "users" && (
            <div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto Profil</th>
                      <th>Nama User</th>
                      <th>Email / HP</th>
                      <th>NIK</th>
                      <th>Jenis Bangunan</th>
                      <th>Wilayah</th>
                      <th>Role</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u, i) => (
                      <tr key={u.id}>
                        <td className="text-slate-400 font-medium">{i + 1}</td>
                        <td>
                          <Avatar src={u.fotoProfil} alt={u.nama} size={40} />
                        </td>
                        <td className="font-semibold text-slate-800">{u.nama}</td>
                        <td>
                          <div className="text-sm">{u.email}</div>
                          <div className="text-xs text-slate-400">{u.noHp}</div>
                        </td>
                        <td className="text-sm text-slate-500">{u.nik}</td>
                        <td className="text-sm">{u.jenisBangunan?.namaJenisBangunan ?? "-"}</td>
                        <td className="text-sm">{u.wilayah?.namaWilayah ?? "-"}</td>
                        <td><span className={`badge ${u.role === "Admin" ? "badge-dijadwalkan" : "badge-aktif"}`}>{u.role}</span></td>
                        <td>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setEditItem({ type: "user", data: { ...u } })}
                              className="text-xs text-blue-600 font-mono-custom font-bold hover:underline">
                              ✏️ Edit
                            </button>
                            {u.role !== "Admin" && (
                              <button onClick={() => handleDeleteUser(u.id)}
                                className="text-xs text-red-500 font-mono-custom font-bold hover:underline">
                                🗑️ Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
