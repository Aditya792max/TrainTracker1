const BASE_URL = 'https://api.railradar.in/v1/legacy/trains';

exports.getTrainDetails = async (request, response, next) => {
	try {
		const { number } = request.params;
		const { dataType = 'full', journeyDate, dataProvider = 'railradar' } = request.query;
		if (!/^\d{5}$/.test(number)) return response.status(400).json({ message: 'Enter a valid five digit train number.' });
		if (!['full', 'static', 'live'].includes(dataType)) return response.status(400).json({ message: 'dataType must be full, static, or live.' });
		if (!['railradar', 'NTES'].includes(dataProvider)) return response.status(400).json({ message: 'dataProvider must be railradar or NTES.' });
		if (journeyDate && !/^\d{4}-\d{2}-\d{2}$/.test(journeyDate)) return response.status(400).json({ message: 'journeyDate must use YYYY-MM-DD format.' });
		if (!process.env.RAILRADAR_API_KEY) return response.status(503).json({ message: 'RailRadar API is not configured on the server.' });
		const url = new URL(`${BASE_URL}/${number}`);
		url.searchParams.set('dataType', dataType);
		url.searchParams.set('dataProvider', dataProvider);
		if (journeyDate) url.searchParams.set('journeyDate', journeyDate);
		const upstream = await fetch(url, {
			headers: { Authorization: `Bearer ${process.env.RAILRADAR_API_KEY}`, Accept: 'application/json' },
			signal: AbortSignal.timeout(15000)
		});
		const payload = await upstream.json();
		response.status(upstream.status).json(payload);
	} catch (error) {
		if (error.name === 'TimeoutError') return response.status(504).json({ message: 'RailRadar took too long to respond.' });
		next(error);
	}
};
