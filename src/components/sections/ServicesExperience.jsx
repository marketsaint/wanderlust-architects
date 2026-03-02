"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { applyPointerGlow, resetPointerGlow } from '@/lib/pointerGlow';

const serviceDetails = [
  {
    title: 'Architecture Design',
    blurb: 'Concept, planning, and facade decisions translated into approval-ready and execution-ready packages.',
    points: ['Site Response + Massing', 'Design Development Drawings', 'Material + Facade Specifications'],
    category: 'architecture'
  },
  {
    title: 'Interior Design',
    blurb: 'Spatial planning and detailing calibrated for premium living, hospitality, and workplace outcomes.',
    points: ['Layout + Circulation Planning', 'Joinery + Finish Detailing', 'Lighting + Styling Packages'],
    category: 'interior'
  },
  {
    title: 'Office Fit-Outs',
    blurb: 'Fast-track workplace delivery with technical coordination and phased execution planning.',
    points: ['Workplace Programming', 'Fit-Out Construction Sets', 'Vendor + Site Coordination'],
    category: 'interior'
  },
  {
    title: 'Project Delivery',
    blurb: 'Single-point ownership from consultant coordination to milestone closure and quality checks.',
    points: ['BOQ + Tender Coordination', 'Milestone Tracking', 'Execution QA Reviews'],
    category: 'architecture'
  },
  {
    title: 'Building Documentation',
    blurb: 'Comprehensive drawing sets built to reduce ambiguity and improve on-site decision speed.',
    points: ['Construction Drawings', 'Schedules + Specifications', 'Revision + Issue Control'],
    category: 'building-documentation'
  },
  {
    title: 'Landscape Design',
    blurb: 'Climate-aware landscape systems that align aesthetic experience with long-term maintainability.',
    points: ['Planting + Zoning Strategy', 'Hardscape Technical Detailing', 'Outdoor Use Programming'],
    category: 'landscape'
  }
];

export function ServicesExperience({ serviceImages }) {
  const [active, setActive] = useState('Architecture Design');

  const selected = useMemo(() => {
    return serviceDetails.find((item) => item.title === active) || serviceDetails[0];
  }, [active]);

  const selectedImage = serviceImages[active];
  const workHref = `/projects?category=${selected.category}`;

  return (
    <section className='architect-shell grid gap-8 rounded-2xl border border-mist p-8 shadow-soft lg:grid-cols-[1.2fr_0.8fr] lg:p-12'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <p className='text-xs uppercase tracking-[0.22em] text-iron'>Services</p>
          <Button href='/contact' variant='subtle'>Start Project</Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          {serviceDetails.map((service, index) => (
            <motion.button
              key={service.title}
              type='button'
              onClick={() => setActive(service.title)}
              onMouseMove={applyPointerGlow}
              onMouseLeave={resetPointerGlow}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.04 }}
              className={`architect-card group p-5 text-left transition-all duration-300 ${
                active === service.title ? 'border-ink bg-ink text-smoke' : 'border-mist hover:border-ink'
              }`}
            >
              <p className='text-[11px] uppercase tracking-[0.2em]'>0{index + 1}</p>
              <h3 className='mt-3 text-xl'>{service.title}</h3>
              <p className={`mt-2 text-sm ${active === service.title ? 'text-silver' : 'text-iron'}`}>{service.blurb}</p>
            </motion.button>
          ))}
        </div>
        <div>
          <Button href={workHref} variant='ghost'>View Our Work</Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start'>
        <div className='hidden lg:grid lg:gap-2'>
          {serviceDetails.map((service) => (
            <button
              key={service.title}
              type='button'
              onClick={() => setActive(service.title)}
              onMouseMove={applyPointerGlow}
              onMouseLeave={resetPointerGlow}
              className={`w-56 border px-4 py-3 text-left text-xs uppercase tracking-[0.18em] transition-colors ${
                service.title === active ? 'border-ink bg-ink text-smoke' : 'border-mist text-iron hover:border-ink hover:text-ink'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className='space-y-4'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              onMouseMove={applyPointerGlow}
              onMouseLeave={resetPointerGlow}
              className='architect-card relative h-[360px] overflow-hidden'
            >
              <Image src={selectedImage} alt={selected.title} fill sizes='(max-width: 1024px) 100vw, 40vw' className='object-cover grayscale' />
            </motion.div>
          </AnimatePresence>
          <div onMouseMove={applyPointerGlow} onMouseLeave={resetPointerGlow} className='architect-card p-5'>
            <h4 className='text-2xl'>{selected.title}</h4>
            <ul className='mt-3 space-y-2 text-sm text-iron'>
              {selected.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
