import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table');

    if (!tableName) {
      return NextResponse.json(
        { pesan: "Nama tabel harus disediakan", status: "Gagal" },
        { status: 400 }
      );
    }

    // Hapus tabel
    await sql`DROP TABLE IF EXISTS ${tableName};`;

    return NextResponse.json(
      { pesan: `Tabel ${tableName} berhasil dihapus`, status: "Sukses" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus tabel:", error);
    return NextResponse.json(
      { pesan: "Terjadi kesalahan saat menghapus tabel", status: "Gagal" },
      { status: 500 }
    );
  }
}
