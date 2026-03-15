/**
 * Keyword/Topic finder for AI article generation.
 * Uses content calendar + predefined topic bank.
 */

export interface TopicSuggestion {
  topic: string;
  categorySlug: string;
  categoryName: string;
}

const CONTENT_CALENDAR: Record<string, string[]> = {
  "01": [
    "नए साल में नई शुरुआत कैसे करें",
    "पुरानी बातों को कैसे भूलें",
    "अकेलेपन में नई शुरुआत",
  ],
  "02": [
    "वैलेंटाइन डे पर अकेले कैसे रहें",
    "सेल्फ लव कैसे विकसित करें",
    "Breakup के बाद खुद को कैसे संभालें",
  ],
  "03": [
    "एग्जाम स्ट्रेस से कैसे निपटें",
    "स्टूडेंट लोनलीनेस",
    "दबाव में कैसे शांत रहें",
  ],
  "04": [
    "मौसमी उदासी से कैसे बचें",
    "गर्मियों में नई आदतें",
    "बदलाव से कैसे डील करें",
  ],
  "05": [
    "माँ से दूर रहकर कैसे जुड़े रहें",
    "परिवार के साथ रिश्ते सुधारें",
    "किसी को याद करते हुए कैसे रहें",
  ],
  "06": [
    "खुद को स्वीकार करना सीखें",
    "अपनी पहचान के साथ शांति",
    "कहीं का होने का एहसास",
  ],
  "07": [
    "मानसून और मूड",
    "बारिश में अकेलापन",
    "कोज़ी लोनलीनेस",
  ],
  "08": [
    "टॉक्सिक रिश्तों से आज़ादी",
    "खुद के लिए खड़े होना",
    "इंडिपेंडेंस डे और पर्सनल फ्रीडम",
  ],
  "09": [
    "त्योहारों में अकेलापन",
    "परिवार की उम्मीदों का दबाव",
    "फेस्टिव सीज़न में मानसिक स्वास्थ्य",
  ],
  "10": [
    "मानसिक स्वास्थ्य की बात करने में शर्म",
    "मदद लेने में संकोच न करें",
    "थेरेपी के बारे में मिथक",
  ],
  "11": [
    "दिवाली में अकेलापन",
    "त्योहारों का दबाव",
    "परिवार के साथ फेस्टिवल",
  ],
  "12": [
    "साल के अंत में रिफ्लेक्शन",
    "कृतज्ञता की आदत",
    "नए साल के लिए तैयारी",
  ],
};

const EVERGREEN_TOPICS: TopicSuggestion[] = [
  { topic: "अकेलेपन से कैसे निपटें", categorySlug: "loneliness", categoryName: "Loneliness" },
  { topic: "रात को अकेलापन महसूस होने पर क्या करें", categorySlug: "loneliness", categoryName: "Loneliness" },
  { topic: "नए शहर में दोस्त कैसे बनाएं", categorySlug: "friendship", categoryName: "Friendship" },
  { topic: "दोस्ती में trust कैसे बनाएं", categorySlug: "friendship", categoryName: "Friendship" },
  { topic: "Breakup के बाद सोशल मीडिया से कैसे दूर रहें", categorySlug: "breakup", categoryName: "Breakup" },
  { topic: "Ex से दोस्ती रखनी चाहिए या नहीं", categorySlug: "breakup", categoryName: "Breakup" },
  { topic: "रिश्ते में communication कैसे सुधारें", categorySlug: "relationships", categoryName: "Relationships" },
  { topic: "लॉन्ग डिस्टेंस रिश्ते में कैसे रहें", categorySlug: "relationships", categoryName: "Relationships" },
  { topic: "सुबह motivation कैसे पाएं", categorySlug: "motivation", categoryName: "Motivation" },
  { topic: "नकारात्मक सोच से कैसे बचें", categorySlug: "mental-strength", categoryName: "Mental Strength" },
  { topic: "खुद को बेहतर बनाने की शुरुआत", categorySlug: "self-improvement", categoryName: "Self Improvement" },
  { topic: "जीवन में बदलाव से कैसे डील करें", categorySlug: "life-advice", categoryName: "Life Advice" },
];

export function getTopicsForMonth(month: string): TopicSuggestion[] {
  const topics = CONTENT_CALENDAR[month] ?? [];
  return topics.map((t) => ({
    topic: t,
    categorySlug: "loneliness",
    categoryName: "Loneliness",
  }));
}

export function getRandomEvergreenTopic(): TopicSuggestion {
  const idx = Math.floor(Math.random() * EVERGREEN_TOPICS.length);
  return EVERGREEN_TOPICS[idx];
}

export function getTopicForDate(date: Date): TopicSuggestion {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const monthTopics = getTopicsForMonth(month);

  if (monthTopics.length > 0) {
    const day = date.getDate();
    const idx = day % monthTopics.length;
    return monthTopics[idx];
  }

  return getRandomEvergreenTopic();
}

export function getAllEvergreenTopics(): TopicSuggestion[] {
  return [...EVERGREEN_TOPICS];
}
