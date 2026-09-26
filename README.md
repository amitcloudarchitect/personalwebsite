# Amit Kumar — professional site

A portfolio for an enterprise architect. Content lives in typed data files. The production container serves the built site with Nginx, and a small API handles comments and newsletter addresses. The public site is [amitkumarportfolio.com](https://amitkumarportfolio.com). Publishing steps for Google Cloud Run are in `DEPLOYMENT.md`.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. That command also starts the discussion API on `127.0.0.1:8787`. Vite forwards `/api` to it.

Copy `.env.example` to `.env` when you want canonical URLs, profile links, or sign-in credentials during local development. Restart `npm run dev` after changing server variables such as `GOOGLE_CLIENT_ID`.

## Production build

```bash
npm install
npm run build
npm run preview
```

`npm run build` regenerates `public/sitemap.xml` and `public/robots.txt`, typechecks the project, and writes the site to `dist/`.

Set `VITE_SITE_URL` before a production build so canonical URLs and the sitemap use your real domain.

## Docker

```bash
docker build -t amit-portfolio .
docker run -p 8080:80 amit-portfolio
```

The site is then available at `http://localhost:8080`. Comments and newsletter addresses are stored in `/app/data` inside the container. Mount a volume if you want them to survive a new container:

```bash
docker run -p 8080:80 -v amit-community:/app/data -e SESSION_SECRET=replace-with-a-long-random-string amit-portfolio
```

Compose does the same thing and forwards build arguments from the shell environment:

```bash
docker compose up --build
```

Public links are baked in at build time because this is a static Vite app. Pass them as build arguments when you want them inside the image:

```bash
docker build -t amit-portfolio --build-arg VITE_SITE_URL=https://www.example.com --build-arg VITE_LINKEDIN_URL=https://www.linkedin.com/in/example .
```

You can also edit `public/config.json` before the image is built, or replace `/usr/share/nginx/html/config.json` in a running container. Non-empty values in that file override the build-time links in the browser. `VITE_SITE_URL` is still required at build time for the sitemap and the initial canonical URL.

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Public site origin, no trailing slash |
| `VITE_LINKEDIN_URL` | LinkedIn profile |
| `VITE_GITHUB_URL` | GitHub profile |
| `VITE_EMAIL` | Email address for a mailto link |
| `VITE_YOUTUBE_URL` | YouTube channel or profile. Left blank until the channel exists. |
| `VITE_MEDIUM_URL` | Medium profile. Left blank until the publication exists. |
| `VITE_RESUME_URL` | Optional resume file URL |

Leave a value empty to hide that link. Do not put phone numbers, secrets, or customer data in these files.

`VITE_*` values are public. The variables below stay on the server and are never written into the JavaScript bundle.

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Signs the sign-in cookie. Set a long random value in production. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Gmail sign-in through Google |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | Outlook sign-in through Microsoft |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Facebook sign-in |

Until those provider values are set, the Gmail, Outlook, and Facebook buttons stay disabled. The site does not invent a logged-in user.

Register this redirect URI with each provider, using the public origin of the site:

- `{origin}/api/auth/google/callback`
- `{origin}/api/auth/microsoft/callback`
- `{origin}/api/auth/facebook/callback`

For local development the origin is `http://localhost:5173`. For the Docker container on this machine it is `http://localhost:8080`. Google and Microsoft apps should be the Web application type. The Microsoft app should allow personal Microsoft accounts so Outlook.com addresses can sign in. A Facebook app in development mode only accepts the app’s own roles until Meta reviews it.

Newsletter addresses are saved in `data/community.json` on the machine running the API. The form does not send email. Connect a mail sender later if you want letters delivered. Comments are plain text. An email address used to sign in is stored with the account and is not shown on the article.

`public/config.json` accepts the same fields: `siteUrl`, `linkedin`, `github`, `email`, `youtube`, `medium`, `resumeUrl`. LinkedIn and GitHub are set. YouTube and Medium stay empty until those channels exist.

## Adding a project

Edit `src/data/projects.ts`. Add an object with a unique `slug`. The projects page and `/projects/:slug` pick it up without a layout change. Keep the description sanitized: no customer names, subscription or tenant IDs, IP addresses, private domains, credentials, or internal URLs.

## Adding an article

1. Add a Markdown file at `src/content/articles/your-slug.md`.
2. Add a matching entry in `src/data/articles.ts` with the same `slug`, `source: 'internal'`, and `placeholder: false`.
3. Rebuild. The sitemap includes the article only when `placeholder` is false.

For a piece that lives on LinkedIn or another site, set `source: 'external'`, `externalUrl` to the public `https` URL, and `placeholder: false`. No Markdown file is required.

## Adding a certification

Edit `src/data/certifications.ts`. Set `placeholder: false` only for a credential you hold. Optional fields: `issueDate`, `credentialUrl`, and `badge` (a path such as `/images/badges/example.png` or an `https` URL).

## Adding a video

Edit `src/data/videos.ts`.

- YouTube: set `platform: 'youtube'`, `youtubeId`, and `placeholder: false`. The player uses the privacy-enhanced embed domain.
- LinkedIn or another host: set `platform` to `linkedin` or `external`, set `url`, and set `placeholder: false`.

Do not point a card at someone else's video.

## Adding an architecture diagram

Gallery entries are in `src/data/architecture.ts`. Each entry has a `diagram` of nodes (`x` and `y` from 0 to 100) and edges. To use an image instead, set `image` to a file you place under `public/`, for example `/diagrams/hybrid.svg`. Clicking the diagram opens the explanation page. The page includes a full-screen viewer.

The same `image` field exists on projects when you want to replace the generated diagram.

## Other content files

| File | What it controls |
| --- | --- |
| `src/data/profile.ts` | Name, positioning, about copy, portrait path |
| `src/data/experience.ts` | Roles |
| `src/data/timeline.ts` | Career, certification, project, and milestone timeline |
| `src/data/solutions.ts` | Solutions library |
| `src/data/aiLab.ts` | AI lab cards and status |
| `src/data/videos.ts` | Videos |
| `src/data/events.ts` | Speaking and events |
| `src/data/certifications.ts` | Certifications |
| `src/data/technologies.ts` | Technology radar |
| `src/data/achievements.ts` | Achievements |
| `src/data/focus.ts` | Homepage focus areas |
| `src/data/articles.ts` | Article metadata |

The portrait is a placeholder until `profile.photo.src` points at an image, for example `/images/portrait.jpg`.

## Content safety

Describe patterns and your own contribution. Do not publish customer credentials, subscription IDs, tenant IDs, internal IP addresses, private domain names, customer network details, passwords, keys, internal URLs, or commercial terms.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Site and discussion API |
| `npm run build` | Sitemap, typecheck, and production build |
| `npm run preview` | Serve `dist` locally |
| `npm run sitemap` | Regenerate sitemap and robots files only |

## Later, without a redesign

These can be added later at the edges:

- A resume link is already supported through `VITE_RESUME_URL`.
- Analytics, a contact API, or a chatbot would be new endpoints, not a new layout.
- Article, diagram, speaking, and certification records are already data. A CMS would replace the files, not the pages.
- GitHub, LinkedIn, and YouTube links are configuration. Live feeds can be added beside those links later.
- Newsletter delivery needs a mail sender. Addresses are already stored locally.

Comments and the newsletter list use a JSON file on the server. There is no paid database and no paid email service.

Deployment notes for Azure Container Apps are in `DEPLOYMENT.md`.
