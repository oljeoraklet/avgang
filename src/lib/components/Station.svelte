<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { TStation, Departure } from '../../utils/types.t';
	import { fly } from 'svelte/transition';

	let idCounter = 0;
	let { station } = $props();

	let stationInfo: Departure[] = $state([]); // List of departures
	let interval: ReturnType<typeof setInterval>;

	async function getDepartures(siteId: number | undefined) {
		if (!siteId) {
			console.error('No siteId provided');
			return [];
		}
		const response = await fetch(
			'/api/site-id-lookup?' + new URLSearchParams({ siteId: siteId.toString() }),
			{ method: 'GET' }
		).then((res) => res.json());

		// Initialize departures with a compound key based on `scheduled` and `journey.id`
		return response.departures.map((departure: Departure) => ({
			...departure,
			id: `${departure.journey.id}-${departure.scheduled}`, // Compound key using scheduled
			remaining_time: '',
			filtered_out: false
		}));
	}

	onMount(async () => {
		let lastRefetchTime = Date.now(); // Track the last refetch time

		// Fetch initial departures
		stationInfo = await getDepartures(station.id);
		stationInfo = stationInfo.filter(
			(departure, index, self) =>
				index ===
				self.findIndex(
					(d) =>
						`${d.journey.id}-${d.scheduled}` === `${departure.journey.id}-${departure.scheduled}`
				)
		);

		// Update departures every second
		interval = setInterval(async () => {
			let departuresChanged = false;
			const currentTime = Date.now(); // Current time for refetch check

			stationInfo = stationInfo.map((departure) => {
				const timeDifference = new Date(departure.scheduled).getTime() - new Date().getTime();
				const minutes = Math.floor(timeDifference / 60000);
				const seconds = Math.floor((timeDifference % 60000) / 1000);

				// Mark departures as filtered_out if they have departed
				if (timeDifference <= 0) {
					if (!departure.filtered_out) {
						departuresChanged = true;
						return { ...departure, filtered_out: true }; // Mark as visually removed
					}
					return departure; // Already filtered out
				}

				// Update remaining_time
				return {
					...departure,
					remaining_time:
						minutes === 0
							? `It is ${seconds} second${seconds !== 1 ? 's' : ''} left`
							: `It is ${minutes} minute${minutes !== 1 ? 's' : ''} left`
				};
			});

			// Refetch departures every minute or if departures changed
			if (departuresChanged || currentTime - lastRefetchTime >= 60000) {
				console.log('Refetching departures');
				const newDepartures = await getDepartures(station.id);
				lastRefetchTime = Date.now(); // Update the last refetch time

				if (newDepartures) {
					stationInfo = [
						...stationInfo.filter((departure) => !departure.filtered_out), // Keep unfiltered departures
						...newDepartures.filter(
							(newDeparture: Departure) =>
								!stationInfo.some((existingDeparture) => existingDeparture.id === newDeparture.id)
						)
					];
				}
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="station-container">
	<h2 class="text-2xl font-bold">{station.name}</h2>
	<ul class="station-container flex flex-col gap-4">
		{#each stationInfo as departure (departure.id)}
			{#if !departure.filtered_out}
				<li
					class="flex flex-col gap-4 rounded-md p-2"
					transition:fly={{ x: -100, duration: 300 }}
					onoutroend={() => {
						// Remove departure after animation completes
						stationInfo = stationInfo.filter((d) => d.id !== departure.id);
					}}
				>
					<div class="card bg-base-100 w-96 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">
								Linje: {departure.line.group_of_lines}
								{departure.line.designation}
							</h2>
							<p>Destination: {departure.destination}</p>

							{#if departure.remaining_time.match(/(?<=It is )\d+(?= seconds left)/)}
								<span class="countdown font-mono text-2xl">
									<span
										style="--value:{departure.remaining_time.match(
											/(?<=It is )\d+(?= seconds left)/
										)};"
									></span>
									s
								</span>
							{:else}
								<p>Tid: {departure.remaining_time}</p>
							{/if}
						</div>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
</div>
