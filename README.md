# ToonGhuri Studio

A buildless, responsive website for automated YouTube localization, publishing and managed title/thumbnail testing.

## Run locally

Use a static server for visual review, for example `python -m http.server 8767`. On the existing PHP host, keep `index.html`, `assets/`, `submit-sample.php`, and `.htaccess` together.

## Featured example

The whole page uses the owner-selected Pip the Little Cloud video, `JCj6V_AqaOQ`. Its native **Settings → Audio track** menu provides Arabic, Bangla (original), English (US), French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, and Spanish. The available tracks were checked in the watch-page and embedded-player menus.

The player loads after the visitor presses play. Language chips list the available tracks; YouTube handles actual audio selection and playback. All visual examples use the real Pip thumbnail. Title variants, chapter times and thumbnail crops in the service overview are explicitly illustrative; they do not claim to be published assets or test results. There are no waveform measurements or character images from another story.

## Simple customer flow

Watch the example, get a free 90-second sample in one language (once per new customer), then try one full video for $39 (up to 20 minutes, 5 languages = 100 dubbed minutes). The main offer is monthly with a minutes pool: Channel plan $590/month (2 uploads a week = 8 videos, 240 video minutes, up to 10 languages = up to 2,400 dubbed minutes) and Growth plan $990/month (3 uploads a week = 12 videos, 360 video minutes, up to 12 languages = up to 4,320 dubbed minutes). Any single video up to 60 minutes; no carry-over of unused allowance. Studio (custom quote): up to 15 languages, longer videos, larger libraries. Clients choose languages; we recommend starting with 4-6 high-reach languages. Run tools/job_cost_calculator.py in the pipeline workspace to check margins. Final totals are confirmed before production; the form is an enquiry, not a checkout.

Production is handled by an AI pipeline with team oversight. The page does not promise manual language review, human voice actors, or native-speaker quality checks.

## Complete service offer

The homepage gives equal emphasis to localization (dubbing, music/effects and subtitles), packaging (translated titles, descriptions and chapter timestamps), and managed testing (three text-free thumbnail variants, title variants, test setup and results review). YouTube Studio publishing includes the agreed assets; end screens, info cards and pinned comments can be included in the package.

The owner confirmed that agents both set up tests and review outcomes, and moved to a monthly-plan model ($39 trial video; $590 and $990 monthly plans with minute pools of up to 10/12 languages). Native YouTube testing is described as eligibility-dependent, with a linked FAQ covering restrictions and inconclusive results. The full package includes dubbing, subtitles, translated titles/descriptions, timestamps, three thumbnail variants, title variants, publishing, and eligible test setup and results review. Monthly plans are cancel-any-month; additional scope is quote-based; no turnaround guarantee is published.

## Sample requests

The production page posts JSON to `submit-sample.php`. It reports receipt only after a successful JSON response with `ok: true`. If the endpoint is unavailable, rate-limited, or rejects the payload, it prepares an email for the visitor to send.

The handler checks that the `Origin` (or, if that is missing, the `Referer`) is `toonghuri.com`, `www.toonghuri.com`, or localhost. It validates the YouTube link and email, strips control characters so names cannot break the mail headers, ignores submissions that fill the hidden `tg_leave_blank` honeypot, and allows 5 submissions per IP per hour. Leads are appended to `leads.jsonl` in a `toonghuri-private` directory next to the web root when PHP can create it, and otherwise in `_private/` (denied by `.htaccess`). An older `_leads_submissions.jsonl` in the web root, if one already exists on the server, stays blocked and is no longer written. Notification email still goes to `studio@toonghuri.com`.

The owner-private static review copy uses email delivery because static hosting does not execute PHP. It excludes PHP source and lead logs. Keep the production `.htaccess` file alongside the PHP endpoint.

## Dependencies

No build step or frontend package installation is needed. Fonts load from Google Fonts. Video playback uses YouTube. Supporting images use the same featured Pip thumbnail.

## Promises

The site promises deliverables, not outcomes. It states plainly that views are not guaranteed, and the FAQ explains how the package differs from YouTube's automatic dubbing. No turnaround, redo or results guarantee is published.

