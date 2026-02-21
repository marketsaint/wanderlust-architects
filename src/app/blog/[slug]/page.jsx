import { redirect } from 'next/navigation';

export default function BlogDetailRedirect({ params }) {
  redirect(`/journal/${params.slug}`);
}
