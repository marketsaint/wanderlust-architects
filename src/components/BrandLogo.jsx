import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap'
});

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  iconSrc = '/branding/wanderlust_architects_logo-icon-Black.png',
  priority = false
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src={iconSrc}
        alt=''
        aria-hidden='true'
        width={473}
        height={327}
        priority={priority}
        className={cn('h-12 w-auto object-contain', iconClassName)}
      />
      <span className={cn(montserrat.className, 'whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-black', textClassName)}>
        WANDERLUST ARCHITECTS
      </span>
    </span>
  );
}
