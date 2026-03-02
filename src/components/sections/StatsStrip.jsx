import { metrics } from '@/content/global/metrics';

export function StatsStrip() {
  const stats = [
    {
      label: 'Projects Completed',
      value: metrics.projectsCompleted,
      fallback: 'Project counts are validated and published per reporting cycle.'
    },
    {
      label: 'Drawings Delivered',
      value: metrics.drawingsDelivered,
      fallback: 'Drawing package volumes are shared after internal QA validation.'
    },
    {
      label: 'Design Awards',
      value: metrics.awards,
      fallback: 'Recognition updates are published once formally announced.'
    },
    {
      label: 'Active Projects',
      value: metrics.activeProjects,
      fallback: 'Active project load is communicated with current scheduling windows.'
    }
  ];

  return (
    <div className='grid gap-6 border border-mist bg-white p-8 shadow-soft sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <div key={stat.label} className='border-b border-mist pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 last:border-none'>
          {typeof stat.value === 'number' ? <p className='text-4xl'>{stat.value}+</p> : <p className='text-sm text-iron'>{stat.fallback}</p>}
          <p className='mt-2 text-xs uppercase tracking-[0.2em] text-iron'>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
