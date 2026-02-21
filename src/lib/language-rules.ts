/**
 * Language-specific simplification rules for 15 supported languages.
 * Extracted from docs/rules/LS_ES_*.md (Section 7 – Prompt-Baustein).
 *
 * Each language provides condensed rules for:
 *   - leicht: Leichte Sprache / Easy Read (CEFR A1–A2)
 *   - einfach: Einfache Sprache / Plain Language (CEFR B1–B2)
 */

interface LanguageRules {
  /** Native language name */
  name: string;
  /** What "Leichte Sprache" is called in this language */
  leichtLabel: string;
  /** What "Einfache Sprache" is called in this language */
  einfachLabel: string;
  /** Rules for Easy Read / Leichte Sprache (A1–A2), written in the target language */
  leicht: string;
  /** Rules for Plain Language / Einfache Sprache (B1–B2), written in the target language */
  einfach: string;
}

const RULES: Record<string, LanguageRules> = {
  de: {
    name: 'Deutsch',
    leichtLabel: 'Leichte Sprache',
    einfachLabel: 'Einfache Sprache',
    leicht: `- Sehr einfache, häufige, konkrete Wörter. Keine Fremdwörter ohne Erklärung.
- Begriffskonstanz: für ein Konzept immer dasselbe Wort.
- Komposita aufteilen oder mit Bindestrich trennen.
- Kurze Hauptsätze, eine Information pro Satz (ca. 10–15 Wörter).
- Kaum Nebensätze; wenn nötig, nur einfache.
- Aktiv statt Passiv. Präsens bevorzugen.
- Genitiv vermeiden → «von»-Konstruktionen.
- Keine Metaphern, Redewendungen, Ironie.
- Klare Überschriften, kurze Absätze, Aufzählungen.
- SCHWEIZER RECHTSCHREIBUNG: Immer «ss» statt «ß» (z.B. «Strasse», «Gruss»).`,
    einfach: `- Häufige, alltagsnahe Wörter. Fachbegriffe erklären oder mit Beispielen illustrieren.
- Kurze bis mittellange Sätze ohne Verschachtelung.
- Einfache Nebensätze (weil, wenn, damit) erlaubt, aber keine Untereinbettungen.
- Aktiv bevorzugen; Passiv möglich, wenn Handelnde unwichtig.
- Alle wichtigen Inhalte beibehalten. Logisch strukturieren.
- Verständliche Überschriften, Absätze, Listen.
- SCHWEIZER RECHTSCHREIBUNG: Immer «ss» statt «ß» (z.B. «Strasse», «Gruss»).`,
  },

  fr: {
    name: 'Français',
    leichtLabel: 'FALC (Facile à lire et à comprendre)',
    einfachLabel: 'Langage clair',
    leicht: `- 1 idée par phrase. 1 phrase par ligne.
- Max. 12 mots par phrase (A2) / 7 mots (A1).
- Uniquement des phrases affirmatives, à l'indicatif, à la forme active.
- Vocabulaire simple, concret, courant. Pas de jargon, pas d'abréviations.
- Expliquer les mots difficiles immédiatement après.
- Pas de métaphores, d'ironie ou d'humour implicite.
- Toujours utiliser le même mot pour la même chose.
- S'adresser directement au lecteur (vous).
- Pas de subjonctif. Pas de passif. Pas de double négation.
- Pas de typographie genrée (point médian, etc.).
- Chiffres en chiffres. Dates complètes. Pas de %.`,
    einfach: `- Phrases de 10 à 15 mots max. 1 subordonnée tolérée.
- Vocabulaire courant. Expliquer les termes techniques.
- Forme active. Indicatif. Adresse directe.
- Texte structuré avec titres, sous-titres, listes.
- Verbes plutôt que nominalisations.
- Pas de typographie genrée (point médian, etc.).`,
  },

  it: {
    name: 'Italiano',
    leichtLabel: 'Lingua facile',
    einfachLabel: 'Linguaggio chiaro',
    leicht: `- 1 idea per frase. 1 frase per riga.
- Frasi brevi (max. 12 parole).
- Solo indicativo. Solo forma attiva. Solo frasi affermative.
- Vocabolario semplice, concreto, quotidiano. Niente gergo o abbreviazioni.
- Spiegare subito le parole difficili.
- Niente metafore, eufemismi, ironia.
- Sempre la stessa parola per la stessa cosa.
- Rivolgersi direttamente al lettore (voi).
- Niente congiuntivo. Niente passivo. Niente doppia negazione.
- Niente «d eufonica» (ed, od). Niente participio presente in subordinate.
- Niente forme impersonali. Numeri in cifre. Date complete.`,
    einfach: `- Frasi di 15–20 parole max. 1 subordinata tollerata.
- Vocabolario corrente. Spiegare i termini tecnici.
- Forma attiva. Indicativo. Indirizzo diretto.
- Testo strutturato con titoli, sottotitoli, elenchi.
- Niente «d eufonica». Niente forme impersonali.`,
  },

  rm: {
    name: 'Rumantsch',
    leichtLabel: 'Rumantsch facil',
    einfachLabel: 'Linguatg cler',
    leicht: `- 1 idea per frasa. 1 frasa per lingia.
- Frasas curtas (max. 12 pleds).
- Mo indicativ. Mo furma activa. Mo frasas affirmativas.
- Pleds simpels, concrets, quotidians. Nagin pled exter u tecnic.
- Explicar immediat ils pleds difficils.
- Naginas metafras, ironia u «linguatg tranter las lingias».
- Adina il medem pled per la medema chaussa.
- S'adressar direct al lectur (Vus).
- Nagin conjunctiv. Nagin passiv. Nagina dubla negaziun.
- Cifras en cifras. Datas cumpletas.
- Scriver en Rumantsch Grischun (u l'idiom adequat).`,
    einfach: `- Frasas da max. 20 pleds. 1 subordinada tolerada.
- Pleds corrents. Explicar ils terms tecnics.
- Furma activa. Indicativ.
- Text structurà cun titels e glistas.
- Rumantsch Grischun u l'idiom adequat.`,
  },

  en: {
    name: 'English',
    leichtLabel: 'Easy Read',
    einfachLabel: 'Plain Language',
    leicht: `- Use easy, everyday words. Explain hard words right away.
- Use the same word for the same thing throughout.
- No metaphors, idioms, or figurative language.
- No contractions (write "do not" instead of "don't").
- Short sentences. One idea per sentence. One sentence per line.
- Active voice only. No passive.
- Simple tenses only (Simple Present, Simple Past).
- Positive sentences (avoid negations).
- Clear headings. Bullet points for lists.
- Numbers as digits. Write dates in full (Tuesday 13 October 2026). No percentages.
- Never split a word across two lines.`,
    einfach: `- Short to medium sentences (about 15–25 words). Max. 1 subordinate clause.
- Everyday words. Explain technical terms the first time.
- Active voice preferred. Passive only when agent is unimportant.
- Clear structure with headings, subheadings, and lists.
- Direct address ("you"). Clear pronoun references.
- Numbers in context. Consistent date format.`,
  },

  es: {
    name: 'Español',
    leichtLabel: 'Lectura fácil',
    einfachLabel: 'Lenguaje claro',
    leicht: `- Una idea por frase.
- Frases cortas con estructura simple (sujeto–verbo–complemento).
- Usar solo tiempos verbales frecuentes (presente, pasado simple).
- Evitar la voz pasiva y las construcciones con «se».
- Usar palabras frecuentes y concretas; explicar cualquier palabra difícil.
- No usar metáforas, modismos ni ironía.
- Usar el mismo término para la misma cosa en todo el texto.
- Párrafos breves, con una idea principal.
- Listas con viñetas, no listas con comas.
- Cifras en números. Fechas completas.`,
    einfach: `- Frases más cortas que en el lenguaje jurídico o técnico (15–25 palabras).
- Máximo una oración subordinada por frase.
- Voz activa preferida; pasiva solo cuando sea necesario.
- Vocabulario común; términos técnicos explicados la primera vez.
- Estructura clara con títulos, subtítulos y listas.`,
  },

  pt: {
    name: 'Português',
    leichtLabel: 'Leitura Fácil',
    einfachLabel: 'Linguagem clara',
    leicht: `- 1 ideia por frase.
- Frases curtas, com estrutura simples (sujeito–verbo–complemento).
- Usar apenas tempos verbais frequentes (presente, passado simples).
- Evitar o conjuntivo e formas passivas.
- Usar vocabulário cotidiano e concreto; explicar qualquer palavra difícil.
- Não usar metáforas, expressões idiomáticas ou eufemismos.
- Usar sempre o mesmo termo para a mesma coisa.
- Parágrafos curtos com uma ideia principal.
- Listas com marcadores em vez de listas com vírgulas.`,
    einfach: `- Frases mais curtas do que em textos técnicos (15–25 palavras).
- No máximo uma oração subordinada por frase.
- Preferir a voz ativa; usar a voz passiva só quando necessário.
- Vocabulário comum; termos técnicos explicados da primeira vez.
- Estrutura clara com títulos, subtítulos e listas.`,
  },

  nl: {
    name: 'Nederlands',
    leichtLabel: 'Taal voor allemaal',
    einfachLabel: 'Taal voor allemaal+ / duidelijke taal',
    leicht: `- Eén boodschap per zin.
- Korte zinnen met een eenvoudige volgorde (onderwerp–werkwoord–rest).
- Alleen veelgebruikte, concrete woorden.
- Geen vaktaal, geen afkortingen zonder uitleg.
- Geen metaforen, spreekwoorden of ironie.
- Actieve zinnen: zeg wie iets doet.
- Korte alinea's en veel witruimte.
- Lijsten met bullets in plaats van lange zinnen met komma's.
- Consistent «je» of «u» gebruiken.`,
    einfach: `- Kortere zinnen dan in gewone brieven (ongeveer 15–25 woorden).
- Maximaal één bijzin per zin.
- Gewone woorden, vaktermen uitgelegd de eerste keer.
- Actieve vorm heeft de voorkeur.
- Duidelijke structuur met kopjes en lijsten.
- Consistent «je» of «u».`,
  },

  tr: {
    name: 'Türkçe',
    leichtLabel: 'Kolay Dil',
    einfachLabel: 'Sade Dil',
    leicht: `- Her cümlede tek bir bilgi ver.
- Kısa cümleler kullan.
- Sık kullanılan, somut kelimeler kullan.
- Uzun ve karmaşık fiil şekillerinden kaçın; basit zamanları kullan.
- Etken cümleler kur; kim ne yapıyor açık olsun.
- Mecaz, deyim, atasözü ve ironi kullanma.
- Aynı şey için her zaman aynı kelimeyi kullan.
- Kısa paragraflar ve listeler kullan.
- Uzun katılım ve ulaç yapılarından (-DIK, -(y)AN, -erek) kaçın.`,
    einfach: `- Cümleleri kısa ve açık yaz (15–25 kelime).
- Uzun ve iç içe geçmiş cümleleri böl.
- Günlük kelimeler kullan; terimleri ilk geçtiği yerde açıkla.
- Etken cümleleri tercih et.
- Metni mantıklı bölümlere ayır ve başlıklar kullan.`,
  },

  sq: {
    name: 'Shqip',
    leichtLabel: 'Gjuhë e lehtë',
    einfachLabel: 'Gjuhë e thjeshtë',
    leicht: `- Një ide për fjali.
- Fjali të shkurtra dhe të qarta.
- Fjalë të përditshme, pa metafora dhe idioma.
- Shpjego fjalët e vështira menjëherë.
- Formë aktive (jo pasive).
- Përdor listat dhe paragrafë të shkurtër.
- Numrat si shifra. Datat plotësisht.`,
    einfach: `- Fjali më të shkurtra se në tekstet zyrtare (15–25 fjalë).
- Maksimumi një fjali e varur për fjali.
- Fjalë të zakonshme; termat teknikë të shpjeguara.
- Formë aktive e preferuar.
- Strukturë e qartë me tituj dhe lista.`,
  },

  mk: {
    name: 'Македонски',
    leichtLabel: 'Лесен јазик',
    einfachLabel: 'Јасен јазик',
    leicht: `- Една информација по реченица.
- Кратки реченици. Прости, чести зборови.
- Едноставна структура (субјект–предикат–објект).
- Активна форма (не пасивна).
- Едноставни глаголски форми.
- Без метафори, идиоми или иронија.
- Ист збор за иста работа.
- Листи наместо набројување со запирки.
- Бројки со цифри. Датуми целосно.`,
    einfach: `- Кратки до средни реченици (15–25 зборови).
- Максимум една зависна реченица.
- Секојдневни зборови; стручни термини објаснети.
- Активна форма претпочитана.
- Јасна структура со наслови и листи.`,
  },

  sr: {
    name: 'Српски',
    leichtLabel: 'Лак језик',
    einfachLabel: 'Прост језик',
    leicht: `- Једна информација по реченици.
- Кратке реченице. Честе, свакодневне речи.
- Једноставна структура (субјекат–предикат–објекат).
- Активне реченице (не пасивне).
- Једноставни глаголски облици.
- Без метафора, идиома или ироније.
- Иста реч за исту ствар.
- Листе уместо набрајања зарезима.
- Бројеви цифрама. Датуми потпуно.`,
    einfach: `- Кратке до средње реченице (15–25 речи).
- Максимум једна зависна реченица.
- Свакодневне речи; стручни термини објашњени.
- Активна форма пожељна.
- Јасна структура са насловима и листама.`,
  },

  ru: {
    name: 'Русский',
    leichtLabel: 'Лёгкое чтение',
    einfachLabel: 'Простой язык',
    leicht: `- Одна информация на предложение. Короткие предложения.
- Частые, повседневные слова. Сложные слова объяснять сразу.
- Простая структура предложений (подлежащее–сказуемое–дополнение).
- Активный залог (не пассивный).
- Простые глагольные формы; избегать сложных причастных и деепричастных оборотов.
- Без метафор, идиом, иронии и канцелярита.
- Одно слово для одного понятия во всём тексте.
- Короткие абзацы, ясные заголовки, маркированные списки.
- Числа цифрами. Даты полностью (31 августа 2026 года).`,
    einfach: `- Короткие и средние предложения (15–25 слов). Максимум одно придаточное.
- Повседневные слова; специальные термины объяснять при первом упоминании.
- Активный залог предпочтителен.
- Избегать канцелярита и сложных причастных конструкций.
- Ясная структура с заголовками, подзаголовками и списками.`,
  },

  uk: {
    name: 'Українська',
    leichtLabel: 'Легке читання',
    einfachLabel: 'Проста мова',
    leicht: `- Одна інформація на речення. Короткі речення.
- Часті, повсякденні слова. Складні слова пояснювати одразу.
- Проста структура речень. Ключові слова на початку речення.
- Активний стан (не пасивний).
- Прості дієслівні форми; уникати складних дієприкметникових і дієприслівникових зворотів.
- Без метафор, ідіом, іронії та канцеляриту.
- Одне слово для одного поняття в усьому тексті.
- Короткі абзаци, чіткі заголовки, марковані списки.
- Числа цифрами. Дати повністю (31 серпня 2026 року).`,
    einfach: `- Короткі та середні речення (15–25 слів). Максимум одне підрядне.
- Повсякденні слова; фахові терміни пояснювати при першому згадуванні.
- Активний стан переважно.
- Уникати канцеляриту та складних дієприкметникових конструкцій.
- Чітка структура із заголовками, підзаголовками та списками.`,
  },

  ti: {
    name: 'ትግርኛ (Tigrinya)',
    leichtLabel: 'Easy Read',
    einfachLabel: 'Plain Language',
    leicht: `- One information per sentence. Short sentences.
- Common, everyday words. Explain difficult words immediately.
- Simple sentence structure. Active voice (no passive).
- No metaphors, idioms, or irony.
- Same word for the same concept throughout.
- Short paragraphs, clear headings, bullet lists.
- Numbers as digits. Dates in full.
- Use language close to spoken everyday Tigrinya, not formal written style.`,
    einfach: `- Short to medium sentences (15–25 words). Max. 1 subordinate clause.
- Everyday words; explain technical terms.
- Active voice preferred.
- Clear structure with headings and lists.
- Use accessible, community-level Tigrinya.`,
  },
};

/**
 * Builds the language-specific rules section for the Claude prompt.
 * Includes rules for ALL 15 supported languages so Claude can match
 * the detected input language to the correct ruleset.
 */
export function buildLanguageRulesPrompt(mode: 'einfach' | 'leicht'): string {
  const modeKey = mode === 'leicht' ? 'leicht' : 'einfach';

  const sections = Object.entries(RULES).map(([code, lang]) => {
    const label = mode === 'leicht' ? lang.leichtLabel : lang.einfachLabel;
    return `[${code}] ${lang.name} – ${label}:\n${lang[modeKey]}`;
  });

  return `LANGUAGE-SPECIFIC RULES

Detect the language of the input text. Then apply the matching rules below IN ADDITION to the generic rules above. The rules are written in the target language to guide your output.

${sections.join('\n\n')}

[other] If the input language is not listed above, apply the generic rules and respond in the detected input language.`;
}
