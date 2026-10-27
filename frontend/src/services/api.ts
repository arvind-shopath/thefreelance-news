// API Service to communicate with the Backend API Contracts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function fetchArticles(page = 1, limit = 10, category = '') {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (category) params.append('category', category);

  const res = await fetch(`${API_BASE_URL}/articles?${params.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function fetchArticleDetail(slug: string) {
  const res = await fetch(`${API_BASE_URL}/articles/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch article details');
  return res.json();
}

export async function fetchStories() {
  const res = await fetch(`${API_BASE_URL}/stories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function trackAnalyticsEvent(type: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id }),
  });
  return res.json();
}
