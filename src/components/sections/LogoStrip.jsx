import Image from 'next/image';

export function LogoStrip({ logos = [] }) {
  return (
    <section className='space-y-4'>
      <p className='text-xs uppercase tracking-[0.22em] text-iron'>Trusted by</p>
      <div className='grid grid-cols-2 gap-4 border border-mist bg-white p-6 shadow-soft sm:grid-cols-3 lg:grid-cols-5'>
        {logos.map((logo) => (
          <div key={logo} className='relative h-14'>
            <Image
              src={logo}
              alt='Client logo'
              fill
              sizes='160px'
              className='object-contain grayscale opacity-45 transition duration-300 hover:opacity-100'
            />
          </div>
        ))}
      </div>
    </section>
  );
}
