/**
 * The page's h1. Visually hidden — the navbar already shows where you are —
 * but kept for screen readers and search engines.
 */
export default function Header({ title }: { title: string }) {
	return <h1 className='sr-only'>{title}</h1>;
}
