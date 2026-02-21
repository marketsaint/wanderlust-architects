export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}
