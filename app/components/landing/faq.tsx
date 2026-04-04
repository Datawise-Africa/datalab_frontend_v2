import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

const faqs = [
  {
    q: 'What types of datasets are available?',
    a: 'We host datasets across health, agriculture, finance, climate, education, NLP, computer vision, and more. All datasets are curated for quality and include detailed metadata, licensing info, and documentation.',
  },
  {
    q: 'How do I preview data before downloading?',
    a: 'Every dataset with CSV files includes an inline preview showing column headers and sample rows. You can inspect the data structure and quality directly in your browser before downloading.',
  },
  {
    q: 'What licenses are supported?',
    a: 'Creators can choose from standard licenses including Open Access, Creative Commons (CC-BY, CC-BY-SA), research-only, and custom commercial licenses. License terms are clearly displayed and enforced.',
  },
  {
    q: 'How do workspaces work?',
    a: 'Workspaces let teams collaborate on datasets. Create a workspace, invite members with admin, creator, or member roles, and manage shared datasets together with role-based access control.',
  },
  {
    q: 'How do I become a dataset creator?',
    a: 'Apply through the Creator Program page. Share your background, intended datasets, and expertise. Our team reviews applications and typically responds within a few business days.',
  },
  {
    q: 'Are there paid datasets?',
    a: 'Yes, creators can publish both free and premium (paid) datasets. Premium datasets require a one-time purchase before download. Creators set their own pricing.',
  },
  {
    q: 'Is there an API?',
    a: 'Yes. Every dataset is accessible via our REST API. We provide official SDKs for Python, JavaScript, and R. Check the API Documentation page for endpoints, authentication, and code examples.',
  },
];

export function FAQ() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Common questions about the platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
