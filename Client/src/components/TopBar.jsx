import Brand from './Brand';

export default function TopBar({ user, onSignOut }) {
	return (
		<header className="topbar">
			<Brand />
			<div className="profile">
				<div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
				<span>{user.name.split(' ')[0]}</span>
				<button className="text-button" onClick={onSignOut}>Sign out</button>
			</div>
		</header>
	);
}
