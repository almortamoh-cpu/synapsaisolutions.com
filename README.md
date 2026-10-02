# Synaps AI Solutions —سينابس للحلول المتكاملة وتقنيات الذكاء الاصطناعي

Bilingual (Arabic / English) corporate website for a technology solutions
company specialising in **Artificial Intelligence, AI Agents, Automation,
Software Development, System Integration, Data Integration, Digital
Transformation, and Enterprise Solutions**.

- Domain: `https://synapsaisolutions.com`
- Stack: React 18 · TypeScript · Vite · React Router · Tailwind CSS 3 · lucide-react
- Default language: **Arabic (RTL)**, fully switchable to English (LTR)

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
```

---

## Project structure

```
public/
  favicon.svg          Brand mark
  manifest.json        Web app manifest
  og-image.svg         Open Graph / Twitter share image
  robots.txt           Crawl directives + sitemap pointer
  sitemap.xml          All public routes with hreflang alternates

src/
  main.tsx             Root render: Router + LanguageProvider
  App.tsx              Route map (all routes lazy-loaded except Home)

  config/
    site.ts            ⭐ Single source of truth: identity, SEO, WhatsApp
                       number, contact placeholders, social, endpoints

  content/             ⭐ All bilingual copy lives here, no hardcoded strings
    types.ts           `Bi` = { ar, en } — the CMS-ready content primitive
    ui.ts              Navigation, generic UI strings, form labels/validation
    home.ts            Every page's copy: hero, about, services, AI agents,
                       automation, solutions, industries, technology,
                       projects, process, why Synaps, insights, contact

  context/
    LanguageContext.tsx  Language + direction state, persisted to
                        localStorage, written to <html lang dir>

  hooks/
    useSeo.ts          Per-route title/description/canonical/OG/Twitter

  utils/
    cn.ts              ClassName joiner

  components/
    layout/            Header, Footer, Layout, Logo, LanguageSwitcher,
                       ScrollManager (scroll restore + BackToTop)
    sections/          Hero, CapabilitiesStrip, About, Services, AiAgents,
                       Automation, DigitalSolutions, Enterprise, Industries,
                       Technology, Projects, Process, WhySynaps
    ui/                Section, Heading, Reveal, Icon — the design primitives
    chat/
      AIChat.tsx       Floating AI Assistant (demo mode or live proxy)
    ContactForm.tsx    Validated contact form with demo/live states
    FloatingActions.tsx WhatsApp + back-to-top controls

  pages/               One file per route

scripts/
  check-scripts.mjs   Guards the content layer against corrupted
                      mixed Arabic/Latin strings
  verify-site.mjs     RTL direction audit + fabricated-data audit
  check-links.mjs     Internal route and anchor-link integrity
  check-a11y.mjs      Heading hierarchy and accessibility patterns
  check-whatsapp.mjs   WhatsApp placeholder guard (behavioural)
  ssr-smoke.tsx       Renders every page in both languages
  run-smoke.mjs       Bundles and runs the render smoke test
  check-css.mjs       Verifies no Tailwind class was purged
