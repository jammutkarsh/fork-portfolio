export interface Screenshot {
	src: string;
	caption?: string;
}

/** A project, read from content/projects/<slug>.mdx. */
export interface Project {
	slug: string;
	name: string;
	/** Image shown at the top of the page and on hover in the list. */
	hero: string;
	repo: string;
	/** At least one of `website` and `install` is set. */
	website?: string;
	/** Install command, e.g. `go install …@latest`. */
	install?: string;
	stack: string[];
	/** The problem statement: the markdown body of the file. */
	description: string;
	order?: number;
	/** A YouTube link or a video file path. */
	demo?: string;
	screenshots?: Screenshot[];
	/** Mermaid source. */
	architecture?: string;
}

export interface ProjectModal {
	active: boolean;
	index: number;
}
