'use client';

import { ConfigProvider } from 'antd';
import { useLocale } from 'next-intl';
import esES from 'antd/locale/es_ES';
import enUS from 'antd/locale/en_US';
import type { Locale } from '@/i18n/config';

// Mapeo de locales de la app a locales de Ant Design
const antdLocales: Record<Locale, typeof esES> = {
  esp: esES,
  eng: enUS,
};

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

export const AntdConfigProvider = ({ children }: AntdConfigProviderProps) => {
  const locale = useLocale() as Locale;
  const antdLocale = antdLocales[locale] || esES;

  return (
    <ConfigProvider locale={antdLocale}>
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
