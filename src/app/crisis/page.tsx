import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Phone, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Crisis Resources | Akelapan",
  description:
    "भारत में मानसिक स्वास्थ्य हेल्पलाइन नंबर। 24x7 मुफ्त सहायता। KIRAN, Vandrevala और अन्य।",
};

const HELPLINES = [
  {
    name: "KIRAN (Government of India)",
    number: "1800-599-0019",
    desc: "24x7 toll-free, 13 भाषाओं में। Anxiety, depression, crisis management।",
    tollFree: true,
  },
  {
    name: "Vandrevala Foundation",
    number: "+91 9999 666 555",
    desc: "24x7 मुफ्त crisis counseling। Phone और WhatsApp दोनों।",
    tollFree: false,
  },
  {
    name: "Fortis National Helpline",
    number: "91-8376804102",
    desc: "24/7, कई भाषाओं में।",
    tollFree: false,
  },
  {
    name: "iCall (TISS)",
    number: "022-25521111",
    desc: "Mon-Sat, 8am-10pm।",
    tollFree: false,
  },
  {
    name: "Aasra (Mumbai)",
    number: "98204 66726",
    desc: "24/7 suicide prevention।",
    tollFree: false,
  },
];

export default function CrisisPage() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-10 sm:py-14 max-w-2xl mx-auto">
        {/* Minimal header: high contrast, calm */}
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Crisis Resources
        </h1>
        <p className="mt-2 text-muted-foreground">
          जरूरत पड़ने पर तुरंत मदद लें। सभी सेवाएं गोपनीय और मुफ्त।
        </p>

        {/* Single prominent message */}
        <div
          className="mt-8 flex gap-4 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 p-5"
          role="alert"
        >
          <AlertCircle className="size-6 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />
          <div>
            <p className="font-semibold text-foreground">
              आप अकेले नहीं हैं।
            </p>
            <p className="mt-1 text-sm text-foreground/90">
              अगर आप संकट में हैं या किसी से बात करने की जरूरत है, नीचे दी गई हेल्पलाइन पर तुरंत संपर्क करें।
            </p>
          </div>
        </div>

        {/* Helplines: numbers very prominent */}
        <h2 className="mt-10 text-lg font-semibold text-foreground flex items-center gap-2">
          <Phone className="size-5 text-primary" aria-hidden />
          हेल्पलाइन नंबर
        </h2>
        <ul className="mt-4 space-y-3" role="list">
          {HELPLINES.map((h) => (
            <li key={h.name}>
              <a
                href={`tel:${h.number.replace(/\s/g, "").replace(/-/g, "")}`}
                className="flex flex-col gap-1 rounded-xl border-2 border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-card focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{h.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
                <span className="text-lg font-bold text-primary shrink-0 sm:text-xl">
                  {h.number}
                  {h.tollFree && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (toll-free)
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <strong className="text-foreground">Disclaimer:</strong> Akelapan emotional support content प्रदान करता है। यह पेशेवर मानसिक स्वास्थ्य उपचार का विकल्प नहीं है। गंभीर मामलों में कृपया qualified professional से संपर्क करें।
        </p>

        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            ← होम पर वापस जाएं
          </Link>
        </p>
      </Container>
    </div>
  );
}
