'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from '@/locales/translations';
import { translateWithDeepL } from '@/utils/translation';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  isLoading: boolean;
  useDeepLTranslate: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DEFAULT_LANGUAGE: Language = 'fr';

function flattenObject(obj: any, prefix = ''): string[] {
  const result: string[] = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      result.push(...flattenObject(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      result.push(obj[key]);
    }
  }
  return result;
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);
  const [translatedStrings, setTranslatedStrings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [useDeepLTranslate, setUseDeepLTranslate] = useState(false);
  const [baseStrings, setBaseStrings] = useState(translations.fr);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang === 'en' || storedLang === 'fr') {
      setLanguageState(storedLang);
    } else {
      localStorage.setItem('language', DEFAULT_LANGUAGE);
    }

    const hasApiKey = !!process.env.NEXT_PUBLIC_DEEPL_API_KEY;
    setUseDeepLTranslate(hasApiKey);
  }, []);

  useEffect(() => {
    if (!mounted || !useDeepLTranslate) return;

    const translateContent = async () => {
      if (language === 'fr') {
        setTranslatedStrings({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const targetLang = language;
      
      const allStrings = flattenObject(baseStrings);
      
      const translated = await translateWithDeepL(allStrings, targetLang, 'fr');
      
      const newStrings: Record<string, string> = {};
      let index = 0;
      
      for (const key in baseStrings) {
        for (const subKey in baseStrings[key]) {
          const fullKey = `${key}.${subKey}`;
          if (typeof baseStrings[key][subKey] === 'string') {
            newStrings[fullKey] = translated[index.toString()] || baseStrings[key][subKey];
            index++;
          } else if (typeof baseStrings[key][subKey] === 'object') {
            const nestedObj = baseStrings[key][subKey];
            for (const nestedSubKey in nestedObj) {
              if (typeof nestedObj[nestedSubKey] === 'string') {
                newStrings[`${fullKey}.${nestedSubKey}`] = translated[index.toString()] || nestedObj[nestedSubKey];
                index++;
              }
            }
          }
        }
      }
      
      setTranslatedStrings(newStrings);
      setIsLoading(false);
    };

    translateContent();
  }, [language, mounted, useDeepLTranslate, baseStrings]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'fr' : 'en';
      localStorage.setItem('language', next);
      return next;
    });
  }, []);

  const t = useCallback((key: string): any => {
    if (useDeepLTranslate && translatedStrings[key]) {
      return translatedStrings[key];
    }
    return getNestedValue(language === 'fr' ? translations.fr : translations.en, key);
  }, [language, useDeepLTranslate, translatedStrings]);

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    setLanguage,
    t,
    isLoading,
    useDeepLTranslate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}