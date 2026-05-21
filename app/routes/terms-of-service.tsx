import type { Route } from './+types/terms-of-service';
import { Link } from 'react-router';
import { Separator } from '~/components/ui/separator';

export const meta: Route.MetaFunction = () => [
  { title: 'Terms of Service — Datalab Africa' },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Effective Date: 1 May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-muted-foreground leading-relaxed mb-4">
          Welcome to our platform. These Terms of Service (the
          &quot;Terms&quot;) govern your access to and use of our website,
          applications, and related services (together, the
          &quot;Services&quot;).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our platform enables users to create, host, access, and share
          datasets, generate insights, and publish research and data products.
          By creating an account or using the Services, you agree to these
          Terms.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may update these Terms from time to time. When we do, we will
          revise the &quot;Effective Date&quot; above. Continued use of the
          Services means you accept the updated Terms.
        </p>

        {/* Eligibility & Accounts */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Eligibility and Accounts
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You must be able to form a binding contract to use the Services. If
          you are using the Services on behalf of an organization, you confirm
          that you have authority to bind that organization to these Terms.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You are responsible for the accuracy of the information you provide,
          for keeping your login credentials secure, and for all activity that
          happens under your account. Let us know promptly if you suspect
          unauthorized access.
        </p>

        {/* User Content */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Your Content
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You retain ownership of the datasets, documentation, dashboards,
          research, and other content you create or upload to the platform
          (&quot;Your Content&quot;).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          By using the Services, you grant us a non-exclusive, worldwide,
          royalty-free licence to host, store, process, transmit, and display
          Your Content solely for the purpose of operating, improving, and
          providing the Services to you and the audiences you choose.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You are responsible for ensuring that you have the rights and
          permissions needed to upload and share Your Content, and that it does
          not infringe anyone&apos;s rights or violate any law.
        </p>

        {/* Acceptable Use */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Acceptable Use
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You agree not to use the Services to:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground leading-relaxed">
          <li>break the law or infringe anyone&apos;s rights</li>
          <li>
            upload or share content you do not have the right to distribute
          </li>
          <li>
            upload datasets containing personal data without a lawful basis
          </li>
          <li>
            attempt to disrupt, reverse-engineer, or gain unauthorized access to
            the platform
          </li>
          <li>
            scrape, crawl, or harvest data beyond what is permitted by the
            Services
          </li>
          <li>
            misrepresent the origin, ownership, or licensing of any content
          </li>
          <li>
            abuse, harass, or defraud other users, or undermine platform
            integrity
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may restrict, suspend, or terminate access to the Services for
          violations of these Terms.
        </p>

        {/* Datasets, Licences & Purchases */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Datasets, Licences, and Purchases
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Datasets and other products on the platform may be free or paid, and
          each is offered under its own licence. Your use of any dataset or
          product is subject to that licence in addition to these Terms.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you publish a dataset or product, you are responsible for
          choosing an appropriate licence and for accurately describing what
          buyers or users receive.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Paid transactions are processed by third-party payment providers.
          Prices are shown at the point of purchase. Unless required by law or
          stated otherwise on the product page, purchases are non-refundable
          once delivered.
        </p>

        {/* Workspaces & Collaboration */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Workspaces and Collaboration
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You can collaborate through workspaces. Workspace owners and admins
          can manage members, invite collaborators, and control what is
          published from the workspace. Workspace members are responsible for
          the content they contribute and for following any internal policies
          their workspace sets.
        </p>

        {/* Intellectual Property */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Our Intellectual Property
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The platform itself — including its software, design, branding, and
          documentation — is owned by us and our licensors. We grant you a
          limited, revocable, non-exclusive licence to use the Services
          consistent with these Terms.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You may not copy, modify, or redistribute the platform&apos;s code or
          assets except as expressly permitted.
        </p>

        {/* Feedback */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Feedback
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you send us feedback, suggestions, or bug reports, you give us
          permission to use them without obligation to you. We&apos;ll always
          appreciate it.
        </p>

        {/* Privacy */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Privacy
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our handling of personal information is described in our{' '}
          <Link
            to="/privacy-policy"
            className="text-primary hover:text-primary underline"
          >
            Privacy Policy
          </Link>
          . By using the Services, you also agree to that Policy.
        </p>

        {/* Third-Party Services */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Third-Party Services
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The Services may rely on or link to third-party tools (for example,
          payments, analytics, hosting, or authentication). Those tools are
          governed by their own terms, and we are not responsible for them.
        </p>

        {/* Availability & Changes */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Availability and Changes to the Services
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We work to keep the Services reliable but do not guarantee
          uninterrupted availability. We may add, change, or remove features at
          any time, and we may perform maintenance that temporarily limits
          access.
        </p>

        {/* Suspension & Termination */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Suspension and Termination
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You can stop using the Services at any time and request deletion of
          your account.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may suspend or terminate access if you breach these Terms, if your
          activity puts the platform or other users at risk, or if we are
          required to by law. Where reasonable, we will give you notice and a
          chance to fix the issue.
        </p>

        {/* Disclaimer */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Disclaimers
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The Services and any datasets, insights, or research made available
          through the platform are provided &quot;as is&quot; and &quot;as
          available&quot;. We do not guarantee that content is accurate,
          complete, or fit for any particular purpose.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          You are responsible for evaluating whether the Services and any
          content are suitable for your intended use.
        </p>

        {/* Limitation of Liability */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Limitation of Liability
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          To the maximum extent permitted by law, we are not liable for
          indirect, incidental, special, consequential, or punitive damages,
          including lost profits, lost data, or lost goodwill, arising out of
          your use of the Services.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Nothing in these Terms limits liability that cannot be limited by law.
        </p>

        {/* Indemnity */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Your Responsibility for Claims
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          You agree to defend, indemnify, and hold us harmless from claims
          arising out of Your Content, your use of the Services, or your
          violation of these Terms.
        </p>

        {/* Governing Law */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Governing Law
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          These Terms are governed by the laws of the Republic of Kenya, without
          regard to its conflict-of-law rules. Disputes will be resolved by the
          courts located in Nairobi, Kenya, unless another venue is required by
          law.
        </p>

        {/* Changes */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Changes to These Terms
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We may update these Terms from time to time. When we do, we will
          revise the &quot;Effective Date&quot; above and, where appropriate,
          notify you. Continued use of the Services after changes take effect
          means you accept the updated Terms.
        </p>

        {/* Contact */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-foreground">
          Contact
        </h2>
        <Separator className="mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions about these Terms, please contact us:
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
            to="/privacy-policy"
            className="text-primary hover:text-primary underline"
          >
            Privacy Policy
          </Link>
          <p>
            &copy; {new Date().getFullYear()} Datalab Africa. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
