import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// SSR only: do not use adapter-static or prerender. App runs as Node server (systemd).
		adapter: adapter()
	}
};

export default config;

