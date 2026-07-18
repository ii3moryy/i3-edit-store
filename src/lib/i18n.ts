import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Lang = 'en' | 'ar';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'welcome': 'Welcome',
    'choose_language': 'Choose your language',
    'home': 'Home',
    'plans': 'Plans',
    'order': 'Order',
    'logout': 'Logout',
  },
  ar: {
    'welcome': 'مرحباً',
    'choose_language': 'اختر لغتك',
    'home': 'الرئيسية',
    'plans': 'الخطط',
    'order': 'طلب',
    'logout': 'تسجيل الخروج',
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Lang) || 'en';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}