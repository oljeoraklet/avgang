<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Departure, TStation } from '../utils/types.t';
	import Station from '$lib/components/Station.svelte';
	let modal: HTMLDialogElement;
	let { data }: { data: PageData } = $props();

	let searchString = $state('');

	let selectedStation: TStation | undefined = $state(undefined);
	let selectedStations: TStation[] | undefined = $state([]);

	// Add station to local storage list
	function addStationToLocalStorage(station: TStation) {
		// Retrieve the current list from local storage
		const localStations = JSON.parse(localStorage.getItem('selectedStations') || '[]');

		// Avoid duplicates
		if (!localStations.find((s: TStation) => s.id === station.id)) {
			// Add the new station to the list
			localStations.push(station);

			// Update local storage
			localStorage.setItem('selectedStations', JSON.stringify(localStations));

			// Update the state
			selectedStations = localStations;
		}
	}
	onMount(() => {
		// Load initial stations from local storage
		const localStations = localStorage.getItem('selectedStations');
		if (localStations) {
			selectedStations = JSON.parse(localStations);
		}
	});
</script>

<section class="flex min-h-screen flex-col items-center justify-center gap-6">
	<h1 class="text-6xl font-bold italic">Avgångsdisplay</h1>
	<div class="divider"></div>
	{#if selectedStations && selectedStations.length > 0}
		<h2 class="text-2xl font-bold">Selected Stations:</h2>
		<div class="flex gap-4">
			{#each selectedStations as station}
				<Station {station} />
			{/each}
		</div>
	{:else}
		<p>No stations selected</p>
	{/if}
	<div class="relative">
		<input
			type="text"
			bind:value={searchString}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
		{#await data.json}
			<p>Loading...</p>
		{:then}
			{#if searchString.length >= 3 && selectedStation === undefined}
				<ul class="menu dropdown-content bg-base-100 rounded-box absolute z-[1] w-52 p-2 shadow">
					{#each data.json.filter((station) => station.name
							.toLowerCase()
							.includes(searchString.toLowerCase())) as station}
						<li>
							<option
								value={station}
								class="menu-title"
								onclick={() => {
									selectedStation = station;
									searchString = station.name;
								}}
							>
								{station.name}</option
							>
						</li>
					{/each}
				</ul>
			{/if}
		{/await}
	</div>
	<!-- <button class="btn" onclick={() => modal.showModal()}>Open Dialog</button> -->
	<button
		class="btn"
		onclick={() => {
			if (selectedStation) {
				addStationToLocalStorage(selectedStation);
				selectedStation = undefined; // Reset temporary selection
				searchString = ''; // Clear the input field
			}
		}}>Lägg till hållplats</button
	>
	<!-- <dialog bind:this={modal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Hello!</h3>
			<p class="py-4">Press ESC key or click outside to close</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog> -->
</section>
