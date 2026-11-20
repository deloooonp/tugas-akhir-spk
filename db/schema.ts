import { integer, pgTable, real, text } from "drizzle-orm/pg-core";

export const laptop = pgTable("laptop", {
  id: integer().primaryKey(),
  nama: text().notNull(),
  merek: text(),
  hargaInr: integer("harga_inr").notNull(),
  ramGb: integer("ram_gb").notNull(),
  penyimpananGb: integer("penyimpanan_gb").notNull(),
  resolusiPiksel: integer("resolusi_piksel").notNull(),
  prosesor: text(),
  gpu: text(),
  ukuranLayar: real("ukuran_layar"),
  os: text(),
});
