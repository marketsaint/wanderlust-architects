"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { ProjectCard } from '@/components/sections/ProjectCard';

const categories = ['All', 'Architecture', 'Building Documentation', 'Interior', 'Landscape'];

export function ProjectsExplorer({ projects }) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');

  const visibleProjects = useMemo(() => {
    const resolveSortValue = (project) => {
      const yearValue = Number(project.year);
      if (Number.isFinite(yearValue) && yearValue > 0) return yearValue;
      return Number(project.sortOrder || 0);
    };

    const filtered = projects.filter((project) => {
      const categoryMatch = category === 'All' || project.category === category;
      const q = search.trim().toLowerCase();
      const searchMatch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'Oldest') return resolveSortValue(a) - resolveSortValue(b);
      return resolveSortValue(b) - resolveSortValue(a);
    });

    return sorted;
  }, [category, projects, search, sort]);

  return (
    <div className='space-y-8'>
      <div className='space-y-4 border border-mist bg-white p-6 shadow-soft'>
        <Tabs items={categories} active={category} onChange={setCategory} />
        <div className='flex flex-col gap-3 lg:flex-row'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by project, location, category'
            aria-label='Search projects'
            className='w-full'
          />
          <select
            className='border border-silver bg-white px-4 py-3 text-xs uppercase tracking-[0.15em]'
            aria-label='Sort projects'
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>
      <motion.div layout className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {visibleProjects.map((project) => (
          <motion.div key={project.slug} layout initial={{ opacity: 0.7 }} animate={{ opacity: 1 }}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
      {!visibleProjects.length ? <p className='border border-mist bg-white p-5 text-sm text-iron'>No projects found for this query.</p> : null}
    </div>
  );
}