```

---

## Language & RTL/ LTR

`LanguageContext` owns the active language and writes `lang` and `dir` onto
`<html>`, so the entire document flips without any component-level branching.

- Arabic is the default. The choice persists in `localStorage` under
  `synaps.lang` and survives navigation and reloads.
- **All layout uses CSS logical properties** (`ms-*`, `me-*`, `ps-*`, `pe-*`,
  `start-*`, `end-*`, `border-s-*`, `border-e-*`) and `rtl:` variants —
  never `left`/`right` for directional layout.
- Fonts: Tajawal for Arabic, Inter for Latin, loaded with `display=swap` and
  a `preload` hint.

Content is authored as `{ ar, en }` records and resolved with
`pick(ar, en)`. This shape maps 1:1 to a CMS or translation API later, so
copy can move out of the repo without touching component code.

---

## Content editing guide

**All visible copy is in `src/content/`.** Components import from there and
never contain hardcoded user-facing strings.

To change a headline:
```ts
// src/content/home.ts
export const about = {
  title: bi('نبني حلولًا تقنية تتجاوز مجرد البرمجيات', 'Technology Solutions Built Beyond Software'),
  // ...
}
```

To swap a placeholder project for a real one, edit the `projects` array in
`src/content/home.ts`. Each entry is `{ id, name, industry, challenge,
solution, technology[], results[] }`, and the card renders those fields
automatically.

> The three current `projects` entries are **explicitly labelled
> placeholders** so they are never mistaken for real client work.

---

## Configuration

Everything an operator needs to change is in **`src/config/site.ts`**:

| What | Field | Current state |
| --- | --- | --- |
| WhatsApp number | `whatsapp.number` | `'00000'` — placeholder, treated as unset |
| Contact email | `contact.email` | `''` — placeholder |
| Contact phone | `contact.phone` | `''` — placeholder |
| LinkedIn / X | `social.linkedin`, `social.x` | `''` — unconfigured |
| Contact API | `endpoints.contactForm` | env-driven, off by default |
| AI proxy | `endpoints.aiAssistant` | env-driven, off by default |

### WhatsApp

The number currently holds the visible placeholder `'00000'` so it is easy to
find and replace. Set the real number and every surface follows:

```ts
whatsapp: {
  number: '9677XXXXXXXX',   // digits only, with country code, no "+"
}
```

Because `'00000'` would otherwise produce `https://wa.me/00000` — a dead link
that looks real to a visitor — `whatsappLink()` treats placeholder values as
*not configured*. Recognised placeholders:

| Pattern | Example |
| --- | --- |
| Empty | `''` |
| One repeated digit | `'00000'`, `'111111111111'` |
| Sequential filler | `'123456789'`, `'0123456789'`, `'987654321'` |

While a placeholder is in place, the floating button links to `/contact`, shows
an amber "not yet configured" dot, and the footer social link renders disabled.
The moment you paste a real number, the live `wa.me` link with a prefilled,
language-appropriate message activates automatically — no other change needed.

Always build URLs through `whatsappLink()`; the verification suite fails if any
component constructs a `wa.me` URL by hand and bypasses this guard.

### Contact form

If `endpoints.contactForm` is unset, the form runs a clearly-labelled
**demo mode**: it validates, then states plainly that it is not connected to
a backend. It never claims a message was sent. Once the endpoint is set it
POSTs:

```json
{ "fullName": "", "company": "", "email": "", "phone": "",
  "country": "", "service": "", "message": "", "lang": "ar" }
```

The backend owns validation, CSRF protection, rate limiting, spam filtering,
and delivery.

### AI Assistant

If `endpoints.aiAssistant` is unset, the assistant runs an honest **demo
mode** — a "Demo mode" badge and banner, canned replies, and a note that it
is not yet connected to an AI model. When set, it POSTs
`{ message, lang, history[] }` and expects `{ "reply": "..." }`.

---

## Security

- **No credentials of any kind are in this repository.** No API keys, no
  passwords, no database credentials, no tokens.
- The AI endpoint must be **your own backend proxy** that holds the model
  provider key. Pointing it straight at a provider would expose that key in
  the browser bundle.
- Vite inlines `VITE_*` variables into the client. See `.env.example` for
  which variables are safe there.
- The contact form is designed to be hardened server-side; the front end
  performs validation for UX only and is never the trust boundary.

---

## Content integrity rules

This site intentionally ships **no fabricated company information**:
no invented customers, client names, partnerships, certifications, awards,
statistics, project counts, employee counts, or office addresses. There is
no lorem ipsum.

Specifically handled:
- The **Projects** section uses cards explicitly labelled as examples.
- The **Technology** section renders a visible disclaimer that the list is
  the set of technologies we work with, and that the actual stack varies
  per project.
- The **Government & Enterprise** section describes capability only — it
  makes no claim of government contracts or existing government clients.
