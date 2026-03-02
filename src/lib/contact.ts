import type { SiteRegion } from '@/lib/region';

type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
};

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

function toWhatsAppLink(raw: string): string {
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://wa.me/${raw.replace(/[^\d]/g, '')}`;
}

export function getContactByRegion(region: SiteRegion): ContactInfo {
  const email = process.env.NEXT_PUBLIC_EMAIL || 'studio@wanderlustarchitects.com';

  const defaultIndiaPhone = '+919999999999';
  const defaultAEPhone = '+971500000000';

  const phoneIN = process.env.NEXT_PUBLIC_PHONE_IN || defaultIndiaPhone;
  const phoneAE = process.env.NEXT_PUBLIC_PHONE_AE || defaultAEPhone;

  const whatsappIN = process.env.NEXT_PUBLIC_WHATSAPP_IN || toWhatsAppLink(phoneIN);
  const whatsappAE = process.env.NEXT_PUBLIC_WHATSAPP_AE || toWhatsAppLink(phoneAE);

  if (region === 'AE') {
    return {
      phone: normalizePhone(phoneAE),
      whatsapp: toWhatsAppLink(whatsappAE),
      email
    };
  }

  return {
    phone: normalizePhone(phoneIN),
    whatsapp: toWhatsAppLink(whatsappIN),
    email
  };
}

