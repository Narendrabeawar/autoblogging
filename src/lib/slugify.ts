/**
 * Slugify text to URL-safe English (ASCII only).
 * Transliterates Hindi/Devanagari to roman script when possible.
 */

function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Devanagari to Roman (Hunterian-style) - using Unicode escapes for build compatibility
 */
const DEVANAGARI_TO_ROMAN: Record<string, string> = {
  "\u0905": "a", "\u0906": "aa", "\u0907": "i", "\u0908": "ee", "\u0909": "u", "\u090A": "oo",
  "\u090F": "e", "\u0910": "ai", "\u0913": "o", "\u0914": "au",
  "\u0915": "k", "\u0916": "kh", "\u0917": "g", "\u0918": "gh", "\u0919": "ng",
  "\u091A": "ch", "\u091B": "chh", "\u091C": "j", "\u091D": "jh", "\u091E": "ny",
  "\u091F": "t", "\u0920": "th", "\u0921": "d", "\u0922": "dh", "\u0923": "n",
  "\u0924": "t", "\u0925": "th", "\u0926": "d", "\u0927": "dh", "\u0928": "n",
  "\u092A": "p", "\u092B": "ph", "\u092C": "b", "\u092D": "bh", "\u092E": "m",
  "\u092F": "y", "\u0930": "r", "\u0932": "l", "\u0935": "v",
  "\u0936": "sh", "\u0937": "sh", "\u0938": "s", "\u0939": "h",
  "\u093E": "a", "\u093F": "i", "\u0940": "ee", "\u0941": "u", "\u0942": "oo",
  "\u0947": "e", "\u0948": "ai", "\u094B": "o", "\u094C": "au",
  "\u0902": "m", "\u0903": "h", "\u094D": "", "\u0943": "ri", "\u0944": "ree",
  "\u0958": "q", "\u0959": "kh", "\u095A": "g", "\u095B": "z", "\u095C": "d", "\u095D": "rh", "\u095E": "f",
  "\u0931": "r", "\u0933": "l", "\u0934": "l",
  "\u0915\u093C\u0937": "ksh", "\u0924\u094D\u0930": "tr", "\u091C\u094D\u091E": "gy",
  "\u0936\u094D\u0930": "shr", "\u0915\u094D\u0924": "kt",
};

function transliterateDevanagari(text: string): string {
  let result = "";
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const len of [3, 2, 1]) {
      const chunk = text.slice(i, i + len);
      if (DEVANAGARI_TO_ROMAN[chunk] !== undefined) {
        result += DEVANAGARI_TO_ROMAN[chunk];
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const char = text[i];
      if (char === " " || char === "-") {
        result += " ";
      } else if (/[a-zA-Z0-9]/.test(char)) {
        result += char.toLowerCase();
      } else if (/[\u0900-\u097F]/.test(char)) {
        result += "";
      }
      i++;
    }
  }
  return result;
}

/**
 * Convert any text to URL-safe English slug.
 */
export function slugifyEnglish(text: string): string {
  if (!text?.trim()) return "";

  let normalized = text.trim();

  if (hasDevanagari(normalized)) {
    normalized = transliterateDevanagari(normalized);
  }

  return normalized
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
