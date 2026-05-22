import { Link } from 'react-router';
import { Database, Mail, MapPin, Phone } from 'lucide-react';

import { Separator } from '~/components/ui/separator';

const productLinks = [
  { label: 'Datasets', to: '/datasets' },
  { label: 'Dashboards', to: '/dashboards' },
  { label: 'Become a Creator', to: '/creators' },
] as const;

const companyLinks = [
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
] as const;

const contactInfo = [
  {
    icon: Mail,
    value: 'info@datawiseafrica.com',
    href: 'mailto:info@datawiseafrica.com',
  },
  {
    icon: Phone,
    value: '+254 704 237 879',
    href: 'tel:+254704237879',
  },
  {
    icon: MapPin,
    value: 'Highway Heights, Marcus Garvey Rd, Kilimani, Nairobi, Kenya',
    href: 'https://www.google.com/maps/search/?api=1&query=Highway+Heights+Marcus+Garvey+Rd+Kilimani+Nairobi',
  },
] as const;

function FooterLinkGroup({
  title,
  links,
}: Readonly<{
  title: string;
  links: ReadonlyArray<{ label: string; to: string }>;
}>) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-foreground">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-sidebar-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">Data</span>
                <span className="text-sidebar-foreground">Lab</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Africa&apos;s home for curated, high-quality datasets — built by{' '}
              <span className="text-sidebar-foreground">Datawise Africa</span>{' '}
              to power data-driven research, products, and decisions.
            </p>
          </div>

          {/* Product column */}
          <div className="lg:col-span-2">
            <FooterLinkGroup title="Product" links={productLinks} />
          </div>

          {/* Company column */}
          <div className="lg:col-span-2">
            <FooterLinkGroup title="Company" links={companyLinks} />
          </div>

          {/* Contact column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, value, href }) => (
                <li key={value}>
                  <a
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-sidebar-foreground"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Datawise Africa. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-muted-foreground transition-colors hover:text-sidebar-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-sm text-muted-foreground transition-colors hover:text-sidebar-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
