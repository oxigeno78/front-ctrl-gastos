'use client';

import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';

const languageLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as Locale });
  };

  return (
    <Select
      value={locale}
      onChange={handleChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
      options={locales.map((loc) => ({
        value: loc,
        label: languageLabels[loc],
      }))}
    />
  );
};

export default LanguageSwitcher;
