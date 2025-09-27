export const UNITS = [
    "tsk", "msk", "krm", "dl", "cl", "ml", "l", "g", "kg", "st", "nypa",
    "klyfta", "skiva", "paket", "burk", "flaska", "påse",
] as const;

export type Unit = (typeof UNITS)[number];