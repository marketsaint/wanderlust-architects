'use client';

import Link from 'next/link';

type Contact = {
  phone: string;
  whatsapp: string;
  email: string;
};

type FinalCTAProps = {
  contact: Contact;
};

export function FinalCTA({ contact }: FinalCTAProps) {
  return (
    <section className='flex h-full items-center justify-center bg-black p-8 sm:p-12'>
      <div className='w-full max-w-3xl rounded-xl border border-white/20 bg-white/[0.03] p-8 text-center sm:p-12'>
        <p className='text-xs uppercase tracking-[0.24em] text-zinc-400'>Scene 04</p>
        <h2 className='mt-3 text-4xl leading-tight sm:text-6xl'>Build with clarity from first line to final handover.</h2>
        <p className='mt-4 text-sm text-zinc-300 sm:text-base'>
          Start a region-aware conversation with our team and receive a focused next-step response.
        </p>

        <div className='mt-7 flex flex-wrap justify-center gap-3'>
          <a href={contact.whatsapp} className='rounded-md border border-white bg-white px-6 py-3 text-xs uppercase tracking-[0.2em] text-black hover:bg-zinc-200'>
            WhatsApp
          </a>
          <a href={`tel:${contact.phone}`} className='rounded-md border border-white/70 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black'>
            Call
          </a>
          <a href={`mailto:${contact.email}`} className='rounded-md border border-white/70 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black'>
            Email
          </a>
          <Link href='/contact' className='rounded-md border border-white/70 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black'>
            Contact Page
          </Link>
        </div>
      </div>
    </section>
  );
}

