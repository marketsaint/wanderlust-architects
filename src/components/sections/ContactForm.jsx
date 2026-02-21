"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const initial = {
  name: '',
  email: '',
  phone: '',
  location: '',
  service: 'Architecture Design',
  message: ''
};

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Valid email required';
    if (form.phone.trim().length < 8) next.phone = 'Valid phone required';
    if (!form.message.trim()) next.message = 'Please add project details';
    return next;
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setTimeout(() => {
      setSubmitted(true);
      setForm(initial);
    }, 500);
  };

  if (submitted) {
    return (
      <div className='border border-mist bg-white p-8 shadow-soft'>
        <p className='text-xs uppercase tracking-[0.2em] text-iron'>Submitted</p>
        <h3 className='mt-3 text-3xl'>Thanks, we received your brief.</h3>
        <p className='mt-3 text-sm text-iron'>Our team will reach out shortly with a consultation slot.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className='space-y-4 rounded-xl border border-mist bg-white p-8 shadow-soft' noValidate>
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <Input value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder='Name*' aria-label='Name' />
          {errors.name ? <p className='mt-1 text-xs text-red-700'>{errors.name}</p> : null}
        </div>
        <div>
          <Input value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder='Email*' aria-label='Email' />
          {errors.email ? <p className='mt-1 text-xs text-red-700'>{errors.email}</p> : null}
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <Input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder='Phone*' aria-label='Phone' />
          {errors.phone ? <p className='mt-1 text-xs text-red-700'>{errors.phone}</p> : null}
        </div>
        <Input value={form.location} onChange={(e) => onChange('location', e.target.value)} placeholder='Project location' aria-label='Project location' />
      </div>
      <select
        value={form.service}
        onChange={(e) => onChange('service', e.target.value)}
        className='w-full rounded-md border border-silver bg-white px-4 py-3 text-sm'
        aria-label='Service'
      >
        <option>Architecture Design</option>
        <option>Interior Design</option>
        <option>Office Fit-Outs</option>
        <option>Project Delivery</option>
        <option>Landscape Design</option>
        <option>3D Modelling</option>
        <option>Building Documentation</option>
      </select>
      <div>
        <Textarea
          value={form.message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder='Tell us about your project*'
          aria-label='Project message'
          rows={6}
        />
        {errors.message ? <p className='mt-1 text-xs text-red-700'>{errors.message}</p> : null}
      </div>
      <Button type='submit'>Send Inquiry</Button>
    </form>
  );
}
