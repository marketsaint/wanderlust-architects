"use client";

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function TestimonialSlider() {
  const testimonials = useMemo(
    () => [
      {
        quote:
          'Wanderlust translated our vision into a timeless built form. Every detail, from planning to finish, felt intentional and premium.',
        clientType: 'Private Residence Client',
        city: 'Jaipur',
        scope: 'Architecture + Interior Delivery'
      },
      {
        quote:
          'Their architectural clarity and documentation rigor made execution seamless. The final outcome exceeded our expectations.',
        clientType: 'Hospitality Developer',
        city: 'Ranthambore',
        scope: 'Architecture + Documentation'
      },
      {
        quote:
          'The team balanced elegance with operational intelligence. A rare design studio that understands both emotion and precision.',
        clientType: 'Corporate Workplace Client',
        city: 'Dubai',
        scope: 'Office Fit-Out + Project Delivery'
      }
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const next = () => setIndex((v) => (v + 1) % testimonials.length);
  const prev = () => setIndex((v) => (v - 1 + testimonials.length) % testimonials.length);

  return (
    <div className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
      <AnimatePresence mode='wait'>
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className='space-y-6'
        >
          <blockquote className='max-w-4xl text-2xl leading-relaxed sm:text-3xl'>&ldquo;{testimonials[index].quote}&rdquo;</blockquote>
          <figcaption className='flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-iron'>
            <span>{testimonials[index].clientType}</span>
            <span aria-hidden='true'>•</span>
            <span>{testimonials[index].city}</span>
            <span aria-hidden='true'>•</span>
            <span>{testimonials[index].scope}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
      <div className='mt-8 flex gap-3'>
        <Button variant='subtle' onClick={prev} aria-label='Previous testimonial'>
          Prev
        </Button>
        <Button variant='subtle' onClick={next} aria-label='Next testimonial'>
          Next
        </Button>
      </div>
    </div>
  );
}

