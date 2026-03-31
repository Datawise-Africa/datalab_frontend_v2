import type { Route } from './+types/team';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { teamMembers, type TeamMember } from '~/data/team';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import {
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  Users,
  Briefcase,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Our Team',
    description:
      'Meet the talented people behind Data Lab — researchers, engineers, and leaders working to democratize data access.',
  });
}

const departments = [
  'Leadership',
  'Research',
  'Engineering',
  'Advisory',
] as const;

const departmentDescriptions: Record<string, string> = {
  Leadership:
    "The visionaries guiding Data Lab's strategy, culture, and long-term direction.",
  Research:
    'World-class scientists pushing the boundaries of data science, NLP, computer vision, and climate analytics.',
  Engineering:
    'The builders behind our platform — designing scalable infrastructure and delightful developer experiences.',
  Advisory:
    'Trusted experts who help us navigate ethics, policy, and emerging industry trends.',
};

function getMembersByDepartment(department: string): TeamMember[] {
  return teamMembers.filter((member) => member.department === department);
}

function getGridCols(department: string): string {
  if (department === 'Leadership' || department === 'Advisory') {
    return 'grid-cols-1 md:grid-cols-2';
  }
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <img
          src={member.avatar}
          alt={member.name}
          className="h-16 w-16 shrink-0 rounded-full bg-primary/10 ring-2 ring-primary/20 dark:bg-primary dark:ring-primary"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg font-semibold leading-tight">
            {member.name}
          </CardTitle>
          <p className="mt-1 text-sm text-primary dark:text-primary font-medium">
            {member.role}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {member.bio}
        </p>
        <div className="mt-4 flex items-center gap-2">
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Twitter`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on GitHub`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Meet the Team"
        description="Researchers, engineers, and leaders united by a shared passion for making data universally accessible."
      />

      {/* Department Sections */}
      {departments.map((department, index) => {
        const members = getMembersByDepartment(department);
        if (members.length === 0) return null;

        return (
          <section key={department}>
            {index > 0 && <Separator className="mx-auto max-w-7xl" />}
            <div className="py-16 md:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30"
                  >
                    <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                    {department}
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {department}
                  </h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    {departmentDescriptions[department]}
                  </p>
                </div>

                <div className={cn('grid gap-6', getGridCols(department))}>
                  {members.map((member) => (
                    <TeamMemberCard key={member.name} member={member} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Join Us CTA */}
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            We're always looking for talented people
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join a team that's shaping the future of data access. We value
            curiosity, craftsmanship, and a drive to make a meaningful impact.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-primary/5"
            >
              <Link to="/contact">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
