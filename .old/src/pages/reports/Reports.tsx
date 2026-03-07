import Section from '@/components/HomePage/Section';
import Seo from '@/components/seo/Seo';

const Reports = () => {
  return (
    <>
      <Seo
        title="Data reports and briefs"
        description="Download ready-to-use insight reports built from verified Datalab datasets. New deep dives are published frequently."
        url="/reports"
        type="article"
      />
      <Section className="flex h-96 items-center justify-center">
        <p>Reports Coming Soon</p>
      </Section>
    </>
  );
};

export default Reports;
