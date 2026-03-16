import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/contact';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import {
  Mail,
  MapPin,
  Phone,
  Twitter,
  Github,
  Linkedin,
  ChevronDown,
  Send,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

export const meta: Route.MetaFunction = () =>
  generateSEOTags({
    title: 'Contact Us',
    description:
      "Get in touch with the Data Lab team. We'd love to hear from you.",
  });

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
    question: 'Is there a free tier?',
    answer:
      'Yes! Our free tier includes 1,000 API requests per month, access to all public datasets, and up to 50 MB of storage. No credit card is required to get started.',
  },
  {
    question: 'How do I report a data quality issue?',
    answer:
      'You can report data quality issues directly from any dataset page using the "Report Issue" button, or by emailing us at support@datalab.io with the dataset ID and a description of the problem. We typically respond within 24 hours.',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
            We'd love to hear from you. Whether you have a question about
            features, pricing, or anything else — our team is ready to answer
            all your questions.
          </p>
        </div>
      </section>

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
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Email */}
            <Card className="border-primary/20/60 shadow-sm dark:border-primary/40">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:hello@datalab.io"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    hello@datalab.io
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Office */}
            <Card className="border-primary/20/60 shadow-sm dark:border-primary/40">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-muted-foreground">
                    123 Data Street, San Francisco, CA 94105
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="border-primary/20/60 shadow-sm dark:border-primary/40">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+15551234567"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Separator className="bg-primary/20 dark:bg-primary/40" />
            <div>
              <p className="mb-3 text-sm font-medium">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/datalab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 text-muted-foreground transition-colors',
                    'hover:border-primary/80 hover:bg-primary/5 hover:text-primary',
                    'dark:border-primary dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary'
                  )}
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/datalab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 text-muted-foreground transition-colors',
                    'hover:border-primary/80 hover:bg-primary/5 hover:text-primary',
                    'dark:border-primary dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary'
                  )}
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/datalab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 text-muted-foreground transition-colors',
                    'hover:border-primary/80 hover:bg-primary/5 hover:text-primary',
                    'dark:border-primary dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary'
                  )}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
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
                href="mailto:hello@datalab.io"
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
