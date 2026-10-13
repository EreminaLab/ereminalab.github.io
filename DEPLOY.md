# Eremina Laboratory — site package

This folder is the complete website, ready to upload. Nothing else is needed:
no build step, no framework, no dependencies. Every file here is meant to be
public.

## What's in it

```
index.html                    Home
research.html                 The three programs
publications.html             Articles, book chapter, patents
people.html                   The group
people-olga-eremina.html      Olga in depth
news.html                     News
join.html                     Open positions and contact

assets/
  site.css                    the whole design system, one file
  spectra.js                  draws the Raman divider bands
  nav.js                      mobile navigation toggle
  figures/                    four figures from the proposed research

.nojekyll                     tells GitHub Pages to serve files as-is
```

Total size ≈ 1.7 MB.

## What is deliberately *not* here

The working folder contains material that must never be published:

- `package/` — CV source, research statement, and **cover letter**
- `style-directions.html` and `styles/` — the internal design comparison

None of it was copied here. On GitHub Pages with a free account the repository
is public, so anything committed is browsable even if no page links to it —
keep those out of the repo entirely, not just out of the site.

## Publishing to GitHub Pages

1. Create a repository. Name it `<username>.github.io` if you want the URL to be
   `https://<username>.github.io`. Any other name gives
   `https://<username>.github.io/<repo>/`, which also works.
2. Upload **the contents of this folder** — not the folder itself. `index.html`
   must sit at the repository root.
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
4. Wait a minute or two, then load the URL.

`.nojekyll` is already included; it stops GitHub from running Jekyll over the
files. It is a zero-byte file and may be invisible in Finder — copy with
`cp -R` or enable hidden files (⌘⇧.) so it travels with the rest.

## Publishing anywhere else

Cloudflare Pages, Netlify, GitLab Pages, Surge, Render: drag this folder in, or
point the host at it. Leave the build command empty and set the publish
directory to the root. `.nojekyll` is harmless everywhere else.

## Still to fill in before this goes live

- **Search indexing is off.** Every page carries
  `<meta name="robots" content="noindex, nofollow">`. Remove it from all seven
  pages (in `setup/` too) at launch: `grep -rn 'name="robots"' *.html`. Do not add
  a `robots.txt` that disallows crawling while the tag is in place; crawlers then
  never see the tag.
- **Email address.** Every contact slot reads "Email address to follow". No
  `mailto:` link is live anywhere. Find them with `grep -rn TODO *.html`.
- **Building.** No building is shown. The address stops at the university and
  city. The building name, street address, and room number are still needed —
  find the slots with `grep -rn 'add building name' *.html`.
- **Funding.** Left blank on purpose — the lab's NIH R00 award number is not yet
  issued, and the Agilent fellowship supported Olga's postdoc, not the lab.
- **Photography.** Portraits on `people.html` and `people-olga-eremina.html` are
  dashed grey placeholders.
- **CV.** Not published. The original `.docx` carries a personal phone number,
  so `assets/cv/` is git-ignored and the link was removed from
  `people-olga-eremina.html`. To add one, export a cleaned PDF into `assets/cv/`,
  un-ignore it, and restore the link.
- **Google Scholar.** The footer link currently points at the publications page;
  swap in the real profile URL.
- **Fonts** load from Google Fonts. If UT hosting or a strict CSP blocks that,
  self-host them; the layouts hold either way on system fallbacks.

## Editing

`assets/site.css` holds the entire design system as CSS custom properties at the
top of the file — colours, typefaces, spacing. Changing the accent colour or the
display face is a one-line edit that propagates across every page.

Page structure is plain HTML with no templating, so the header, navigation, and
footer are repeated in each file. Change one, change all seven.
