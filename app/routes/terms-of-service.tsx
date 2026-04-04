import type { Route } from './+types/terms-of-service';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';

export const meta: Route.MetaFunction = () => [
  { title: 'Terms of Service — Data Lab' },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 1. Acceptance of Terms */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          1. Acceptance of Terms
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          By accessing or using the Data Lab platform (the &quot;Service&quot;),
          you agree to be bound by these Terms of Service (&quot;Terms&quot;).
          These Terms constitute a legally binding agreement between you and
          Data Lab Inc. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you do not agree with any part of these Terms, you must not access
          or use the Service. By continuing to use the Service, you acknowledge
          that you have read, understood, and agree to be bound by these Terms.
        </p>

        {/* 2. Description of Service */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          2. Description of Service
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Data Lab provides a comprehensive data platform that includes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Hosted datasets</strong> — curated, maintained, and
            regularly updated collections of structured and unstructured data
          </li>
          <li>
            <strong>APIs for dataset access</strong> — RESTful and GraphQL
            endpoints for programmatic access to datasets with robust query
            capabilities
          </li>
          <li>
            <strong>Research tools</strong> — built-in analytics, visualization
            dashboards, and data exploration features
          </li>
          <li>
            <strong>Collaboration features</strong> — team workspaces, shared
            queries, annotations, and project management tools
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We reserve the right to modify, suspend, or discontinue any part of
          the Service at any time with reasonable notice to our users.
        </p>

        {/* 3. User Accounts & Access */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          3. User Accounts &amp; Access
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          To access most features of the Service, you must create an account.
          When creating and maintaining your account, you agree to the
          following:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Accurate information</strong> — you must provide truthful,
            accurate, and complete registration information, and keep it up to
            date
          </li>
          <li>
            <strong>Account security</strong> — you are solely responsible for
            safeguarding your login credentials and access tokens; treat them as
            confidential and do not share them publicly
          </li>
          <li>
            <strong>Unauthorized access</strong> — you must notify us
            immediately at{' '}
            <a
              href="mailto:legal@datalab.io"
              className="text-primary hover:text-primary underline"
            >
              legal@datalab.io
            </a>{' '}
            if you suspect any unauthorized access to your account
          </li>
          <li>
            <strong>One account per entity</strong> — each individual or
            organization may maintain only one account; duplicate accounts may
            be suspended or terminated
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You are responsible for all activities that occur under your account
          and access credentials, whether or not you have authorized such
          activities.
        </p>

        {/* 4. Acceptable Use */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          4. Acceptable Use
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You agree to use the Service in a responsible and lawful manner. You
          must not:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Exceed rate limits</strong> — make API requests in excess of
            the rate limits defined by your subscription plan
          </li>
          <li>
            <strong>Redistribute datasets without proper license</strong> —
            share, resell, or redistribute any datasets accessed through the
            Service unless expressly permitted by the dataset&apos;s license
          </li>
          <li>
            <strong>Reverse-engineer the platform</strong> — attempt to
            decompile, disassemble, or reverse-engineer any part of the Service,
            including its underlying algorithms or infrastructure
          </li>
          <li>
            <strong>Use for illegal purposes</strong> — use the Service or any
            data obtained through it for any unlawful, fraudulent, or harmful
            activity
          </li>
          <li>
            <strong>Upload malicious content</strong> — introduce viruses,
            malware, or any other harmful code or content to the Service
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Violation of these acceptable use terms may result in immediate
          suspension or termination of your account without prior notice.
        </p>

        {/* 5. Intellectual Property */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          5. Intellectual Property
        </h2>
        <Separator className="mb-6" />

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          Dataset Licenses
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Each dataset available on the Service is governed by its own
          individual license. Before accessing or using any dataset, you must
          review and comply with the applicable license terms displayed on the
          dataset&apos;s detail page.
        </p>

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          Platform Intellectual Property
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The Data Lab platform, including its design, code, features,
          documentation, trademarks, and all related intellectual property, is
          owned by Data Lab Inc. and is protected by applicable copyright,
          trademark, and other intellectual property laws. Nothing in these
          Terms grants you any right to use our branding or proprietary
          materials.
        </p>

        <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
          User-Generated Content
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Any content you create, upload, or share through the Service
          (including queries, annotations, and derived datasets) remains your
          property. By using the Service, you grant us a limited, non-exclusive
          license to host and display your content solely for the purpose of
          providing the Service to you.
        </p>

        {/* 6. API Usage Terms */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          6. API Usage Terms
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Access to our APIs is subject to the following terms:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Rate limits per plan tier</strong> — each subscription plan
            includes defined rate limits (requests per minute and per day);
            these limits are documented in your plan details and API
            documentation
          </li>
          <li>
            <strong>Fair use policy</strong> — API usage should be consistent
            with normal application patterns; automated bulk scraping or
            excessive concurrent connections may be considered abuse
          </li>
          <li>
            <strong>Throttling and suspension</strong> — we reserve the right to
            throttle, rate-limit, or temporarily suspend API access if we detect
            usage patterns that constitute abuse or threaten the stability of
            the Service
          </li>
          <li>
            <strong>Availability target</strong> — we target 99.9% API
            availability (uptime) measured on a monthly basis, excluding
            scheduled maintenance windows
          </li>
        </ul>

        {/* 7. Payment Terms */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          7. Payment Terms
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you subscribe to a paid plan, the following payment terms apply:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Billing cycle</strong> — subscriptions are billed either
            monthly or annually, depending on the plan you select; billing
            occurs at the beginning of each cycle
          </li>
          <li>
            <strong>Price changes</strong> — we may adjust subscription prices
            with at least 30 days&apos; written notice; price changes take
            effect at the start of your next billing cycle
          </li>
          <li>
            <strong>Refunds</strong> — refund requests are handled at our sole
            discretion; please contact our support team within 14 days of a
            charge to request a review
          </li>
          <li>
            <strong>Failed payments</strong> — if a payment fails, we will
            attempt to process it again over the following 7 days; continued
            payment failure may result in suspension of your account and access
            to paid features
          </li>
        </ul>

        {/* 8. Disclaimers */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          8. Disclaimers
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
          AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
          OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We make no warranty or representation regarding the accuracy,
          completeness, reliability, or timeliness of any datasets available
          through the Service. Data is provided for informational purposes and
          should be independently verified before being used for critical
          decisions.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We are not liable for any decisions, actions, or outcomes resulting
          from your use of or reliance on data obtained through the Service.
        </p>

        {/* 9. Limitation of Liability */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          9. Limitation of Liability
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DATA LAB
          INC.&apos;S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE
          TERMS OR THE SERVICE SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO US
          DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE
          CLAIM.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          IN NO EVENT SHALL DATA LAB INC. BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
          NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR
          GOODWILL, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER
          LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES.
        </p>

        {/* 10. Termination */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          10. Termination
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Either party may terminate the use of the Service under the following
          conditions:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Voluntary termination</strong> — either party may terminate
            the agreement with 30 days&apos; written notice; you can cancel your
            account through your account settings or by contacting support
          </li>
          <li>
            <strong>Termination for violations</strong> — we may terminate or
            suspend your account immediately and without prior notice if you
            violate these Terms, engage in fraudulent activity, or pose a risk
            to the Service or other users
          </li>
          <li>
            <strong>Data export window</strong> — upon termination, you will
            have a 30-day window to export your data, including saved queries,
            annotations, and any user-generated content; after this period, your
            data will be permanently deleted
          </li>
        </ul>

        {/* 11. Governing Law */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          11. Governing Law
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the State of California, United States, without regard to its
          conflict of law provisions.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Any disputes arising out of or relating to these Terms or the Service
          shall be resolved exclusively in the state or federal courts located
          in San Francisco, California. You consent to the personal jurisdiction
          of such courts and waive any objection to venue.
        </p>

        {/* 12. Contact */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">
          12. Contact
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions or concerns about these Terms of Service,
          please contact us:
        </p>
        <ul className="list-none space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:legal@datalab.io"
              className="text-primary hover:text-primary underline"
            >
              legal@datalab.io
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
            to="/privacy-policy"
            className="text-primary hover:text-primary underline"
          >
            Privacy Policy
          </Link>
          <p>
            &copy; {new Date().getFullYear()} Data Lab Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
