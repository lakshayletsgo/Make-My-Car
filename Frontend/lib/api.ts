const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	const res = await fetch(`${BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		},
	});

	const text = await res.text();
	const data = text ? JSON.parse(text) : null;

	if (!res.ok) {
		throw new Error(data?.message || 'API error');
	}

	return data;
}
