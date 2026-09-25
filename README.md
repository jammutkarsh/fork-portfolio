# utkarshchourasia.in ⚡️

- **Framework**: [Next.js](https://nextjs.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: [MDX](https://mdxjs.com/) via [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Lint/Format**: [Biome](https://biomejs.dev/)

Based on [dlarroder/dalelarroder](https://github.com/dlarroder/dalelarroder).

## Running Locally

1. Clone this repo and install dependencies

```bash
git clone https://github.com/jammutkarsh/fork-portfolio
cd fork-portfolio
npm install
```

2. Create a `.env.local` file following the `.env.example` and fill in the Giscus values

```bash
cp .env.example .env.local
```

3. Run the development server

```bash
npm run dev
```

## Writing content

- Blog posts: `content/blog/*.mdx` (frontmatter: `title`, `date`, `tags`, `draft`, `summary`)
- About page: `content/about.mdx`
- Uses page: `app/uses/content.mdx`
- Projects: `app/projects/constants.ts` (preview images go in `public/static/images/project/`)

## Licence

[MIT](./LICENSE)
