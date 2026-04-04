import type { Route } from './+types/privacy-policy';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';

export const meta: Route.MetaFunction = () => [
  { title: 'Privacy Policy — Data Lab' },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 1. Introduction */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          1. Introduction
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Data Lab Inc. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates the datalab.io website and platform (the
          &quot;Service&quot;). This Privacy Policy explains how we collect,
          use, disclose, and protect your information when you visit or use our
          Service.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          By accessing or using the Service, you agree to the collection and use
          of information in accordance with this policy. If you do not agree
          with the terms of this Privacy Policy, please do not access or use the
          Service.
        </p>

        {/* 2. Information We Collect */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          2. Information We Collect
        </h2>
        <Separator className="mb-6" />

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          Personal Information
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you create an account, subscribe to a plan, or contact us, we may
          collect the following personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>Full name and display name</li>
          <li>Email address</li>
          <li>Organization or company name</li>
          <li>
            Payment details (credit card information, billing address) when
            subscribing to a paid plan
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          Usage Data
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We automatically collect certain information when you interact with
          our Service, including:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            API call logs (endpoints accessed, request parameters, timestamps)
          </li>
          <li>IP addresses</li>
          <li>Browser type and version</li>
          <li>Device information (operating system, screen resolution)</li>
          <li>Pages visited and navigation patterns</li>
        </ul>

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          Cookies and Tracking Technologies
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We use cookies, web beacons, and similar tracking technologies to
          collect and store information about your interactions with the
          Service. For more details, see Section 7 (Cookies) below.
        </p>

        {/* 3. How We Use Your Information */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          3. How We Use Your Information
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Provide and maintain the Service</strong> — to operate,
            deliver, and support the Data Lab platform and its features
          </li>
          <li>
            <strong>Process API requests</strong> — to authenticate, authorize,
            and fulfill your dataset and API queries
          </li>
          <li>
            <strong>Send service updates</strong> — to notify you of important
            changes, security alerts, and administrative messages
          </li>
          <li>
            <strong>Improve our datasets and platform</strong> — to analyze
            usage patterns, identify areas for improvement, and develop new
            features
          </li>
          <li>
            <strong>Comply with legal obligations</strong> — to meet our
            regulatory requirements and respond to lawful requests from
            authorities
          </li>
        </ul>

        {/* 4. Data Sharing */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          4. Data Sharing
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          <strong>
            We do NOT sell your personal data to third parties under any
            circumstances.
          </strong>
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may share your information only in the following limited
          situations:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Service providers</strong> — trusted third parties that
            assist us with hosting, payment processing, analytics, and customer
            support
          </li>
          <li>
            <strong>Legal requirements</strong> — when required by law,
            regulation, legal process, or enforceable governmental request
          </li>
          <li>
            <strong>Business transfers</strong> — in connection with a merger,
            acquisition, reorganization, or sale of assets, your information may
            be transferred as part of that transaction
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All third parties with whom we share data are bound by data processing
          agreements that require them to protect your information and use it
          only for the specific purposes for which it was shared.
        </p>

        {/* 5. Data Retention */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          5. Data Retention
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We retain your information in accordance with the following
          guidelines:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Account data</strong> — retained for as long as your account
            remains active and for a reasonable period thereafter to fulfill
            legal and business obligations
          </li>
          <li>
            <strong>API logs</strong> — retained for 90 days from the date of
            the request, after which they are automatically purged
          </li>
          <li>
            <strong>Account deletion</strong> — upon receiving a verified
            account deletion request, we will delete your personal data within
            30 days, except where retention is required by law
          </li>
        </ul>

        {/* 6. Your Rights */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          6. Your Rights
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Depending on your location, you may have rights under the General Data
          Protection Regulation (GDPR), the California Consumer Privacy Act
          (CCPA), or other applicable data protection laws. These rights may
          include:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Right of access</strong> — request a copy of the personal
            data we hold about you
          </li>
          <li>
            <strong>Right to rectification</strong> — request correction of
            inaccurate or incomplete personal data
          </li>
          <li>
            <strong>Right to erasure</strong> — request deletion of your
            personal data
          </li>
          <li>
            <strong>Right to data portability</strong> — request your data in a
            structured, commonly used, and machine-readable format
          </li>
          <li>
            <strong>Right to restrict processing</strong> — request that we
            limit our processing of your personal data
          </li>
          <li>
            <strong>Right to object</strong> — object to processing of your
            personal data for certain purposes
          </li>
          <li>
            <strong>Right to withdraw consent</strong> — withdraw consent at any
            time where we rely on consent as the legal basis for processing
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          To exercise any of these rights, please contact us at{' '}
          <a
            href="mailto:privacy@datalab.io"
            className="text-primary hover:text-primary underline"
          >
            privacy@datalab.io
          </a>
          . We will respond to your request within 30 days.
        </p>

        {/* 7. Cookies */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          7. Cookies
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We use the following types of cookies on our Service:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Essential cookies</strong> — required for the Service to
            function properly, including session management and security tokens
          </li>
          <li>
            <strong>Analytics cookies</strong> — help us understand usage
            patterns, popular features, and areas for improvement
          </li>
          <li>
            <strong>Preference cookies</strong> — remember your settings, such
            as language preference, theme selection, and display options
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You can manage cookie preferences through your browser settings or by
          using our cookie consent banner when you first visit the Service.
          Please note that disabling essential cookies may impact the
          functionality of the Service.
        </p>

        {/* 8. Security */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          8. Security
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We take the security of your information seriously and implement
          industry-standard measures to protect it, including:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>AES-256 encryption at rest</strong> — all stored data is
            encrypted using Advanced Encryption Standard with 256-bit keys
          </li>
          <li>
            <strong>TLS 1.3 in transit</strong> — all data transmitted between
            your device and our servers is protected with the latest Transport
            Layer Security protocol
          </li>
          <li>
            <strong>Regular penetration testing</strong> — we conduct
            third-party security assessments on a quarterly basis
          </li>
          <li>
            <strong>SOC 2 Type II certified</strong> — our infrastructure and
            processes have been independently audited and certified
          </li>
          <li>
            <strong>Access controls and audit logs</strong> — strict role-based
            access controls and comprehensive audit logging across all systems
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          While we strive to protect your personal information, no method of
          transmission over the Internet or method of electronic storage is 100%
          secure. We cannot guarantee absolute security.
        </p>

        {/* 9. Children's Privacy */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          9. Children&apos;s Privacy
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The Service is not intended for use by individuals under the age of
          16. We do not knowingly collect personal data from children under 16.
          If we become aware that we have inadvertently collected personal data
          from a child under 16, we will take immediate steps to delete that
          information from our systems.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you are a parent or guardian and believe your child has provided us
          with personal information, please contact us at{' '}
          <a
            href="mailto:privacy@datalab.io"
            className="text-primary hover:text-primary underline"
          >
            privacy@datalab.io
          </a>{' '}
          so we can take appropriate action.
        </p>

        {/* 10. Changes to This Policy */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          10. Changes to This Policy
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technologies, legal requirements, or other factors.
          When we make material changes, we will:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            Notify you via email at the address associated with your account
          </li>
          <li>Display a prominent banner on the platform</li>
          <li>
            Provide at least 30 days&apos; notice before the changes take effect
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We encourage you to review this Privacy Policy periodically. Your
          continued use of the Service after the effective date of the revised
          policy constitutes your acceptance of the changes.
        </p>

        {/* 11. Contact Us */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          11. Contact Us
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please contact us:
        </p>
        <ul className="list-none space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:privacy@datalab.io"
              className="text-primary hover:text-primary underline"
            >
              privacy@datalab.io
            </a>
          </li>
          <li>
            <strong>Address:</strong> Data Lab Inc., 123 Data Street, San
            Francisco, CA 94105
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
          <p>
            &copy; {new Date().getFullYear()} Data Lab Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
