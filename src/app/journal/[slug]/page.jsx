import { redirect } from 'next/navigation';

export default function JournalDetailRedirect({ params }) {
  redirect(`/blog/${params.slug}`);
}
