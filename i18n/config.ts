export const locales = ['esp', 'eng'] as const;
export const defaultLocale = 'esp' as const;

export type Locale = (typeof locales)[number];

// Etiquetas de idioma centralizadas para evitar duplicación
export const languageLabels: Record<Locale, string> = {
  esp: 'Español',
  eng: 'English',
};

// Mapeo de locale a configuración regional de Intl
export const localeToIntl: Record<Locale, string> = {
  esp: 'es-MX',
  eng: 'en-US',
};

// Mapeo de locale a moneda por defecto
export const localeToCurrency: Record<Locale, string> = {
  esp: 'MXN',
  eng: 'USD',
};

// Monedas disponibles con sus etiquetas
export const availableCurrencies = [
  { value: 'MXN', label: 'MXN - Peso Mexicano', symbol: '$' },
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: '$' },
  { value: 'ARS', label: 'ARS - Peso Argentino', symbol: '$' },
  { value: 'COP', label: 'COP - Peso Colombiano', symbol: '$' },
  { value: 'CLP', label: 'CLP - Peso Chileno', symbol: '$' },
  { value: 'PEN', label: 'PEN - Sol Peruano', symbol: 'S/' },
  { value: 'BRL', label: 'BRL - Real Brasileño', symbol: 'R$' },
] as const;

export type Currency = typeof availableCurrencies[number]['value'];

// Mapeo de moneda a locale de Intl para formateo correcto
export const currencyToIntlLocale: Record<string, string> = {
  MXN: 'es-MX',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  CAD: 'en-CA',
  ARS: 'es-AR',
  COP: 'es-CO',
  CLP: 'es-CL',
  PEN: 'es-PE',
  BRL: 'pt-BR',
};
