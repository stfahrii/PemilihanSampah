"use server";

import { registerUser, getJenisBangunan, getWilayah } from "@/services/user.service";
import { loginUser } from "@/services/user.service";

export async function getDropdownData() {
  const [jenisBangunan, wilayah] = await Promise.all([
    getJenisBangunan(),
    getWilayah(),
  ]);
  return { jenisBangunan, wilayah };
}

export async function registerAction(formData: FormData) {
  try {
    await registerUser({
      nama: formData.get("nama") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      noHp: formData.get("noHp") as string,
      nik: formData.get("nik") as string,
      alamat: formData.get("alamat") as string,
      rt: formData.get("rt") as string,
      rw: formData.get("rw") as string,
      jenisBangunanId: formData.get("jenisBangunanId") as string,
      wilayahId: formData.get("wilayahId") as string,
    });
    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Terjadi kesalahan." };
  }
}

export async function loginAction(formData: FormData) {
  try {
    const user = await loginUser(
      formData.get("email") as string,
      formData.get("password") as string
    );
    return {
      success: true,
      message: "Login berhasil!",
      role: user.role,
      userId: user.id,
      nama: user.nama,
    };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Terjadi kesalahan." };
  }
}
