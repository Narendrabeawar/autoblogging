/**
 * Seed sample articles. Run with: pnpm exec tsx scripts/seed-articles.ts
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in env (or use .env.local with service key)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY (or ANON_KEY)");
  process.exit(1);
}

const supabase = createClient(url, key);

const articles = [
  {
    title: "अकेलेपन से कैसे निपटें: 7 प्रैक्टिकल टिप्स",
    slug: "akelapan-se-kaise-nipte",
    content: `<p>अकेलापन महसूस करना पूरी तरह से सामान्य है। कभी-कभी हम सबको ऐसा लगता है कि हम अकेले हैं।</p>
<h2>1. छोटी शुरुआत करें</h2>
<p>एक दिन में सब कुछ बदलने की कोशिश न करें। छोटे कदम उठाएं।</p>
<h2>2. अपनी भावनाओं को स्वीकार करें</h2>
<p>अकेलापन महसूस करना कोई कमजोरी नहीं है।</p>
<p>याद रखें - आप अकेले नहीं हैं।</p>`,
    excerpt:
      "अकेलापन महसूस करना सामान्य है। इन सरल तरीकों से आप अपने आप को बेहतर महसूस कर सकते हैं।",
    status: "published",
    published_at: new Date().toISOString(),
  },
  {
    title: "Breakup के बाद खुद को कैसे संभालें",
    slug: "breakup-ke-baad-khud-ko-kaise-sambhale",
    content: `<p>रिश्ता टूटने के बाद उबरना मुश्किल लग सकता है।</p>
<h2>समय दें</h2>
<p>खुद को ठीक होने का समय दें।</p>
<h2>सहारा लें</h2>
<p>दोस्तों और परिवार से बात करें।</p>`,
    excerpt:
      "रिश्ता टूटने के बाद उबरना मुश्किल लग सकता है। यहां कुछ ऐसे तरीके हैं जो मदद कर सकते हैं।",
    status: "published",
    published_at: new Date().toISOString(),
  },
  {
    title: "रोज़ सुबह motivation कैसे पाएं",
    slug: "roz-subah-motivation-kaise-paye",
    content: `<p>हर दिन नई शुरुआत का मौका है।</p>
<h2>सुबह की आदतें</h2>
<p>नियमित दिनचर्या आपको ऊर्जा देती है।</p>
<h2>छोटे लक्ष्य</h2>
<p>छोटे कदमों से शुरू करें।</p>`,
    excerpt:
      "हर दिन नई शुरुआत का मौका है। इन आदतों से अपने दिन को सकारात्मक बनाएं।",
    status: "published",
    published_at: new Date().toISOString(),
  },
];

async function seed() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", ["loneliness", "breakup", "motivation"]);

  const catMap = Object.fromEntries(
    (categories ?? []).map((c) => [c.slug, c.id])
  );

  for (let i = 0; i < articles.length; i++) {
    const slug = ["loneliness", "breakup", "motivation"][i];
    const { error } = await supabase.from("articles").upsert(
      {
        ...articles[i],
        category_id: catMap[slug],
      },
      { onConflict: "slug" }
    );
    if (error) console.error("Error:", error);
    else console.log("Seeded:", articles[i].title);
  }
  console.log("Done!");
}

seed();
