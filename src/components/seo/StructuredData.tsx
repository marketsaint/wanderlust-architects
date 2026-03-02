type StructuredDataProps = {
  baseUrl: string;
};

export function StructuredData({ baseUrl }: StructuredDataProps) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wanderlust Architects',
    url: baseUrl,
    email: process.env.NEXT_PUBLIC_EMAIL || 'studio@wanderlustarchitects.com',
    areaServed: ['Jaipur, Rajasthan', 'Dubai, UAE'],
    sameAs: [baseUrl]
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wanderlust Architects',
    url: baseUrl,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/projects?query={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}

