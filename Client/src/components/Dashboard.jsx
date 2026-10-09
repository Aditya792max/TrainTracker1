import { useState } from 'react';
import TopBar from './TopBar';
import TrainSearch from './TrainSearch';
import TrainResults from './TrainResults';

export default function Dashboard({ user, token, onSignOut }) {
	const [trainNumber, setTrainNumber] = useState('');
	const [trainData, setTrainData] = useState(null);

	return (
		<div className="app-shell">
			<TopBar user={user} onSignOut={onSignOut} />
			<main className="dashboard">
				<div className="welcome-line">
					<div><div className="eyebrow">{new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase()}</div><h1>Every journey,<br />a little more certain.</h1></div>
					<div className="sun-icon">✳</div>
				</div>
				<TrainSearch token={token} trainNumber={trainNumber} setTrainNumber={setTrainNumber} onResult={setTrainData} />
				<TrainResults trainData={trainData} trainNumber={trainNumber} onSampleTrain={() => setTrainNumber('12919')} />
				<div className="footnote">Train information powered by RailRadar <span>Made for the journey.</span></div>
			</main>
		</div>
	);
}
