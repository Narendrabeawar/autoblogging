import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact | Akelapan",
  description: "Akelapan से संपर्क करें।",
};

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="Contact"
        subtitle="हमसे संपर्क करें"
      />
      <div className="max-w-xl mx-auto space-y-6 text-muted-foreground">
        <p className="leading-relaxed">
          अगर आपके कोई सवाल या सुझाव हैं, तो हमें ईमेल करें।
        </p>
        <Button asChild>
          <a href="mailto:contact@akelapan.com">contact@akelapan.com</a>
        </Button>
      </div>
    </Container>
  );
}
