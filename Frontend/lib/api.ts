const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	const token =
		typeof window !== 'undefined'
			? localStorage.getItem('access_token') || localStorage.getItem('token')
			: null;

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
		throw new Error(data?.detail || data?.message || 'API error');
	}

	return data;
}

export type UserRole = 'USER' | 'VENDOR' | 'ADMIN';

export type AuthUser = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	is_verified: boolean;
};

export type MeResponse = {
	user: AuthUser;
	vendor_id?: string | null;
};

export type VendorProduct = {
	id: string;
	name: string;
	description?: string | null;
	price?: number | null;
};

export type VendorReview = {
	id: string;
	rating: number;
	title?: string | null;
	comment: string;
	user_id: string;
	user_name?: string | null;
};

export type ApiVendor = {
	id: string;
	name: string;
	slug: string;
	description: string;
	category: string;
	price_range: string;
	address: string;
	latitude: number;
	longitude: number;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	image?: string | null;
	gallery: string[];
	rating: number;
	review_count: number;
	is_verified: boolean;
	is_active: boolean;
	city_id: string;
	products: VendorProduct[];
	reviews: VendorReview[];
};

export type Booking = {
	id: string;
	user_id: string;
	vendor_id: string;
	slot_at: string;
	status: string;
	notes?: string | null;
	created_at: string;
	user_name?: string | null;
	user_email?: string | null;
	vendor_name?: string | null;
};

export type VendorDashboardSummary = {
	total_bookings: number;
	pending_bookings: number;
	confirmed_bookings: number;
	completed_bookings: number;
	cancelled_bookings: number;
};

export type AdminAnalyticsOverview = {
	total_users: number;
	total_vendors: number;
	active_vendors: number;
	verified_vendors: number;
	total_bookings: number;
	completed_bookings: number;
	cancelled_bookings: number;
};

export type CarBrand = { id: string; name: string };
export type CarModel = { id: string; name: string; brand_id: string };
export type City = { id: string; name: string; state: string };

export async function login(email: string, password: string) {
	return apiFetch('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
}

export async function register(payload: { email: string; password: string; name: string; phone?: string }) {
	return apiFetch('/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function getMe(accessToken?: string): Promise<MeResponse> {
	return apiFetch('/auth/me', {
		headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
	});
}

export async function listVendors(): Promise<ApiVendor[]> {
	return apiFetch('/vendors');
}

export async function getVendor(vendorId: string): Promise<ApiVendor> {
	return apiFetch(`/vendors/${vendorId}`);
}

export async function createBooking(payload: { vendor_id: string; slot_at: string; notes?: string }) {
	return apiFetch('/bookings', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function listMyBookings(): Promise<Booking[]> {
	return apiFetch('/bookings/me');
}

export async function listVendorBookings(): Promise<Booking[]> {
	return apiFetch('/vendor/bookings');
}

export async function updateVendorBookingStatus(bookingId: string, status: string): Promise<Booking> {
	return apiFetch(`/vendor/bookings/${bookingId}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	});
}

export async function getVendorSummary(): Promise<VendorDashboardSummary> {
	return apiFetch('/vendor/dashboard/summary');
}

export async function getAdminOverview(): Promise<AdminAnalyticsOverview> {
	return apiFetch('/admin/analytics/overview');
}

export async function createVendorByAdmin(payload: {
	name: string;
	email: string;
	phone?: string;
	password?: string;
	slug: string;
	description: string;
	category: string;
	price_range: string;
	address: string;
	latitude: number;
	longitude: number;
	city_id: string;
	website?: string;
	image?: string;
}) {
	return apiFetch('/admin/vendors', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function listCarBrands(): Promise<CarBrand[]> {
	return apiFetch('/cars/meta/brands');
}

export async function listCarModels(brandId: string): Promise<CarModel[]> {
	return apiFetch(`/cars/meta/models?brand_id=${encodeURIComponent(brandId)}`);
}

export async function listCities(): Promise<City[]> {
	return apiFetch('/cars/meta/cities');
}

export async function createCar(payload: {
	brand_id: string;
	model_id: string;
	variant: string;
	fuel_type: string;
	year: number;
	city_id: string;
}) {
	return apiFetch('/cars', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export async function listMyCars() {
	return apiFetch('/cars/me');
}
