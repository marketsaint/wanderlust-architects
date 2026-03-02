import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { getHeroImage } from '@/lib/imageMap';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wanderlust Architects | Luxury Architecture Studio',
    template: '%s | Wanderlust Architects'
  },
  description:
    'A luxury architecture and interior design studio crafting high-end residential, hospitality, and landscape environments.',
  openGraph: {
    title: 'Wanderlust Architects',
    description: 'Luxury architecture, interiors, landscape, and documentation studio.',
    url: 'https://wanderlustarchitects.com',
    siteName: 'Wanderlust Architects',
    images: [
      {
        url: getHeroImage(),
        width: 1200,
        height: 630,
        alt: 'Wanderlust Architects project preview'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderlust Architects',
    description: 'Luxury architecture and interior design studio.'
  },
  alternates: {
    languages: {
      'en-IN': `${siteUrl}/india`,
      'en-AE': `${siteUrl}/dubai`,
      'x-default': `${siteUrl}/`
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='alternate' href={`${siteUrl}/india`} hrefLang='en-IN' />
        <link rel='alternate' href={`${siteUrl}/dubai`} hrefLang='en-AE' />
        <link rel='alternate' href={`${siteUrl}/`} hrefLang='x-default' />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
        <SmoothScroll />
        <a href='#main-content' className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2'>
          Skip to content
        </a>
        <div id='site-header'>
          <Header />
        </div>
        <main id='main-content'>{children}</main>
        <div id='site-footer'>
          <Footer />
        </div>
      </body>
    </html>
  );
}
