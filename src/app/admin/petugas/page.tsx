"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAllPetugas } from "@/actions/laporan.action";
import { updatePetugasAction, deletePetugasAction } from "@/actions/master.action";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Icon from "@/components/ui/Icon";

async function uploadFotoPetugas(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload/petugas", { method: "POST", body: fd });
  if (!res.ok) return null;
  const data = await res.json();
  return data.pathFile ?? null;
}

export default function AdminPetugasPage() {
  const [petugas, setPetugas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Confirm dialog state
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm: () => void }>({
    open: false,
    message: "",
    onConfirm: () => {},
  });

  // Edit modal state
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function reloadData() {
    setLoading(true);
    getAllPetugas().then((data) => { setPetugas(data); setLoading(false); });
  }

  useEffect(() => {
    reloadData();
  }, []);

  const [submitting, setSubmitting] = useState(false);

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editItem) return;

    setSubmitting(true);
    let fotoPath: string | undefined;
    if (editPhoto) {
      const uploaded = await uploadFotoPetugas(editPhoto);
      if (!uploaded) {
        showToast("error", "Gagal upload foto. Coba lagi.");
        setSubmitting(false);
        return;
      }
      fotoPath = uploaded;
    }

    const res = await updatePetugasAction(
      editItem.id,
      editItem.namaPetugas,
      editItem.email,
      editItem.noHp,
      editItem.jabatan,
      editItem.status || "Aktif",
      fotoPath
    );

    setSubmitting(false);

    if (res.success) {
      showToast("success", res.message);
      setEditItem(null);
      setEditPhoto(null);
      setEditPhotoPreview(null);
      reloadData();
    } else {
      showToast("error", res.message);
    }
  }

  function handleDelete(id: string) {
    setConfirm({
      open: true,
      message: "Hapus petugas ini secara permanen?",
      onConfirm: async () => {
        const res = await deletePetugasAction(id);
        if (res.success) {
          showToast("success", res.message);
          reloadData();
        } else {
          showToast("error", res.message);
        }
      },
    });
  }

  const filtered = petugas.filter((p) => {
    const q = search.toLowerCase();
    return p.namaPetugas?.toLowerCase().includes(q) ||
      p.jabatan?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q);
  });

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.msg}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        title="Konfirmasi Hapus"
        message={confirm.message}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={() => {
          confirm.onConfirm();
          setConfirm({ ...confirm, open: false });
        }}
        onCancel={() => setConfirm({ ...confirm, open: false })}
      />

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => { setEditItem(null); setEditPhoto(null); setEditPhotoPreview(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Edit Petugas</h3>
              <button onClick={() => { setEditItem(null); setEditPhoto(null); setEditPhotoPreview(null); }} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Tutup</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Photo Preview + Upload */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid #e2e8f0" }}>
                  {editPhotoPreview ? (
                    <Image src={editPhotoPreview} alt="preview" width={90} height={90} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  ) : editItem.fotoProfil ? (
                    <Image src={editItem.fotoProfil} alt={editItem.namaPetugas} width={90} height={90} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 30 }}>
                      {editItem.namaPetugas?.charAt(0) || "P"}
                    </div>
                  )}
                </div>
                <input ref={editFileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setEditPhoto(file);
                    setEditPhotoPreview(URL.createObjectURL(file));
                  }} />
                <button type="button" onClick={() => editFileRef.current?.click()}
                  className="text-xs px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all border border-slate-200">
                  Ganti Foto Profil
                </button>
                {editPhoto && <p className="text-xs text-emerald-600">{editPhoto.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nama Petugas</label>
                <input value={editItem.namaPetugas}
                  onChange={(e) => setEditItem({ ...editItem, namaPetugas: e.target.value })}
                  required className="input-light" />
              </div>
              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Email</label>
                <input type="email" value={editItem.email}
                  onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                  required className="input-light" />
              </div>
              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Nomor HP</label>
                <input value={editItem.noHp}
                  onChange={(e) => setEditItem({ ...editItem, noHp: e.target.value })}
                  required className="input-light" />
              </div>
              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Jabatan</label>
                <select value={editItem.jabatan}
                  onChange={(e) => setEditItem({ ...editItem, jabatan: e.target.value })}
                  required className="input-light">
                  <option value="Koordinator">Koordinator</option>
                  <option value="Petugas Lapangan">Petugas Lapangan</option>
                  <option value="Pengemudi">Pengemudi</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-custom font-bold uppercase mb-1">Status</label>
                <select value={editItem.status || "Aktif"}
                  onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                  className="input-light">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Cuti">Cuti</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => { setEditItem(null); setEditPhoto(null); setEditPhotoPreview(null); }} className="btn-secondary flex-1">Batal</button>
                <button type="submit" disabled={submitting} className="btn-eco flex-1 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, jabatan, atau email petugas..."
          className="input-base max-w-md" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Petugas", value: petugas.length, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Aktif", value: petugas.filter((p) => p.status === "Aktif").length, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Nonaktif", value: petugas.filter((p) => p.status !== "Aktif").length, color: "#dc2626", bg: "#fef2f2" },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.label}</div>
            </div>
            <div className="text-3xl font-black" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Petugas</th>
                <th>Email</th>
                <th>Nomor HP</th>
                <th>Jabatan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-slate-400 font-medium">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm text-white flex-shrink-0 border border-slate-200"
                        style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                        {p.fotoProfil ? (
                          <img src={p.fotoProfil} alt={p.namaPetugas} className="w-full h-full object-cover object-top" />
                        ) : (
                          p.namaPetugas?.charAt(0)
                        )}
                      </div>
                      <span className="font-semibold text-sm">{p.namaPetugas}</span>
                    </div>
                  </td>
                  <td className="text-sm text-slate-500">{p.email}</td>
                  <td className="text-sm text-slate-500">{p.noHp}</td>
                  <td>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{ background: "#f1f5f9", color: "#475569" }}>
                      {p.jabatan}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.status === "Aktif" ? "badge-aktif" : "badge-nonaktif"}`}>
                      {p.status || "Aktif"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setEditItem({ ...p }); setEditPhoto(null); setEditPhotoPreview(null); }}
                        className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                        <Icon name="pencil" size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs text-red-500 font-semibold hover:underline inline-flex items-center gap-1">
                        <Icon name="trash" size={13} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 text-sm text-slate-400 text-right">{filtered.length} petugas</div>
    </div>
  );
}
