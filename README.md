# ToonGhuri Studio

A buildless, responsive website for automated YouTube localization, publishing and managed title/thumbnail testing.

## Run locally

Use a static server for visual review, for example `python -m http.server 8767`. On the existing PHP host, keep `index.html`, `assets/`, `submit-sample.php`, and `.htaccess` together.

## Featured example

The whole page uses the owner-selected Pip the Little Cloud video, `JCj6V_AqaOQ`. Its native **Settings → Audio track** menu provides Arabic, Bangla (original), English (US), French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, and Spanish. The available tracks were checked in the watch-page and embedded-player menus.

The player loads after the visitor presses play. Language chips list the available tracks; YouTube handles actual audio selection and playback. All visual examples use the real Pip thumbnail. Title variants, chapter times and thumbnail crops in the service overview are explicitly illustrative; they do not claim to be published assets or test results. There are no waveform measurements or character images from another story.

## Simple customer flow

Watch the example, get a free 90-second sample (once per new customer), then try one full video for €39 (up to 10 minutes, 3 additional languages). The main offer is monthly: Channel plan €590/month (4 videos) and Growth plan €990/month (8 videos), each up to 10 minutes in 3 additional languages with the full package and a monthly per-language results report. Larger libraries, longer videos and more languages are quoted. Strategy: a few monthly clients (about 5-9) to reach €5,000/month, not many one-off videos, so dubbing-only pricing is no longer advertised. Run tools/job_cost_calculator.py in the pipeline workspace to check margins. Final totals are confirmed before production; the form is an enquiry, not a checkout.

Production is handled by an AI pipeline with team oversight. The page does not promise manual language review, human voice actors, or native-speaker quality checks.

## Complete service offer

The homepage gives equal emphasis to localization (dubbing, music/effects and subtitles), packaging (translated titles, descriptions and chapter timestamps), and managed testing (three text-free thumbnail variants, title variants, test setup and results review). YouTube Studio publishing includes the agreed assets; end screens, info cards and pinned comments can be included in the package.

The owner confirmed that agents both set up tests and review outcomes, and moved to a monthly-plan model (€39 trial video, €590 and €990 monthly plans). Native YouTube testing is described as eligibility-dependent, with a linked FAQ covering restrictions and inconclusive results. The full package includes dubbing, subtitles, translated titles/descriptions, timestamps, three thumbnail variants, title variants, publishing, and eligible test setup and results review. Monthly plans are cancel-any-month; additional scope is quote-based; no turnaround guarantee is published.

## Sample requests

The production page posts JSON to the existing `submit-sample.php` endpoint. It reports receipt only after a successful JSON response with `ok: true`. If the endpoint is unavailable, it prepares an email for the visitor to send.

The owner-private static review copy uses email delivery because static hosting does not execute PHP. It excludes PHP source and lead logs. Keep the production `.htaccess` file alongside the PHP endpoint to protect the existing lead log.

## Dependencies

No build step or frontend package installation is needed. Fonts load from Google Fonts. Video playback uses YouTube. Supporting images use the same featured Pip thumbnail.

## Promises

The site promises deliverables, not outcomes. It states plainly that views are not guaranteed, and the FAQ explains how the package differs from YouTube's automatic dubbing. No turnaround, redo or results guarantee is published.

## Trust pages

`about.html`, `privacy.html` and `terms.html` share the homepage header, footer and stylesheet, and are linked from every footer and from the sample form's small print. The privacy policy describes what `submit-sample.php` actually collects (link, email, optional name/channel, languages, selected plan, timestamp and IP address), stored in the protected `_leads_submissions.jsonl` log and emailed to the studio inbox. It also lists Google Fonts, the click-to-load YouTube player and Google AI services.

Privacy and terms are **templates**: review them (ideally with a lawyer) before relying on them. All placeholders have been filled.


Placeholders render as yellow highlights; search the HTML for `[[` to confirm none remain.

The site presents ToonGhuri Studio as an agency: no personal names are published. Legal pages identify the operating business entity only.

## Legal details to revisit

- Business address published: Sofias Sliman 30, 11526 Ambelokipi, Athens, Greece. When the business is registered, add the registered business name, tax number (AFM) and VAT status to privacy.html and terms.html.
- Privacy states the Gemini API paid tier is used for client work; free-tier keys must not process client videos.
- Defaults chosen for review: lead retention 12 months, production files 90 days after delivery, Stripe invoices due on receipt, trial paid upfront, monthly plans billed in advance and cancellable at month end.
