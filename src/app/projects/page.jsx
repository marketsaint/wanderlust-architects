import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjectsExplorer } from '@/components/sections/ProjectsExplorer';
import { getProjects } from '@/lib/content';

export const metadata = {
  title: 'Projects',
  description: 'Explore architecture, interiors, office fit-outs and documentation-led delivery projects.'
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Container className='space-y-12 py-16 lg:py-24'>
      <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
        <SectionTitle
          eyebrow='Projects'
          title='A portfolio shaped by concept clarity and execution depth.'
          description='Filter by category, search by scope or location, and compare project outcomes.'
        />
      </section>
      <ProjectsExplorer projects={projects} />
    </Container>
  );
}
