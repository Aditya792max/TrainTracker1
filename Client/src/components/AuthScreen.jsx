import { useState } from 'react';
import Brand from './Brand';
import { apiRequest } from '../services/api';

const emptyForm = { name: '', age: '', aadhaarLast4: '', email: '', password: '' };

export default function AuthScreen({ onSignIn }) {
	const [mode, setMode] = useState('login');
	const [form, setForm] = useState(emptyForm);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setMessage('');
		try {
			const endpoint = mode === 'login' ? 'login' : 'register';
			const result = await apiRequest(`/auth/${endpoint}`, {
				method: 'POST',
				body: JSON.stringify(form)
			});
			onSignIn(result);
		} catch (error) {
			setMessage(error.message);
		} finally {
			setBusy(false);
		}
	}

	function switchMode() {
		setMode(mode === 'login' ? 'register' : 'login');
		setMessage('');
	}

	return (
		<main className="auth-page">
			<Brand />
			<div className="auth-card">
				<div className="eyebrow">YOUR JOURNEY, IN FOCUS</div>
				<h1>{mode === 'login' ? 'Welcome back.' : 'Make room for the journey.'}</h1>
				<p className="muted">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Create your personal train tracking account.'}</p>
				<form onSubmit={handleSubmit}>
					{mode === 'register' && <>
						<label>Full name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
						<div className="form-row">
							<label>Age<input required type="number" min="1" max="120" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} placeholder="Age" /></label>
							<label>Aadhaar · last 4<input required inputMode="numeric" maxLength="4" value={form.aadhaarLast4} onChange={(event) => setForm({ ...form, aadhaarLast4: event.target.value.replace(/\D/g, '') })} placeholder="••••" /></label>
						</div>
					</>}
					<label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
					<label>Password<input required type="password" minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label>
					{message && <div className="inline-error">{message}</div>}
					<button className="button primary full" disabled={busy}>{busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>↗</span></button>
				</form>
				<div className="switch-auth">{mode === 'login' ? 'New to Trackline?' : 'Already have an account?'} <button onClick={switchMode}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
				{mode === 'register' && <p className="privacy-note">Only your Aadhaar’s last four digits are stored.</p>}
			</div>
			<footer>Built for the miles ahead <span>© Trackline</span></footer>
		</main>
	);
}
