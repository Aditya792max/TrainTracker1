import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const TOKEN_KEY = 'trackline-token';

export function useAuth() {
	const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

	useEffect(() => {
		if (!token) {
			setLoading(false);
			return;
		}
		let active = true;
		apiRequest('/auth/me', { token })
			.then((result) => { if (active) setUser(result.user); })
			.catch(() => { if (active) signOut(); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [token]);

	function signIn(payload) {
		localStorage.setItem(TOKEN_KEY, payload.token);
		setToken(payload.token);
		setUser(payload.user);
		setLoading(false);
	}

	function signOut() {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setUser(null);
		setLoading(false);
	}

	return { user, token, loading, signIn, signOut };
}
