export type BookId = "hela" | "eric" | "luca" | "lena";

export type BookStatus = "featured" | "upcoming" | "undisclosed";

export interface Book {
  id: BookId;
  title: string;
  /** roman numeral */
  volume: "I" | "II" | "III" | "IV";
  status: BookStatus;
  /** One-line statement of the "herejía" this book examines. null = not yet public. */
  heresy: string | null;
  genre?: string;
  pages?: number;
  chapters?: number;
}

/** Source of truth: HELA editorial dossier (as quoted in the brief). */
export const books: Book[] = [
  {
    id: "hela",
    title: "HELA",
    volume: "I",
    status: "featured",
    heresy: "El poder, el mito y el miedo.",
    genre: "Thriller noir",
    pages: 448,
    chapters: 37,
  },
  {
    id: "eric",
    title: "ERIC",
    volume: "II",
    status: "upcoming",
    heresy: "La devoción como instrumento de control.",
  },
  { id: "luca", title: "LUCA", volume: "III", status: "undisclosed", heresy: null },
  { id: "lena", title: "LENA", volume: "IV", status: "undisclosed", heresy: null },
];

export const getBook = (id: BookId) => books.find((b) => b.id === id)!;

export const recognition = {
  rank: "TOP 5",
  event: "Concurso ITA",
  entrants: 2000, // "more than 2,000 participating novels"
};

export const concept = {
  name: "Herejías Cardinales",
};
