import { config } from "dotenv";
import fs from "node:fs";
import { parse } from "csv-parse/sync";

config({ path: ".env.local" });

async function main() {
  const { db } = await import("@/db");
  const { laptop } = await import("@/db/schema");

  const rows = parse(fs.readFileSync("data/laptop_bersih.csv"), {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];

  const data = rows.map((r) => ({
    id: Number(r.id),
    nama: r.nama,
    merek: r.merek,
    hargaInr: Number(r.harga_inr),
    ramGb: Number(r.ram_gb),
    penyimpananGb: Number(r.penyimpanan_gb),
    resolusiPiksel: Number(r.resolusi_piksel),
    prosesor: r.prosesor,
    gpu: r.gpu,
    ukuranLayar: Number(r.ukuran_layar),
    os: r.os,
  }));

  for (let i = 0; i < data.length; i += 200) {
    await db.insert(laptop).values(data.slice(i, i + 200));
  }
  console.log("Selesai:", data.length, "baris");
}

main();
