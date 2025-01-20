<script lang="ts">
	import type { PageData } from './$types';
	let modal: HTMLDialogElement;
	let { data }: { data: PageData } = $props();

	async function getDepartures(siteId: string) {
		const response = await fetch('/api/site-id-lookup?' + new URLSearchParams({ siteId }), {
			method: 'GET'
		}).then((res) => res.json());
		console.log(response);
	}
</script>

<!-- 
<Modal bind:this={modal} onclose={() => {}}>
	Content
	{#snippet commands()}
		Commands
	{/snippet}
</Modal> -->
<button class="btn" onclick={() => modal.showModal()}>Open Dialog</button>
<button onclick={() => getDepartures('1234')}>Test api</button>
<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Hello!</h3>
		<p class="py-4">Press ESC key or click outside to close</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
