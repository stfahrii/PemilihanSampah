import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Hanya file gambar yang diizinkan." }, { status: 400 });
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 3MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const uniqueName = `petugas-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let pathFile = `/images/petugas/${uniqueName}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "images", "petugas");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, uniqueName), buffer);
    } catch {
      // Fallback to Data URL for serverless environment (Vercel)
      const mimeType = file.type || "image/jpeg";
      pathFile = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      namaFile: uniqueName,
      pathFile,
    });
  } catch {
    return NextResponse.json({ error: "Upload gagal." }, { status: 500 });
  }
}
