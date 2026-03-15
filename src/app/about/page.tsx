import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Heart } from "lucide-react";

export const metadata = {
  title: "About | Akelapan",
  description: "Akelapan के बारे में - आपके अकेलेपन में आपका साथ।",
};

export default function AboutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="About Akelapan"
        subtitle="आपके अकेलेपन में आपका साथ"
      />
      <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          Akelapan एक emotional support content platform है जहाँ लोग अकेलेपन,
          रिश्तों, breakup, motivation और life guidance से जुड़ा content पढ़
          सकते हैं।
        </p>
        <p className="leading-relaxed">
          हमारा मकसद है लोगों को emotional guidance देना और उन्हें बताना कि वे
          अकेले नहीं हैं। हम हिंदी में practical advice, real-life examples और
          supportive content प्रदान करते हैं।
        </p>
        <p className="leading-relaxed">
          <strong className="text-foreground">ध्यान दें:</strong> यह पेशेवर
          मानसिक स्वास्थ्य सलाह का विकल्प नहीं है। अगर आप गंभीर संकट में हैं,
          तो कृपया किसी qualified professional से संपर्क करें।
        </p>
        <div className="flex items-center gap-2 pt-4 text-primary">
          <Heart className="size-5" />
          <span className="font-medium text-foreground">आप अकेले नहीं हैं।</span>
        </div>
      </div>
    </Container>
  );
}
