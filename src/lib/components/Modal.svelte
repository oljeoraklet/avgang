<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createDialog } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	interface Props {
		children: Snippet;
		commands: Snippet;
		onclose: () => void;
	}

	let { children, commands, onclose }: Props = $props();

	const dialog = createDialog();

	// functions allow opening and closing the dialog from the host element
	export function open() {
		dialog.open();
	}

	export function close() {
		dialog.close();
	}
</script>

<!-- the unmount option completely removes DOM nodes from the page -->
<Transition show={$dialog.expanded} unmount>
	<div class="z-10">
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<button
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={close}
				aria-label="Close"
			></button>
		</Transition>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				>
					<div
						class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
						use:dialog.modal
						{onclose}
					>
						<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">{@render children()}</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							{@render commands()}
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</div>
</Transition>
