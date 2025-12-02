export const locales = ['esp', 'eng'] as const;
export const defaultLocale = 'esp' as const;

export type Locale = (typeof locales)[number];
