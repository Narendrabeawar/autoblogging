import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata = {
  title: "Privacy Policy | Akelapan",
  description:
    "Akelapan की गोपनीयता नीति। हम आपके डेटा को कैसे संग्रहित और उपयोग करते हैं।",
};

export default function PrivacyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="Privacy Policy"
        subtitle="गोपनीयता नीति"
      />

      <div className="max-w-2xl mx-auto prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground space-y-8">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. हम कौन हैं
          </h2>
          <p>
            Akelapan एक emotional support content platform है। हम अकेलेपन,
            relationships, breakup और motivation पर हिंदी में content प्रदान
            करते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. हम कौन सा डेटा एकत्र करते हैं
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Newsletter:</strong> जब आप
              subscribe करते हैं, हम आपका email संग्रहित करते हैं।
            </li>
            <li>
              <strong className="text-foreground">Usage data:</strong> Google
              Analytics और AdSense (अगर उपयोग में हो) के माध्यम से anonymous
              traffic data।
            </li>
            <li>
              <strong className="text-foreground">Cookies:</strong> Session,
              authentication और preferences के लिए।
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. डेटा का उपयोग
          </h2>
          <p>
            हम आपका डेटा केवल निम्नलिखित उद्देश्यों के लिए उपयोग करते हैं:
            newsletter भेजने, website को बेहतर बनाने, और analytics के लिए।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Third-party Services
          </h2>
          <p>
            हम Supabase (database), Vercel (hosting), Google (Analytics, AdSense)
            जैसी सेवाओं का उपयोग करते हैं। इनकी अपनी privacy policies लागू होती
            हैं।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. आपके अधिकार
          </h2>
          <p>
            आप किसी भी समय newsletter unsubscribe कर सकते हैं। आप हमसे अपने
            डेटा के बारे में पूछ सकते हैं या हटाने का अनुरोध कर सकते हैं।
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. संपर्क
          </h2>
          <p>
            प्रश्नों के लिए{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact
            </a>{" "}
            पेज के माध्यम से संपर्क करें।
          </p>
        </section>
      </div>
    </Container>
  );
}
