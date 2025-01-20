import type { PageLoad } from './$types';
import stopJson from '$lib/data/filt_data.json';

export const load: PageLoad = () => {
	return {
		json: stopJson
	};
};
