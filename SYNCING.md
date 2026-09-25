# Syncing with upstream

This site is a fork of [dlarroder/dalelarroder](https://github.com/dlarroder/dalelarroder).
Everything below exists so that pulling in upstream fixes and dependency bumps
stays a small, mostly automatic merge.

## How to sync

```bash
git checkout -b sync/upstream-$(date +%Y%m%d)   # work on a branch, not the live one
scripts/sync-upstream.sh                        # fetch + merge, leaves it uncommitted
# resolve anything it lists, then:
npm install
npm run check && npx tsc --noEmit && npm run build
git commit                                      # finish the merge, then open a PR
```

Don't use GitHub's **Sync fork** button: it merges straight into the default
branch and can't apply the rules below.

### What the script handles for you

| Situation | What happens |
| --- | --- |
| Upstream edits a file this fork deleted | Kept deleted |
| Upstream adds or edits files under a removed feature (`.upstream-exclude`) | Dropped |
| Both sides edit a fork-owned file (`merge=ours` in `.gitattributes`) | Our version is kept |
| `package-lock.json` conflicts | Regenerated with `npm install` (after `package.json` is resolved) |
| Upstream edits `app/thoughts/*` | Git follows the rename into `app/blog/*` |

Anything else that conflicts is listed at the end for you to resolve by hand.
Usually that's `package.json` (dependency bumps next to ours), `app/layout.tsx`
or `app/components/mdx.tsx`.

## Where this fork differs from upstream

**Only ours: upstream never touches these, so they never conflict**

- `app/site-metadata.ts`: name, links, bio, Giscus config
- `content/`: blog posts (`content/blog`), about page (`content/about.mdx`)
- `app/site.css`: fork-only styles (view transitions)
- `app/components/layouts/site-nav.tsx`, `site-footer.tsx`, `command-menu.tsx`,
  `blog-explorer.tsx`, `tag.tsx`, `comments/`, `og/`
- `app/about/`, `app/blog/[slug]/toc-inline.tsx`, `app/blog/[slug]/extract-headings.ts`
  (rewritten; port upstream changes to it by hand if they matter), `app/blog/kebab-case.ts`,
  `app/components/layouts/theme-switch/switch-theme.ts`
- `assets/fonts/`, `public/images/`, `scripts/`, this file

**Fork-owned copies of upstream files (`merge=ours`)**

`README.md`, `LICENSE`, `.env.example`, `app/projects/constants.ts`,
`app/uses/content.mdx`, `app/robots.ts`, `app/sitemap.ts`, `app/components/header.tsx`

**Upstream files we edit: review these on every sync**

`app/layout.tsx`, `app/page.tsx`, `app/blog/utils.ts` (upstream `app/thoughts/utils.ts`),
`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/components/blog-posts.tsx`
(upstream `thoughts.tsx`), `app/components/mdx.tsx`, `app/components/layouts/page-container.tsx`,
`app/components/layouts/theme-switch/theme-switch.tsx`, `app/components/analytics/analytics.tsx`,
`app/not-found.tsx`, `app/projects/page.tsx`, `app/uses/page.tsx`, `app/uses/uses-title.tsx`,
`next.config.ts`, `package.json`

**Removed upstream features:** see `.upstream-exclude`.

## Keeping future syncs easy

- Put personal data in `app/site-metadata.ts` or `content/`, not inline in components.
- Build new features as **new files** and hook them in with a line or two, instead
  of rewriting upstream files.
- Add styles to `app/site.css`, and leave `app/tailwind.css` identical to upstream.
- Don't reformat or reorder upstream files. Biome uses upstream's config, so
  `npm run lint` keeps the formatting the same.
- If you drop another upstream feature, add its paths to `.upstream-exclude`.
  If you take over an upstream file completely, add it to `.gitattributes` with `merge=ours`.
