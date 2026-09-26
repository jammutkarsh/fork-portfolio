'use client';

import { useSyncExternalStore } from 'react';

/** Live `matchMedia` result; `false` during server render and hydration. */
export default function useMediaQuery(query: string) {
	return useSyncExternalStore(
		(onChange) => {
			const media = window.matchMedia(query);
			media.addEventListener('change', onChange);
			return () => media.removeEventListener('change', onChange);
		},
		() => window.matchMedia(query).matches,
		() => false,
	);
}
