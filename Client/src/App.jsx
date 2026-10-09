import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
	const { user, token, loading, signIn, signOut } = useAuth();

	if (loading) {
		return <main className="auth-page"><div className="auth-card"><div className="eyebrow">YOUR JOURNEY, IN FOCUS</div><h1>One moment…</h1><p className="muted">Checking your session.</p></div></main>;
	}

	return user
		? <Dashboard user={user} token={token} onSignOut={signOut} />
		: <AuthScreen onSignIn={signIn} />;
}

export default App;
