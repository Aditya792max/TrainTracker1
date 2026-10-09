export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
	let response;
	try {
		response = await fetch(`${API_URL}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
				...(options.headers || {})
			}
		});
	} catch {
		throw new Error(`Cannot reach the API at ${API_URL}. Start the backend and check VITE_API_URL.`);
	}

	let payload;
	try {
		payload = response.status === 204 ? {} : await response.json();
	} catch {
		throw new Error('The server returned an unreadable response. Check that the backend is running.');
	}
	if (!response.ok) throw new Error(payload.message || payload.error?.message || 'Request failed.');
	return payload;
}

export async function getTrainDetails(trainNumber, query, token) {
	return apiRequest(`/trains/${encodeURIComponent(trainNumber)}?${query}`, { token });
}
