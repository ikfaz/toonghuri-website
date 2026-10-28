# ToonGhuri Studio

A buildless, responsive homepage for YouTube dubbing and localization.

## Run locally

Use a static server for visual review, for example `python -m http.server 8767`. On the existing PHP host, keep `index.html`, `assets/`, `submit-sample.php`, and `.htaccess` together.

## Featured video

The homepage embeds the owner-selected YouTube video `JCj6V_AqaOQ` (Pip the Little Cloud). The player loads after a visitor presses play. Its native **Settings → Audio track** menu provides Arabic, Bangla (original), English (US), French, German, Hindi, Indonesian, Italian, Japanese, Portuguese, and Spanish. These tracks were verified in the watch-page and embedded-player menus.

Language chips list available tracks; they do not pretend to change the embedded player's audio. YouTube handles track choice, seeking, captions, and playback.

The supporting Patapukur stills and waveform data come from the owner's supplied local media. The localized title and Studio delivery panels are labeled examples.

## Sample requests

The production page posts JSON to the existing `submit-sample.php` endpoint. A request is shown as received only after the endpoint returns a successful JSON response with `ok: true`. If the endpoint is unavailable, the page prepares an email request for the visitor to send. It never silently reports a failed request as received.

The owner-private static review copy uses email delivery because PHP is not executed by static hosting. It does not include the PHP source or lead logs.

## Pricing

The Starter (€600), Growth (€1,000), and Scale (€1,750) monthly plans retain the existing prices and source-minute allowances. Custom pricing retains the original three language tiers, source-minute volume discounts, optional deliverables, minimum price, and 15% one-time multiplier. Run `node tests/pricing.test.cjs` to verify representative cases and tier boundaries.

## Asset and deployment notes

No build step or frontend package installation is needed. Fonts load from Google Fonts. The video loads from YouTube. Keep `.htaccess` alongside the PHP endpoint to protect its existing lead log.

Generated full audio/video clips used during exploration are ignored by Git and excluded from the review copy. The final homepage uses the native YouTube player.
