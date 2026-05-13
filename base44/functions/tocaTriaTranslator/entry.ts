import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Cache em memória para traduções (máx 500 entradas)
const translationCache = new Map();

async function getTranslation(text, sourceLanguage, targetLanguage) {
  // Se idioma de origem e destino são iguais, retornar texto original
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // Verificar cache
  const cacheKey = `${text}|${sourceLanguage}|${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    console.log(`[TRANSLATE CACHE HIT] ${sourceLanguage}→${targetLanguage}`);
    return translationCache.get(cacheKey);
  }

  try {
    // Chamar Google Translate API
    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        key: Deno.env.get('GOOGLE_TRANSLATE_API_KEY')
      })
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.data.translations[0].translatedText;

    // Armazenar em cache
    if (translationCache.size >= 500) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, translated);

    console.log(`[TRANSLATE] ${sourceLanguage}→${targetLanguage}: "${text.substring(0, 50)}..."`);
    return translated;
  } catch (error) {
    console.error('[TRANSLATE ERROR]', error.message);
    // Retornar texto original como fallback
    return text;
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, sourceLanguage, targetLanguage' }),
        { status: 400 }
      );
    }

    const translated = await getTranslation(text, sourceLanguage, targetLanguage);

    return new Response(
      JSON.stringify({
        success: true,
        original: text,
        translated,
        sourceLanguage,
        targetLanguage,
        cacheSize: translationCache.size
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[TOCA-TRIA-TRANSLATOR] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Translation error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});