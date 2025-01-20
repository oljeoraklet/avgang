import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../data/$types';

export const GET: RequestHandler = async ({ url }) => {
	// log all headers

	// retrieve a specific header
	const siteId = url.searchParams.get('siteId');

	const apiUrl = 'https://transport.integration.sl.se/v1/sites/' + siteId + '/departures';
	const res = await fetch(apiUrl).then((res) => res.json());
	// create a JSON Response using a header we received

	return json(res);
};
