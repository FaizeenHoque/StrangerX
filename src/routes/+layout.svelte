<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="w-full border-b-2 border-accent-primary p-4">
	<h1 class="font-mono-chrome font-thin text-2xl sm:text-4xl">
		STRANGER<span class="text-accent-primary">X</span>_
	</h1>
</div>
{@render children()}
