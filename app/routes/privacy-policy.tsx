import type { Route } from './+types/privacy-policy';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';

export const meta: Route.MetaFunction = () => [
  { title: 'Privacy Policy — Data Lab' },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Effective Date: 1 May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-muted-foreground leading-relaxed mb-4">
          Welcome to our platform. This Privacy Policy explains how we collect,
          use, and protect information when you use our website, applications,
          and related services (together, the &quot;Services&quot;).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our platform enables users to create, host, access, and share
          datasets, generate insights, and publish research and data products.
          By using the Services, you agree to the practices described below.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &quot;Effective Date&quot; above. Continued use of the
          Services means you accept the updated Policy.
        </p>

        {/* Information We Collect */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Information We Collect
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We collect information in a few different ways when you use our
          Services.
        </p>

        <h3 className="text-xl font-medium mt-8 mb-3 text-foreground">
          Information you provide directly
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you create an account or use the platform, you may provide
          details such as your name, email address, organization, login
          credentials, and profile information. You also provide any content you
          upload or create, including datasets, descriptions, documentation,
          comments, and feedback.
        </p>

        <h3 className="text-xl font-medium mt-8 mb-3 text-foreground">
          Information collected automatically
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you interact with the platform, we collect information about how
          you use it. This may include your device type, browser, IP address,
          pages you visit, actions you take, and how you interact with datasets,
          dashboards, and other content.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We also use cookies and similar technologies to keep the platform
          working properly and to understand usage patterns.
        </p>

        <h3 className="text-xl font-medium mt-8 mb-3 text-foreground">
          Payment information
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you purchase a product or subscription, we collect billing details
          such as name and billing information. Payments are processed by
          third-party providers, and we do not store full card details on our
          systems.
        </p>

        {/* How We Use Information */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          How We Use Information
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We use the information we collect to operate and improve the Services,
          including to:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>provide access to datasets, tools, and platform features</li>
          <li>enable users to create, host, and share datasets</li>
          <li>process payments and manage subscriptions</li>
          <li>generate insights, dashboards, and research outputs</li>
          <li>improve performance, reliability, and user experience</li>
          <li>detect and prevent fraud, abuse, or security issues</li>
          <li>communicate important updates about the platform</li>
        </ul>

        {/* Data Ownership */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Data Ownership
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You retain ownership of the datasets and content you create or upload
          to the platform.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          By using the Services, you grant us permission to host, store,
          process, and display your content solely for the purpose of operating
          and improving the platform.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Any purchased datasets or products are subject to their respective
          licensing terms.
        </p>

        {/* Sharing of Information */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Sharing of Information
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We do not sell personal data.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may share information only in limited cases, such as:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>when you give us permission</li>
          <li>when required by law or legal process</li>
          <li>to protect the security and integrity of the platform</li>
          <li>
            with service providers who help us run the Services (under strict
            confidentiality obligations)
          </li>
        </ul>

        {/* Data Security */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Data Security
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We take reasonable measures to protect your information. These include
          access controls, secure infrastructure, and monitoring systems
          designed to prevent unauthorized access or misuse.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          While we work to protect your data, no system can be completely
          secure.
        </p>

        {/* Data Retention */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Data Retention
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We keep information only for as long as it is needed to provide the
          Services, comply with legal obligations, resolve disputes, or support
          platform operations.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You may request deletion of your account and associated data, subject
          to applicable legal requirements.
        </p>

        {/* Your Rights */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Your Rights
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Depending on where you are located, you may have rights to:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>access your personal information</li>
          <li>request correction or deletion</li>
          <li>export your data</li>
          <li>manage communication preferences</li>
        </ul>

        {/* Cookies */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Cookies
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We use cookies to keep the platform functioning properly, maintain
          sessions, and understand how the Services are used.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You can manage or disable cookies through your browser settings,
          though some features may not work as intended.
        </p>

        {/* Third-Party Services */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Third-Party Services
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We rely on third-party providers for things like payments, analytics,
          hosting, and authentication. These providers process data under their
          own privacy policies.
        </p>

        {/* Platform Integrity */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Platform Integrity
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may use usage data, IP information, and content activity to help
          detect and prevent abuse, fraud, or security risks. In some cases, we
          may restrict or suspend accounts that violate our policies.
        </p>

        {/* Contact */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Contact
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul className="list-none space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:info@datawiseafrica.com"
              className="text-primary hover:text-primary underline"
            >
              info@datawiseafrica.com
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{' '}
            <a
              href="tel:+254704237879"
              className="text-primary hover:text-primary underline"
            >
              +254 704 237 879
            </a>
          </li>
          <li>
            <strong>Office:</strong> Highway Heights, Marcus Garvey Rd,
            Kilimani, Nairobi, Kenya
          </li>
        </ul>

        {/* Footer Navigation */}
        <Separator className="mt-16 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link
            to="/terms-of-service"
            className="text-primary hover:text-primary underline"
          >
            Terms of Service
          </Link>
          <p>&copy; {new Date().getFullYear()} Datalab. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
