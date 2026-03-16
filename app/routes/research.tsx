import { Link } from 'react-router';
import {
  Microscope,
  Users,
  ArrowRight,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import type { Route } from './+types/research';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import {
  researchProjects,
  researchReports,
  type ResearchProject,
  type ResearchReport,
} from '~/data/research';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Research',
    description: 'Advancing data science through open research at Data Lab.',
  });
}

function ProjectCard({ project }: { project: ResearchProject }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge
            className={cn(
              'shrink-0',
              project.status === 'active'
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-slate-500 hover:bg-slate-600 text-white'
            )}
          >
            {project.status === 'active' ? 'Active' : 'Completed'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <Users className="h-4 w-4 shrink-0" />
          <span>{project.team.join(', ')}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <CardDescription className="text-sm leading-relaxed line-clamp-4">
          {project.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ReportCard({ report }: { report: ResearchReport }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{report.title}</CardTitle>
        <CardDescription className="text-sm">
          {report.authors.join(', ')} &middot;{' '}
          {new Date(report.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {report.abstract}
        </p>
        <div className="mt-auto pt-2">
          <Link
            to={`/research/reports/${report.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary transition-colors"
          >
            Read Report <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Research() {
  const activeProjects = researchProjects.filter((p) => p.status === 'active');
  const completedProjects = researchProjects.filter(
    (p) => p.status === 'completed'
  );
  const latestReports = researchReports.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Microscope className="h-8 w-8" />
            </div>
            <FlaskConical className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Data Lab Research
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground sm:text-xl">
            Advancing data science through open research. We investigate
            foundational questions in machine learning, causal inference, and
            data systems.
          </p>
        </div>
      </section>

      {/* Active Projects */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Active Projects
            </h2>
            <p className="text-sm text-muted-foreground">
              Currently ongoing research initiatives
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {activeProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator />
      </div>

      {/* Completed Projects */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Completed Projects
            </h2>
            <p className="text-sm text-muted-foreground">
              Successfully concluded research
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {completedProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator />
      </div>

      {/* Recent Publications */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Recent Publications
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest research reports from our team
              </p>
            </div>
          </div>
          <Link
            to="/research/reports"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary transition-colors"
          >
            View all reports <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestReports.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link
            to="/research/reports"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary transition-colors"
          >
            View all reports <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Collaborate CTA */}
      <section className="bg-primary/5 border-y border-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Interested in Research Collaboration?
            </h2>
            <p className="mt-4 text-base text-primary/80 leading-relaxed">
              We actively seek partnerships with academic institutions, industry
              labs, and independent researchers. Whether you want to contribute
              to an existing project or propose a new direction, we would love
              to hear from you.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
