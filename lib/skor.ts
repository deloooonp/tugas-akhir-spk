// Aturan skor 1-5 untuk prosesor dan GPU.
// Aturan diperiksa berurutan, aturan pertama yang cocok dipakai.
// null = model tidak bisa dikenali, laptop tidak ikut dihitung.
// Keterbatasan: generasi prosesor tidak diperhitungkan.

type Aturan = [pola: RegExp, skor: number];

const ATURAN_PROSESOR: Aturan[] = [
  [/celeron|pentium|atom|athlon|mediatek|\bn4500\b/, 1],
  [/apple m[12] max|apple m2 pro/, 5],
  [/apple m1 pro|apple m2/, 4],
  [/apple m1/, 3],
  [/\bi9\b|ryzen 9\b/, 5],
  [/\bi7\b|ryzen 7\b|intel 7 13700hx/, 4],
  [/\bi5\b|ryzen 5\b/, 3],
  [/\bi3\b|ryzen 3\b/, 2],
];

const ATURAN_GPU: Aturan[] = [
  // GPU dedicated kelas atas
  [/rtx ?(3070|3080|4060|4070|4080|4090|3000 ada)|\b(30|32)-core/, 5],
  // GPU dedicated kelas menengah ("GTX 3050" dianggap salah tulis RTX 3050)
  [/rtx ?(rtx )?(3050|3060|4050|a2000)|gtx 3050|rx ?(5600|6650)m/, 4],
  // GPU dedicated kelas bawah
  [
    /(rtx|gtx) ?(1050|1650|2050)|rtx a(500|1000)|t600|a350m|(rx|pro) ?(5500|6500|6550)m|\b(14|16|19)-core/,
    3,
  ],
  // GPU terintegrasi kelas atas dan dedicated paling dasar
  [/iris|\b(680|780)m\b|apple m1|\b(8|10)-core|mx ?\d{3}/, 2],
  // GPU terintegrasi dasar
  [
    /\buhd\b|intel hd|intel graphics|intel integrated|radeon|amd (integrated|graphics)|mali/,
    1,
  ],
];

export function rapikan(teks: string): string {
  return teks.replace(/‎/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function cocokkan(teks: string | null, aturan: Aturan[]): number | null {
  if (!teks) return null;
  const bersih = rapikan(teks);
  return aturan.find(([pola]) => pola.test(bersih))?.[1] ?? null;
}

export const skorProsesor = (teks: string | null) =>
  cocokkan(teks, ATURAN_PROSESOR);
export const skorGpu = (teks: string | null) => cocokkan(teks, ATURAN_GPU);
