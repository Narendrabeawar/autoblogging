export const SITE_NAME = "Akelapan";
export const SITE_DESCRIPTION =
  "आपके अकेलेपन में आपका साथ। Emotional support, breakup advice, motivation और life guidance हिंदी में।";

export const CATEGORIES = [
  {
    name: "Loneliness",
    slug: "loneliness",
    icon: "💭",
    image: "/images/categories/loneliness.svg",
    imageAlt: "Person sitting alone but surrounded by soft warm light",
    description: "जब भी दिल भारी लगे, अकेलेपन से निकलने के लिए यह corner आपके साथ है।",
    descriptionEn: "Whenever your heart feels heavy, this corner is here to help you through loneliness.",
  },
  {
    name: "Breakup",
    slug: "breakup",
    icon: "💔",
    image: "/images/categories/breakup.svg",
    imageAlt: "Broken heart healing with soft light around it",
    description: "रिश्ता टूटने के बाद खुद को दोबारा जोड़ने के लिए safe space।",
    descriptionEn: "A safe space to heal and reconnect with yourself after a breakup.",
  },
  {
    name: "Relationships",
    slug: "relationships",
    icon: "❤️",
    image: "/images/categories/relationships.svg",
    imageAlt: "Two people talking calmly and connecting",
    description: "प्यार, trust और boundaries पर आसानी से समझ आने वाले guides।",
    descriptionEn: "Easy-to-understand guides on love, trust, and boundaries.",
  },
  {
    name: "Friendship",
    slug: "friendship",
    icon: "🤝",
    image: "/images/categories/friendship.svg",
    imageAlt: "Friends walking together in a warm scene",
    description: "दोस्ती बनाने, बचाने और अकेलेपन से बाहर आने की कहानियाँ।",
    descriptionEn: "Stories on making and keeping friends, and finding your way out of loneliness.",
  },
  {
    name: "Self Improvement",
    slug: "self-improvement",
    icon: "🌱",
    image: "/images/categories/self-improvement.svg",
    imageAlt: "Small plant growing symbolising self growth",
    description: "छोटे-छोटे steps से खुद को बेहतर बनाने की practical बातें।",
    descriptionEn: "Practical steps to become a better version of yourself.",
  },
  {
    name: "Mental Strength",
    slug: "mental-strength",
    icon: "💪",
    image: "/images/categories/mental-strength.svg",
    imageAlt: "Calm brain illustration with strong light around it",
    description: "Stress, overthinking और चिंता में भी strong रहने के तरीके।",
    descriptionEn: "Ways to stay strong through stress, overthinking, and anxiety.",
  },
  {
    name: "Motivation",
    slug: "motivation",
    icon: "✨",
    image: "/images/categories/motivation.svg",
    imageAlt: "Sunrise and a person moving forward with hope",
    description: "जब energy low हो, तो फिर से उठने की gentle motivation।",
    descriptionEn: "Gentle motivation to get back up when your energy is low.",
  },
  {
    name: "Life Advice",
    slug: "life-advice",
    icon: "📖",
    image: "/images/categories/life-advice.svg",
    imageAlt: "Open book with warm light and simple icons",
    description: "रिश्तों, career और रोज़मर्रा की उलझनों पर clear life guidance।",
    descriptionEn: "Clear guidance on relationships, career, and everyday life.",
  },
] as const;

/** Small gray image as base64 for next/image placeholder="blur" (reduces CLS). */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTJlMmUyIi8+PC9zdmc+";
