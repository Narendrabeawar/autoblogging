const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Akelapan",
    url: SITE_URL,
    description:
      "आपके अकेलेपन में आपका साथ। Emotional support और life guidance हिंदी में।",
    inLanguage: "hi",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
