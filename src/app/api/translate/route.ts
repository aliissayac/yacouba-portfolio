import { NextResponse } from 'next/server';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

export async function POST(request: Request) {
  try {
    const { texts, targetLang, sourceLang } = await request.json();

    const rawApiKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY || process.env.DEEPL_API_KEY;
    const apiKey = rawApiKey?.trim();

    if (!apiKey) {
      return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
    }

    const formData = new URLSearchParams();
    
    if (Array.isArray(texts)) {
      texts.forEach(t => formData.append('text', t));
    } else {
      formData.append('text', texts);
    }
    
    formData.append('target_lang', targetLang || 'EN');
    if (sourceLang) {
      formData.append('source_lang', sourceLang);
    }

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${apiKey}`
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL Error 403 details:', errorText);
      return NextResponse.json({ error: `DeepL API error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Translation route error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
