type ExperienceStructuredDataProps = {
  baseUrl: string;
};

export function ExperienceStructuredData({ baseUrl }: ExperienceStructuredDataProps) {
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Wanderlust Architects Signature Identity Experience',
    url: `${baseUrl}/experience`,
    about: ['Luxury architecture', 'Interior design', 'Project delivery'],
    creator: {
      '@type': 'Organization',
      name: 'Wanderlust Architects'
    }
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wanderlust Architects',
    url: baseUrl,
    email: process.env.NEXT_PUBLIC_EMAIL || 'studio@wanderlustarchitects.com',
    areaServed: ['Jaipur, Rajasthan', 'Dubai, UAE']
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  );
}

