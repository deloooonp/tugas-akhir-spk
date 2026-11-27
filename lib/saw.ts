import { KRITERIA, type Bobot, type Kriteria } from "./bobot";
import { skorGpu, skorProsesor } from "./skor";

export type Laptop = {
  id: number;
  nama: string;
  hargaInr: number;
  ramGb: number;
  penyimpananGb: number;
  resolusiPiksel: number;
  prosesor: string | null;
  gpu: string | null;
};

export type Nilai = Record<Kriteria, number>;

export type Hasil<T extends Laptop> = {
  laptop: T;
  nilai: Nilai; // x_ij
  normal: Nilai; // r_ij
  v: number; // V_i
};

const COST: ReadonlySet<Kriteria> = new Set<Kriteria>(["harga"]);

function keNilai(l: Laptop): Nilai | null {
  const prosesor = skorProsesor(l.prosesor);
  const gpu = skorGpu(l.gpu);
  if (prosesor === null || gpu === null) return null;
  return {
    harga: l.hargaInr,
    ram: l.ramGb,
    penyimpanan: l.penyimpananGb,
    prosesor,
    gpu,
    resolusi: l.resolusiPiksel,
  };
}

/** Saring menurut anggaran (dalam INR), lalu rangking dengan SAW. */
export function hitungSaw<T extends Laptop>(
  daftar: T[],
  bobot: Bobot,
  anggaranInr: number,
): Hasil<T>[] {
  const lolos = daftar.flatMap((laptop) => {
    if (laptop.hargaInr > anggaranInr) return [];
    const nilai = keNilai(laptop);
    return nilai ? [{ laptop, nilai }] : [];
  });
  if (lolos.length === 0) return [];

  // Pembagi diambil dari semua laptop yang lolos anggaran
  const acuan = {} as Nilai;
  for (const k of KRITERIA) {
    const kolom = lolos.map((a) => a.nilai[k]);
    acuan[k] = COST.has(k) ? Math.min(...kolom) : Math.max(...kolom);
  }

  return (
    lolos
      .map(({ laptop, nilai }) => {
        const normal = {} as Nilai;
        let v = 0;
        for (const k of KRITERIA) {
          normal[k] = COST.has(k) ? acuan[k] / nilai[k] : nilai[k] / acuan[k];
          v += bobot[k] * normal[k];
        }
        return { laptop, nilai, normal, v };
      })
      // Nilai seri: harga termurah dulu, lalu id terkecil.
      // Pembulatan mencegah selisih floating point dianggap beda nilai.
      .sort(
        (a, b) =>
          Number(b.v.toFixed(10)) - Number(a.v.toFixed(10)) ||
          a.laptop.hargaInr - b.laptop.hargaInr ||
          a.laptop.id - b.laptop.id,
      )
  );
}
