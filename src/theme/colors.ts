// Previa Color Palette
// Design philosophy: Warm, earthy tones that evoke trust and stability

export const previaColors = {
  cream: '#F2E9D8',      // Primary background, light surfaces
  stone: '#8C877D',      // Secondary text, borders
  sand: '#D9C8B4',       // Accent elements, hover states
  charcoal: '#403B31',   // Primary text, headings
  darkStone: '#595347',  // Secondary headings, icons
  paperWhite: '#FFFFFF', // Data surfaces, tables, transaction cards
}

// Semantic color mappings for context-aware theming
export const semanticColors = {
  'bg-surface': 'previa.cream',
  'bg-card': 'previa.paperWhite',
  'text-primary': 'previa.charcoal',
  'text-secondary': 'previa.stone',
  'text-muted': 'previa.stone',
  'border-default': 'previa.stone',
  'accent-default': 'previa.sand',
  'accent-hover': 'previa.darkStone',
}
