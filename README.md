# ToonGhuri Studio

A buildless, responsive website for automated YouTube localization and publishing.

## Run locally

Use a static server for visual review, for example `python -m http.server 8767`. On the existing PHP host, keep `index.html`, `assets/`, `submit-sample.php`, and `.htaccess` together.

## Featured example

The whole page uses the owner-selected Pip the Little Cloud video, `JCj6V_AqaOQ`. Its native **Settings → Audio track** menu provides Arabic, Bangla (original), English (US), French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, and Spanish. The available tracks were checked in the watch-page and embedded-player menus.

The player loads after the visitor presses play. Language chips list the available tracks; YouTube handles actual audio selection and playback. All visual examples use the real Pip still. Title and chapter examples in the service overview are illustrative. There are no waveform measurements or character images from another story. The studio does not offer thumbnail production.

## Simple customer flow

Watch the example, then request a free 90-second sample in 1 language. The paid lineup, in euros and excluding VAT where applicable, is: Pilot €49 one-off (1 episode, up to 20 minutes, 2 languages); Starter €390/month (up to 120 video minutes, 3 languages); Channel €690/month (up to 240 video minutes, 4 languages, marked most popular); Growth €1,090/month (up to 360 video minutes, 6 languages, 48-hour turnaround, 2 extra translated title options per video); Back catalog €690 one-off (20 existing videos, 2 languages). The only add-on is an extra language at +€150/month on monthly plans; for the back catalog, ask us. Larger networks and multiple channels are “Contact us for a quote”, not a plan card. Monthly plans include AI dubbing that keeps original music and effects, .srt captions in the original and each language, translated titles, descriptions and chapters, uploading in the client’s YouTube Studio, a monthly per-language report, and cancel any month. There is no thumbnail work, A/B testing, Shorts add-on, rush fee, native-speaker review, overage price, or 15-language Studio plan. Final totals are confirmed before production; the form is an enquiry, not a checkout.

Production is handled by an AI pipeline with team oversight. The page does not promise manual language review, human voice actors, or native-speaker quality checks.

## Complete service offer

The homepage presents localization (AI dubbing with original music and effects, plus subtitles) and packaging (translated titles, descriptions and chapter timestamps), then uploading in YouTube Studio. Growth is the only plan with a published turnaround: 48 hours. Voices are AI, with a quality check, not human dubbing. The site promises the work, not the views.

## Sample requests

The production page posts JSON to `submit-sample.php`. It reports receipt only after a successful JSON response with `ok: true`. If the endpoint is unavailable, rate-limited, or rejects the payload, it prepares an email for the visitor to send.

The handler checks that the `Origin` (or, if that is missing, the `Referer`) is `toonghuri.com`, `www.toonghuri.com`, or localhost. It validates the YouTube link and email, strips control characters so names cannot break the mail headers, ignores submissions that fill the hidden `tg_leave_blank` honeypot, and allows 5 submissions per IP per hour. Leads are appended to `leads.jsonl` in a `toonghuri-private` directory next to the web root when PHP can create it, and otherwise in `_private/` (denied by `.htaccess`). An older `_leads_submissions.jsonl` in the web root, if one already exists on the server, stays blocked and is no longer written. Notification email still goes to `studio@toonghuri.com`.

The owner-private static review copy uses email delivery because static hosting does not execute PHP. It excludes PHP source and lead logs. Keep the production `.htaccess` file alongside the PHP endpoint.

## Dependencies

No build step or frontend package installation is needed. Fonts load from Google Fonts. Video playback uses YouTube. Supporting images use the same featured Pip still.

## Promises

The site promises deliverables, not outcomes. It states plainly that views are not guaranteed, and the FAQ explains how the package differs from YouTube's automatic dubbing. Growth is the only plan with a published turnaround (48 hours). No redo or results guarantee is published.

## Trust pages

`about.html`, `privacy.html` and `terms.html` share the homepage header, footer and stylesheet, and are linked from every footer and from the sample form's small print. The privacy policy describes what `submit-sample.php` actually collects (link, email, optional name/channel, languages, selected plan, timestamp and IP address), stored in the protected `_leads_submissions.jsonl` log and emailed to the studio inbox. It also lists Google Fonts, the click-to-load YouTube player and Google AI services.

Privacy and terms are **templates**: review them (ideally with a lawyer) before relying on them. All placeholders have been filled; search the HTML for `[[` to confirm none remain.

The site presents ToonGhuri Studio as an agency: no personal names are published. Legal pages identify the operating business entity only.

## Legal details to revisit

- Business address published: Sofias Sliman 30, 11526 Ambelokipi, Athens, Greece. When the business is registered, add the registered business name, tax number (AFM) and VAT status to privacy.html and terms.html.
- Privacy states the Gemini API paid tier is used for client work; free-tier keys must not process client videos.
- Defaults chosen for review: lead retention 12 months, production files 90 days after delivery, Stripe invoices due on receipt, trial paid upfront, monthly plans billed in advance and cancellable at month end.

Prices are published in euros (EUR). Prices exclude VAT where applicable. The free sample is one 90-second dub in one language.

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
