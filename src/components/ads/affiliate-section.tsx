import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";

interface AffiliateItem {
  title: string;
  description: string;
  url: string;
  affiliateTag?: string;
}

const AFFILIATE_ITEMS: AffiliateItem[] = [
  {
    title: "Self-Help Books",
    description: "अकेलेपन और motivation पर किताबें",
    url: "https://amzn.to/4cOSYdE",
    
  },
  {
    title: "Journal & Diary",
    description: "अपने विचार लिखने के लिए journal",
    url: "https://www.amazon.in/s?k=journal+diary",
    
  },
];

export function AffiliateSection() {
  return (
    <section className="py-12 sm:py-16 border-t border-border bg-muted/20">
      <Container>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          आपके लिए सुझाव
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          इन products से आपको मदद मिल सकती है। (Affiliate links – हमें छोटा commission मिलता है)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AFFILIATE_ITEMS.map((item) => {
            const url = item.affiliateTag
              ? `${item.url}${item.url.includes("?") ? "&" : "?"}tag=${item.affiliateTag}`
              : item.url;
            return (
              <Link
                key={item.title}
                href={url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ExternalLink className="size-4 text-muted-foreground shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
