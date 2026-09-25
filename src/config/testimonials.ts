export interface Testimonial {
  quote: string;
  author: string;
  /** e.g. "Lector", "Goodreads", outlet name */
  source?: string;
  url?: string;
}

/**
 * REAL reader / press quotes only. While this array is empty, the section renders
 * clearly-labelled placeholder slots (never presented as real). No star ratings.
 */
export const testimonials: Testimonial[] = [];

/** How many placeholder slots to show while `testimonials` is empty. */
export const placeholderSlots = 3;
