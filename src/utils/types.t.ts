export type Departure = {
	id: string;
	destination: string;
	deviations: [];
	direction: string;
	direction_code: number;
	display: string;
	expected: string; // ISO date string
	journey: {
		id: number;
		state: 'EXPECTED' | string;
	};
	line: {
		id: number;
		designation: string;
		group_of_lines: string;
		transport_mode: 'BUS' | string;
	};
	scheduled: string; // ISO date string
	state: 'EXPECTED' | string;
	stop_area: {
		id: number;
		name: string;
		type: string;
	};
	stop_point: {
		id: number;
		name: string;
	};
	remaining_time: string;
	filtered_out: boolean;
};

export type TStation = {
	id: number;
	name: string;
};
