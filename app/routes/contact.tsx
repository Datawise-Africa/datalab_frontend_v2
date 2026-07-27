import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/contact';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import { Mail, MapPin, Phone, ChevronDown, Send } from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

export const meta: Route.MetaFunction = () =>
  generateSEOTags({
    title: 'Contact Us',
    description:
      "Get in touch with the Data Lab team. We'd love to hear from you.",
  });

const contactItems = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@datawiseafrica.com',
    href: 'mailto:info@datawiseafrica.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+254 704 237 879',
    href: 'tel:+254704237879',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Highway Heights, Marcus Garvey Rd, Kilimani, Nairobi, Kenya',
    href: 'https://www.google.com/maps/search/?api=1&query=Highway+Heights+Marcus+Garvey+Rd+Kilimani+Nairobi',
  },
] as const;

const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'Create a free Data Lab account, then browse and download datasets directly from the catalog. You can also apply to become a dataset creator to publish your own datasets.',
  },
  {
    question: 'What data formats are supported?',
    answer:
      'Data Lab supports CSV, JSON, Parquet, and Excel (.xlsx) formats for both import and export. Our API returns JSON by default, but you can request other formats via the Accept header or a query parameter.',
  },
  {
    question: 'How do I report a data quality issue?',
    answer:
      'You can report data quality issues directly from any dataset page using the "Report Issue" button, or by emailing us at info@datawiseafrica.com with the dataset ID and a description of the problem. We typically respond within 24 hours.',
  },
];

function FaqItem({
  question,
  answer,
}: Readonly<{ question: string; answer: string }>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-primary/20/60 rounded-xl overflow-hidden bg-white dark:bg-primary/5 dark:border-primary/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium transition-colors',
          'hover:bg-primary/5/60 dark:hover:bg-primary/20',
          open && 'bg-primary/5/40 dark:bg-primary/10'
        )}
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-primary transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Get in Touch"
        description="Have a question about features, pricing, or anything else? Our team is ready to help."
      />

      {/* ── Contact Form + Info ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left — Form */}
          <div className="lg:col-span-3">
            <Card className="border-primary/20/60 shadow-sm dark:border-primary/40">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        required
                        className="border-primary/20 focus-visible:ring-primary dark:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="border-primary/20 focus-visible:ring-primary dark:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      required
                      defaultValue=""
                      className={cn(
                        'flex h-10 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm',
                        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary'
                      )}
                    >
                      <option value="" disabled>
                        Select a subject…
                      </option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="research">Research Collaboration</option>
                      <option value="bug">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us how we can help…"
                      required
                      className="border-primary/20 focus-visible:ring-primary dark:border-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitted ? 'Message Sent!' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right — Contact Info */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact information
              </p>

              <ul className="mt-6 space-y-2">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className={cn(
                        'group -mx-3 flex items-start gap-4 rounded-xl px-3 py-3 transition-colors',
                        'hover:bg-primary/5 dark:hover:bg-primary/10'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors',
                          'group-hover:bg-primary group-hover:text-white',
                          'dark:bg-primary/20'
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="border-t border-primary/20/60 bg-primary/5/30 py-16 dark:border-primary/40 dark:bg-primary/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers to the questions we hear most often.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{' '}
              <a
                href="mailto:info@datawiseafrica.com"
                className="font-medium text-primary hover:underline dark:text-primary"
              >
                Reach out directly
              </a>{' '}
              — we typically respond within a few hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
