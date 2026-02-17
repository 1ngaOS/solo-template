import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		title: '__TEMPLATE_SEO_TITLE__',
		description: '__TEMPLATE_SEO_DESCRIPTION__'
	};
};

