import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		title: 'Solo Monorepo Template',
		description: 'A production-ready monorepo template for solo projects'
	};
};

