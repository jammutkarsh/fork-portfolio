/** Renders a JSON-LD `<script>` tag. `data` is always our own trusted data, never user input. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type='application/ld+json'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD, not user input
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
