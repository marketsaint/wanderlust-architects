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
        name: 'Ananya K.',
        role: 'Residential Client'
      },
      {
        quote:
          'Their architectural clarity and documentation rigor made execution seamless. The final outcome exceeded our expectations.',
        name: 'R. Mehta',
        role: 'Hospitality Developer'
      },
      {
        quote:
          'The team balanced elegance with operational intelligence. A rare design studio that understands both emotion and precision.',
        name: 'A. Sharma',
        role: 'Corporate Client'
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
          <figcaption>
            <p className='text-sm uppercase tracking-[0.2em]'>{testimonials[index].name}</p>
            <p className='text-sm text-iron'>{testimonials[index].role}</p>
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

