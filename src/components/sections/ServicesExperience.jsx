"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

const serviceDetails = [
  {
    title: 'Architecture Design',
    blurb: 'Signature architecture concepts translated into executable spatial systems.',
    points: ['Concept + Massing', 'Design Development', 'Facade + Material Strategy']
  },
  {
    title: 'Interior Design',
    blurb: 'High-end interior environments tailored to lifestyle and brand intent.',
    points: ['Space Planning', 'Joinery Detailing', 'Lighting + Styling']
  },
  {
    title: 'Office Fit-Outs',
    blurb: 'Performance-led workplace delivery balancing brand experience and productivity.',
    points: ['Workplace Programming', 'Fast-Track Packages', 'Vendor Coordination']
  },
  {
    title: 'Project Delivery',
    blurb: 'Single-point oversight from drawings and BOQs to site execution outcomes.',
    points: ['Site Coordination', 'Milestone Tracking', 'Quality Assurance']
  },
  {
    title: 'Building Documentation',
    blurb: 'Coordinated drawing and specification sets that reduce execution ambiguity.',
    points: ['Construction Drawings', 'Schedules + Specs', 'Issue Revisions']
  },
  {
    title: 'Landscape Design',
    blurb: 'Climate-responsive premium landscape systems with strong experiential flow.',
    points: ['Planting Strategy', 'Hardscape Detailing', 'Outdoor Programming']
  }
];

export function ServicesExperience({ serviceImages }) {
  const [active, setActive] = useState('Architecture Design');

  const selected = useMemo(() => {
    return serviceDetails.find((item) => item.title === active) || serviceDetails[0];
  }, [active]);

  const selectedImage = serviceImages[active];

  return (
    <section className='grid gap-8 border border-mist bg-white p-8 shadow-soft lg:grid-cols-[1.2fr_0.8fr] lg:p-12'>
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.04 }}
              className={`group border p-5 text-left transition-all duration-300 ${
                active === service.title ? 'border-ink bg-ink text-smoke' : 'border-mist hover:border-ink'
              }`}
            >
              <p className='text-[11px] uppercase tracking-[0.2em]'>0{index + 1}</p>
              <h3 className='mt-3 text-xl'>{service.title}</h3>
              <p className={`mt-2 text-sm ${active === service.title ? 'text-silver' : 'text-iron'}`}>{service.blurb}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start'>
        <div className='hidden lg:grid lg:gap-2'>
          {serviceDetails.map((service) => (
            <button
              key={service.title}
              type='button'
              onClick={() => setActive(service.title)}
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
              className='relative h-[360px] overflow-hidden border border-mist'
            >
              <Image src={selectedImage} alt={selected.title} fill sizes='(max-width: 1024px) 100vw, 40vw' className='object-cover grayscale' />
            </motion.div>
          </AnimatePresence>
          <div className='border border-mist p-5'>
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
