export default function TrainResults({ trainData, trainNumber }) {
	if (!trainData) return (
		<section className="empty-state">
			<div className="route-art"><span>IND</span><i></i><span>GOA</span><b>✳</b></div>
			<h3>Your next journey starts here.</h3>
			<p>Enter a train number to see its route, schedule and live running status.</p>
			<div className="suggestion">TRY A TRAIN <button onClick={() => window.dispatchEvent(new CustomEvent('trackline:sample-train'))}>12919 <span>↗</span></button></div>
		</section>
	);

	const train = trainData.train || {};
	const route = trainData.route || [];
	const live = trainData.liveData || trainData.live || {};
	return (
		<section className="results">
			<div className="result-title"><div><div className="eyebrow">YOUR TRAIN</div><h2>{train.name || 'Train details'}</h2><p className="muted">{train.type || 'Indian Railways'} <span className="dot">·</span> {train.number || trainNumber}</p></div><div className="delay-pill">{live.overallDelayMinutes > 0 ? `${live.overallDelayMinutes} min delay` : 'On schedule'}</div></div>
			<div className="journey-card">
				<div className="station"><span className="station-code">{train.sourceCode || route[0]?.stationCode || '—'}</span><strong>{route[0]?.stationName || 'Origin'}</strong><small>{route[0]?.scheduledDeparture || 'Departure'}</small></div>
				<div className="journey-line"><span>✦</span><i></i><small>{route.length ? `${route.length} stops` : 'Journey route'}</small></div>
				<div className="station right"><span className="station-code">{train.destinationCode || route.at(-1)?.stationCode || '—'}</span><strong>{route.at(-1)?.stationName || 'Destination'}</strong><small>{route.at(-1)?.scheduledArrival || 'Arrival'}</small></div>
			</div>
			{live.currentLocation && <div className="live-location"><span className="pulse"></span><div><small>CURRENT STATUS</small><strong>{live.currentLocation.stationCode} · {live.currentLocation.status}</strong></div><span className="muted">Updated {live.lastUpdatedAt ? new Date(live.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'}</span></div>}
			{route.length > 0 && <div className="route-list">
				<div className="route-head"><span>STATION</span><span>ARRIVAL</span><span>DEPARTURE</span><span>STATUS</span></div>
				{route.map((stop) => <div className="route-row" key={`${stop.sequence}-${stop.stationCode}`}><div><b>{stop.stationName}</b><small>{stop.stationCode}</small></div><span>{stop.scheduledArrival || '—'}</span><span>{stop.scheduledDeparture || '—'}</span><span className={stop.delayMinutes > 0 ? 'late' : 'on-time'}>{stop.delayMinutes > 0 ? `+${stop.delayMinutes} min` : 'On time'}</span></div>)}
			</div>}
		</section>
	);
}
