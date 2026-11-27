export const KRITERIA = [
  "harga",
  "ram",
  "penyimpanan",
  "prosesor",
  "gpu",
  "resolusi",
] as const;
export type Kriteria = (typeof KRITERIA)[number];
export type Bobot = Record<Kriteria, number>;
export type Profil = "umum" | "desain" | "gaming";

// BOBOT SEMENTARA, hanya untuk menguji aplikasi.
// Bukan hasil penelitian. Ganti dengan bobot dari penilaian pakar.
const SAMA_RATA: Bobot = {
  harga: 1 / 6,
  ram: 1 / 6,
  penyimpanan: 1 / 6,
  prosesor: 1 / 6,
  gpu: 1 / 6,
  resolusi: 1 / 6,
};

export const BOBOT: Record<Profil, Bobot> = {
  umum: SAMA_RATA,
  desain: SAMA_RATA,
  gaming: SAMA_RATA,
};
