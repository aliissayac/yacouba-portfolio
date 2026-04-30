const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const cache = new Map<string, Record<string, string>>();

const langMap: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
  de: 'DE',
  it: 'IT',
  pt: 'PT',
  nl: 'NL',
  pl: 'PL',
  ru: 'RU',
  ja: 'JA',
  zh: 'ZH',
  ko: 'KO',
};

export async function translateWithDeepL(
  text: string | string[],
  targetLang: string,
  sourceLang: string = 'FR'
): Promise<Record<string, string>> {
  const texts = Array.isArray(text) ? text : [text];
  
  // Filter out empty strings to avoid DeepL 400 Bad Request errors
  const nonEmptyTexts: { index: number; text: string }[] = [];
  const result: Record<string, string> = {};
  
  texts.forEach((t, i) => {
    if (!t || t.trim() === '') {
      result[i] = t; // Keep empty string as is
    } else {
      nonEmptyTexts.push({ index: i, text: t });
    }
  });

  // If there's nothing to translate, return early
  if (nonEmptyTexts.length === 0) {
    return result;
  }

  const textsToTranslate = nonEmptyTexts.map(item => item.text);
  const cacheKey = textsToTranslate.join('|||') + targetLang + sourceLang;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    nonEmptyTexts.forEach((item, i) => {
      result[item.index] = cached[i];
    });
    return result;
  }

  const apiKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY;

  if (!apiKey) {
    console.warn('DeepL API key not configured. Add NEXT_PUBLIC_DEEPL_API_KEY to .env');
    return texts.reduce((acc, t, i) => ({ ...acc, [i === 0 ? '0' : i]: t }), {});
  }

  try {
    const target = langMap[targetLang] || targetLang.toUpperCase();
    const source = langMap[sourceLang] || sourceLang.toUpperCase();

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: textsToTranslate, targetLang: target, sourceLang: source }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Translation API returned an error:', errorBody);
      throw new Error(`Translation API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const translations = data.translations as Array<{ text: string }>;

    const cachedResult: Record<string, string> = {};
    translations.forEach((t, i) => {
      cachedResult[i] = t.text;
      result[nonEmptyTexts[i].index] = t.text;
    });

    cache.set(cacheKey, cachedResult);
    return result;
  } catch (error) {
    console.error('Translation failed:', error);
    // On error, return original text
    return texts.reduce((acc, t, i) => ({ ...acc, [i === 0 ? '0' : i]: t }), {});
  }
}

export async function detectLanguage(text: string): Promise<string> {
  // Not proxying detectLanguage yet, returning FR by default
  // Can be extended via API route later if needed
  return 'FR';
}

export function clearTranslationCache() {
  cache.clear();
}