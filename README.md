# ToonGhuri Studio

A buildless, responsive website for automated YouTube localization, publishing and managed title/thumbnail testing.

## Run locally

Use a static server for visual review, for example `python -m http.server 8767`. On the existing PHP host, keep `index.html`, `assets/`, `submit-sample.php`, and `.htaccess` together.

## Featured example

The whole page uses the owner-selected Pip the Little Cloud video, `JCj6V_AqaOQ`. Its native **Settings → Audio track** menu provides Arabic, Bangla (original), English (US), French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, and Spanish. The available tracks were checked in the watch-page and embedded-player menus.

The player loads after the visitor presses play. Language chips list the available tracks; YouTube handles actual audio selection and playback. All visual examples use the real Pip thumbnail. Title variants, chapter times and thumbnail crops in the service overview are explicitly illustrative; they do not claim to be published assets or test results. There are no waveform measurements or character images from another story.

## Simple customer flow

Watch the example, choose a free sample or project quote, then send a video link and target languages. The three offers are a free 90-second sample, a one-video quote, and an ongoing monthly quote. Fixed monthly rates and the previous estimator have been removed from the public page while production costs are being assessed.

Production is handled by the owner’s agents, with owner monitoring when needed. The page does not promise manual language review, human voice actors, or native-speaker quality checks.

## Complete service offer

The homepage gives equal emphasis to localization (dubbing, music/effects and subtitles), packaging (translated titles, descriptions and chapter timestamps), and managed testing (three text-free thumbnail variants, title variants, test setup and results review). YouTube Studio publishing includes the agreed assets; end screens, info cards and pinned comments can be included in the package.

The owner confirmed that agents both set up tests and review outcomes. Native YouTube testing is described as eligibility-dependent, with a linked FAQ covering restrictions and inconclusive results. Pricing remains quote-based: language volume and per-video packaging/testing are separate considerations. No numerical rate has been approved for publication.

## Sample requests

The production page posts JSON to the existing `submit-sample.php` endpoint. It reports receipt only after a successful JSON response with `ok: true`. If the endpoint is unavailable, it prepares an email for the visitor to send.

The owner-private static review copy uses email delivery because static hosting does not execute PHP. It excludes PHP source and lead logs. Keep the production `.htaccess` file alongside the PHP endpoint to protect the existing lead log.

## Dependencies

No build step or frontend package installation is needed. Fonts load from Google Fonts. Video playback uses YouTube. Supporting images use the same featured Pip thumbnail.
