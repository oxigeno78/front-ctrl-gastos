export const locales = ['esp', 'eng'] as const;
export const defaultLocale = 'esp' as const;

export type Locale = (typeof locales)[number];

// Etiquetas de idioma centralizadas para evitar duplicación
export const languageLabels: Record<Locale, string> = {
  esp: 'Español',
  eng: 'English',
};