- **Privacy** and **Terms** are marked as templates pending legal review
  and are `noindex`.

Run the guard after editing the content layer:

```bash
node scripts/check-scripts.mjs
```

It scans the source tree for corrupted mixed Arabic/Latin strings and fails on
anything outside a whitelist of intentional technical terms
(API, SaaS, MLOps, CI/CD, REST, IAM, WhatsApp, Synaps, …).

---

## Verification

The repository ships an automated verification suite. Run it before every
commit or release:

```bash
npm run verify
```

It chains these steps:

| Step | Command | What it proves |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | Strict TS compiles across the whole app |
| Content | `npm run check:content` | No corrupted mixed Arabic/Latin strings |
| RTL + data | `npm run check:rtl` | No physical `left/right` utilities; no fabricated contact details, statistics, or filler copy; WhatsApp placeholder never becomes a live link |
| WhatsApp | `npm run check:whatsapp` | Placeholder values produce no link; real numbers produce a valid, localised `wa.me` URL |
| Links | `npm run check:links` | Every internal route and `#anchor` resolves |
| A11y structure | `npm run check:a11y` | Exactly one `h1` per page, no skipped heading levels, labelled form controls, decorative icons hidden |
| Render smoke | `npm run check:smoke` | Every page renders in **both** languages via `react-dom/server`, with no runtime errors, and Arabic/English output actually differs |
| Build | `npm run build` | Production bundle succeeds |
| CSS | `npm run check:css` | Every Tailwind class referenced in source survives purging and exists in the compiled CSS |

The render smoke test is the most valuable of these — it is what catches a
blank page, a crash inside a section, or a language switch that silently does
nothing, none of which a typecheck or a build can see.

---

## Accessibility

- One `<h1>` per page, then `<h2>`/`<h3>` — no skipped levels.
- Skip-to-content link; visible `:focus-visible` rings on all controls.
- Mobile drawer traps focus entry, closes on `Escape`, and restores the
  trigger's focus.
- Form fields have real `<label htmlFor>`, `aria-invalid`, and
  `aria-describedby` errors; errors use `role="alert"`.
- Ordered flows (AI agent, automation, process) use `<ol>` so the sequence
  is announced correctly.
- Live regions: chat transcript is `aria-live="polite"`; the active
  automation step updates a labelled live region.
- Decorative SVG is `aria-hidden`; meaningful SVG carries a label.
- `prefers-reduced-motion` disables reveals, floats, pulses, and transforms.

---

## Performance

- Route-level code splitting — only Home is in the initial chunk.
- No CSS or JS animation libraries; animation is CSS keyframes plus one
  `IntersectionObserver` in `Reveal`.
- Fonts loaded with `preload` + `display=swap`, with a `noscript` fallback.
- Hero visualisation is inline SVG — no image request, no CLS.
- `og-image.svg` and `favicon.svg` are vector.

---

## SEO

`index.html` ships the base metadata; `useSeo` updates title, description,
canonical, Open Graph, and Twitter tags per route.

Implemented: semantic HTML, correct heading hierarchy, canonical URL,
`hreflang` alternates in `sitemap.xml`, `robots.txt`, web manifest,
favicon, and Open Graph / Twitter card metadata.

Canonical domain: `https://synapsaisolutions.com`.

---

## Before going live

1. Replace `'00000'` in `siteConfig.whatsapp.number` (`src/config/site.ts`)
   with the real WhatsApp number. Fill in `contact.email`, `contact.phone`,
   and the social URLs in the same file.
2. Replace the three placeholder entries in `projects` in
   `src/content/home.ts` with real projects (or remove the section).
3. Have `Privacy` and `Terms` reviewed by a lawyer and replace the template
   copy.
4. Connect a backend for the contact form and the AI assistant, then set the
   two `VITE_*` endpoint variables.
5. Generate a PNG/JPG `og-image` (currently `og-image.svg`) if your target
   platforms require a raster share image.
6. Set a real `lastmod` in `public/sitemap.xml`.