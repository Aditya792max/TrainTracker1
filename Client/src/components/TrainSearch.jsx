import { useState } from 'react';
import { getTrainDetails } from '../services/api';

export default function TrainSearch({ token, trainNumber, setTrainNumber, onResult }) {
	const [dataType, setDataType] = useState('full');
	const [journeyDate, setJourneyDate] = useState(new Date().toISOString().slice(0, 10));
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState('');

	async function findTrain(event) {
		event.preventDefault();
		setBusy(true);
		setMessage('');
		try {
			const query = new URLSearchParams({ dataType, journeyDate, dataProvider: 'railradar' });
			const payload = await getTrainDetails(trainNumber, query, token);
			onResult(payload.data || payload, trainNumber);
		} catch (error) {
			onResult(null);
			setMessage(error.message === 'Failed to fetch' ? 'Cannot reach the server. Check that the backend is running.' : error.message);
		} finally {
			setBusy(false);
		}
	}

	return (
		<section className="search-panel">
			<div className="panel-heading"><div><div className="eyebrow">LIVE TRAIN INTELLIGENCE</div><h2>Where are you headed?</h2></div><span className="live-tag"><i></i> LIVE DATA</span></div>
			<form className="search-form" onSubmit={findTrain}>
				<label className="train-input"><span>TRAIN NUMBER</span><input required inputMode="numeric" maxLength="5" value={trainNumber} onChange={(event) => setTrainNumber(event.target.value.replace(/\D/g, ''))} placeholder="e.g. 12919" /></label>
				<label className="select-input"><span>JOURNEY DATE</span><input type="date" value={journeyDate} onChange={(event) => setJourneyDate(event.target.value)} /></label>
				<label className="select-input"><span>DETAILS</span><select value={dataType} onChange={(event) => setDataType(event.target.value)}><option value="full">Full journey</option><option value="static">Schedule</option><option value="live">Live status</option></select></label>
				<button className="button primary search-button" disabled={busy}>{busy ? 'Searching…' : 'Track train'} <span>↗</span></button>
			</form>
			{message && <div className="inline-error search-error">{message}</div>}
		</section>
	);
}