## Trust pages

`about.html`, `privacy.html` and `terms.html` share the homepage header, footer and stylesheet, and are linked from every footer and from the sample form's small print. The privacy policy describes what `submit-sample.php` actually collects (link, email, optional name/channel, languages, selected plan, timestamp and IP address), stored in the protected `_leads_submissions.jsonl` log and emailed to the studio inbox. It also lists Google Fonts, the click-to-load YouTube player and Google AI services.

Privacy and terms are **templates**: review them (ideally with a lawyer) before relying on them. All placeholders have been filled; search the HTML for `[[` to confirm none remain.

The site presents ToonGhuri Studio as an agency: no personal names are published. Legal pages identify the operating business entity only.

## Legal details to revisit

- Business address published: Sofias Sliman 30, 11526 Ambelokipi, Athens, Greece. When the business is registered, add the registered business name, tax number (AFM) and VAT status to privacy.html and terms.html.
- Privacy states the Gemini API paid tier is used for client work; free-tier keys must not process client videos.
- Defaults chosen for review: lead retention 12 months, production files 90 days after delivery, Stripe invoices due on receipt, trial paid upfront, monthly plans billed in advance and cancellable at month end.

Prices are published in US dollars (USD). The trial video is limited to one per new customer.

## Canonical host

`https://toonghuri.com` is the canonical host. `.htaccess` 301s `www.toonghuri.com` to that host, and 301s plain HTTP only when `X-Forwarded-Proto` is `http`.

Do not add a `RewriteCond %{HTTPS} off` rule. Hostinger terminates TLS at the edge and talks to Apache over HTTP, so `%{HTTPS}` is off even for visitors who already used HTTPS. Redirecting those requests loops, and the loop is what shows up as a 500 on `http://toonghuri.com`. Checked on 3 November 2026, the live edge already returned `301` from `http://toonghuri.com` to `https://toonghuri.com/`. The repository `.htaccess` had no redirect rules, so that 500 is not explained by this repo. `https://www.toonghuri.com` was still serving the site (`200`) instead of redirecting to the apex.

In hPanel, keep Force HTTPS on, and set the primary domain to the non-www host so `http://www` goes straight to `https://toonghuri.com` rather than stopping at `https://www`. If plain HTTP still returns 500 after this file is deployed, the cause is in Hostinger (edge redirect, an `.htaccess` edited on the server outside git, or the HTTP vhost). Check hPanel → Logs, and remove any extra Force HTTPS snippet that is not in this repository.

## Search engines

`robots.txt` allows the public pages and points at `sitemap.xml`. The sitemap lists `/`, `/about.html`, `/privacy.html` and `/terms.html`. `submit-sample.php` and `/_private/` are disallowed. After deploy, submit `https://toonghuri.com/sitemap.xml` in Google Search Console.

## Analytics

No analytics script is loaded. Each public page has two commented snippets at the end of `<head>`:

- Plausible (preferred). Uncomment the one-line script. `data-domain="toonghuri.com"` is the site hostname, not a secret. Create the site in Plausible first. Plausible’s default script does not use cookies.
- Google Analytics 4. Replace both `G-XXXXXXXXXX` placeholders with the measurement ID from the GA4 property, then uncomment that block. Do not invent an ID. GA4 sets cookies.

Enable only one. Before enabling either, update the “Cookies and tracking” section of `privacy.html` so it names the provider. The page currently says the site does not use analytics, which is true while the snippets stay commented.

## Performance

The homepage script is loaded with `defer`. Below-the-fold copies of the poster use `loading="lazy"`. The poster JPEG is unchanged in dimensions (1280×720) and was recompressed at quality 85 (about 293 KB to about 240 KB). The Google Fonts stylesheet uses `media="print"` plus `onload` so it does not block first paint; `noscript` still loads it when JavaScript is off. `.htaccess` asks the server to compress text responses and to cache CSS, JS and images. CSS and JS URLs include `?v=20261103` so a long cache does not pin an old file.
