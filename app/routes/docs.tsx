import { useState } from 'react';
import type { Route } from './+types/docs';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import {
  BookOpen,
  Code2,
  Copy,
  Check,
  Key,
  Zap,
  Download,
  FileCode2,
  ArrowRight,
  Terminal,
  Package,
  HelpCircle,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_: Route.MetaArgs) {
  return generateSEOTags({
    title: 'API Documentation',
    description:
      'Everything you need to integrate Data Lab datasets into your applications.',
  });
}

/* ------------------------------------------------------------------ */
/*  Endpoint data                                                     */
/* ------------------------------------------------------------------ */

interface EndpointParam {
  name: string;
  description: string;
}

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params: EndpointParam[];
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/datasets',
    description: 'List all datasets',
    params: [
      { name: 'page', description: 'Page number for pagination' },
      { name: 'limit', description: 'Number of results per page' },
      { name: 'category', description: 'Filter by category slug' },
      { name: 'search', description: 'Search term to filter datasets' },
    ],
  },
  {
    method: 'GET',
    path: '/datasets/:slug',
    description: 'Get dataset details',
    params: [],
  },
  {
    method: 'GET',
    path: '/datasets/:slug/download',
    description: 'Download dataset',
    params: [
      {
        name: 'format',
        description: 'File format (csv, json, parquet)',
      },
    ],
  },
  {
    method: 'GET',
    path: '/datasets/:slug/preview',
    description: 'Preview first N rows',
    params: [
      { name: 'rows', description: 'Number of rows to return (default 10)' },
    ],
  },
  {
    method: 'GET',
    path: '/search',
    description: 'Search across all datasets',
    params: [
      { name: 'q', description: 'Search query string' },
      { name: 'category', description: 'Filter by category' },
      { name: 'format', description: 'Filter by file format' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Code examples                                                     */
/* ------------------------------------------------------------------ */

const codeExamples: Record<string, string> = {
  Python: `import datalab

# Initialize the client
client = datalab.Client(access_token="YOUR_ACCESS_TOKEN")

# List all datasets
datasets = client.datasets.list(limit=10, category="finance")

for ds in datasets:
    print(f"{ds.name} — {ds.description}")

# Download a dataset as CSV
client.datasets.download(
    slug="global-temperature-records",
    format="csv",
    output="temperature_data.csv"
)

print("Download complete!")`,
  JavaScript: `import { DataLab } from "@datalab/sdk";

// Initialize the client
const client = new DataLab({ accessToken: "YOUR_ACCESS_TOKEN" });

// List all datasets
const datasets = await client.datasets.list({
  limit: 10,
  category: "finance",
});

datasets.forEach((ds) => {
  console.log(\`\${ds.name} — \${ds.description}\`);
});

// Download a dataset as JSON
const data = await client.datasets.download({
  slug: "global-temperature-records",
  format: "json",
});

console.log("Rows received:", data.length);`,
  cURL: `# List all datasets
curl -X GET "https://api.datalab.io/v1/datasets?limit=10&category=finance" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json"

# Download a dataset as CSV
curl -X GET "https://api.datalab.io/v1/datasets/global-temperature-records/download?format=csv" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -o temperature_data.csv

echo "Download complete!"`,
};

/* ------------------------------------------------------------------ */
/*  Rate‑limit tiers                                                  */
/* ------------------------------------------------------------------ */

interface RateTier {
  tier: string;
  requests: string;
  burst: string;
  support: string;
  sla: string;
}

const rateTiers: RateTier[] = [
  {
    tier: 'Free',
    requests: '100 req/min',
    burst: '20 req/sec',
    support: 'Community',
    sla: '—',
  },
  {
    tier: 'Pro',
    requests: '1,000 req/min',
    burst: '100 req/sec',
    support: 'Email (24h)',
    sla: '99.9%',
  },
  {
    tier: 'Enterprise',
    requests: '10,000 req/min',
    burst: '1,000 req/sec',
    support: 'Dedicated',
    sla: '99.99%',
  },
];

/* ------------------------------------------------------------------ */
/*  SDK cards                                                         */
/* ------------------------------------------------------------------ */

interface SDK {
  name: string;
  language: string;
  install: string;
  badge: string;
  icon: React.ReactNode;
}

const sdks: SDK[] = [
  {
    name: 'Python SDK',
    language: 'Python 3.8+',
    install: 'pip install datalab-sdk',
    badge: 'v2.4.1',
    icon: <FileCode2 className="h-6 w-6" />,
  },
  {
    name: 'JavaScript SDK',
    language: 'Node 18+',
    install: 'npm install @datalab/sdk',
    badge: 'v1.8.0',
    icon: <Code2 className="h-6 w-6" />,
  },
  {
    name: 'R Package',
    language: 'R 4.0+',
    install: 'install.packages("datalab")',
    badge: 'Coming Soon',
    icon: <Package className="h-6 w-6" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Small helper — copy‑to‑clipboard button                          */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-primary-foreground transition hover:bg-white/10"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<string>('Python');

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="API Documentation"
        description="Everything you need to integrate Data Lab datasets into your applications."
      />

      {/* ============================================================ */}
      {/*  2. Getting Started                                          */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Getting Started
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Three simple steps to start using the Data Lab API.
          </p>

          {/* Steps */}
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                title: 'Create an account',
                description:
                  'Sign up for a free Data Lab account to get your access token from the dashboard.',
                icon: <Key className="h-6 w-6 text-primary" />,
              },
              {
                step: 2,
                title: 'Install SDK or use REST',
                description:
                  'Install one of our official SDKs for Python, JavaScript, or R — or call the REST API directly.',
                icon: <Download className="h-6 w-6 text-primary" />,
              },
              {
                step: 3,
                title: 'Make your first request',
                description:
                  'Use the code examples below to list datasets or download data in seconds.',
                icon: <Zap className="h-6 w-6 text-primary" />,
              },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {item.icon}
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Base URL */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900">Base URL</h3>
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3">
              <Globe className="hidden h-5 w-5 shrink-0 text-primary sm:block" />
              <code className="flex-1 overflow-x-auto font-mono text-sm text-primary md:text-base">
                https://api.datalab.io/v1
              </code>
              <CopyButton text="https://api.datalab.io/v1" />
            </div>
          </div>

          {/* Authentication */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-900">
              Authentication
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Include your access token as a Bearer token in the{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-800">
                Authorization
              </code>{' '}
              header of every request.
            </p>
            <div className="relative mt-3 rounded-lg bg-slate-900 p-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  HTTP Header
                </span>
                <CopyButton text="Authorization: Bearer YOUR_ACCESS_TOKEN" />
              </div>
              <pre className="overflow-x-auto font-mono text-sm text-primary">
                {`Authorization: Bearer YOUR_ACCESS_TOKEN`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ============================================================ */}
      {/*  3. Endpoints Reference                                      */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Endpoints Reference
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            A complete list of available API endpoints.
          </p>

          <div className="mt-10 space-y-6">
            {endpoints.map((ep) => (
              <Card key={ep.path} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-primary/10 font-mono text-xs font-bold text-primary hover:bg-primary/10">
                      {ep.method}
                    </Badge>
                    <code className="font-mono text-sm font-semibold text-gray-900 md:text-base">
                      {ep.path}
                    </code>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{ep.description}</p>
                </CardHeader>
                {ep.params.length > 0 && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Parameters
                    </p>
                    <ul className="space-y-1.5">
                      {ep.params.map((p) => (
                        <li
                          key={p.name}
                          className="flex flex-wrap items-baseline gap-2 text-sm"
                        >
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                            {p.name}
                          </code>
                          <span className="text-gray-600">{p.description}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ============================================================ */}
      {/*  4. Code Examples                                            */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Code Examples
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Copy-paste examples to get started in your language of choice.
          </p>

          {/* Tabs */}
          <div className="mt-8 flex gap-2 border-b border-gray-200">
            {Object.keys(codeExamples).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition',
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="relative mt-4 rounded-lg bg-slate-900 p-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">
                  {activeTab}
                </span>
              </div>
              <CopyButton text={codeExamples[activeTab]} />
            </div>
            <pre className="overflow-x-auto rounded-lg font-mono text-sm leading-relaxed text-primary">
              {codeExamples[activeTab]}
            </pre>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ============================================================ */}
      {/*  5. SDKs & Libraries                                         */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            SDKs &amp; Libraries
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Official client libraries to accelerate your integration.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sdks.map((sdk) => (
              <Card key={sdk.name} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {sdk.icon}
                    </div>
                    <Badge
                      className={cn(
                        'text-xs',
                        sdk.badge === 'Coming Soon'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                          : 'bg-primary/10 text-primary hover:bg-primary/10'
                      )}
                    >
                      {sdk.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{sdk.name}</CardTitle>
                  <p className="text-sm text-gray-500">{sdk.language}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2">
                    <code className="flex-1 overflow-x-auto font-mono text-xs text-primary">
                      {sdk.install}
                    </code>
                    <CopyButton text={sdk.install} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ============================================================ */}
      {/*  6. Rate Limits                                              */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Rate Limits
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Choose the plan that fits your workload.
          </p>

          <div className="mt-10 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Tier
                  </th>
                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Requests
                  </th>
                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Burst
                  </th>
                  <th className="px-6 py-3 font-semibold text-gray-700">
                    Support
                  </th>
                  <th className="px-6 py-3 font-semibold text-gray-700">SLA</th>
                </tr>
              </thead>
              <tbody>
                {rateTiers.map((tier, idx) => (
                  <tr
                    key={tier.tier}
                    className={cn(
                      'border-b border-gray-100',
                      idx % 2 === 1 && 'bg-gray-50/50'
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Badge
                        className={cn(
                          'text-xs',
                          tier.tier === 'Free' &&
                            'bg-gray-100 text-gray-700 hover:bg-gray-100',
                          tier.tier === 'Pro' &&
                            'bg-primary/10 text-primary hover:bg-primary/10',
                          tier.tier === 'Enterprise' &&
                            'bg-primary/10 text-primary hover:bg-primary/10'
                        )}
                      >
                        {tier.tier}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">
                      {tier.requests}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">
                      {tier.burst}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{tier.support}</td>
                    <td className="px-6 py-4 text-gray-600">{tier.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ============================================================ */}
      {/*  7. Need Help CTA                                            */}
      {/* ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Need Help?</h3>
                <p className="mx-auto mt-2 max-w-md text-gray-600">
                  Our developer support team is here to help you integrate the
                  Data Lab API. Reach out and we will get back to you promptly.
                </p>
              </div>
              <Link to="/contact">
                <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
