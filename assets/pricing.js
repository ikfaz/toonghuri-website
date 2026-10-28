(function (root) {
  "use strict";
  function calculateQuote(input) {
    const clamp = (value, min, max) =>
      Math.min(max, Math.max(min, Number(value) || min));
    const videos = Math.round(clamp(input.videos, 1, 50));
    const minutes = Math.round(clamp(input.minutes, 5, 60));
    const languages = Math.round(clamp(input.languages, 2, 100));
    const sourceMinutes = videos * minutes;
    const tier1 = Math.min(languages, 12);
    const tier2 = Math.max(0, Math.min(languages - 12, 18));
    const tier3 = Math.max(0, languages - 30);
    let rate = 1 + tier1 * 0.19 + tier2 * 0.14 + tier3 * 0.1;
    if (input.seo) rate += tier1 * 0.025 + tier2 * 0.015 + tier3 * 0.01;
    const multiplier =
      sourceMinutes >= 600
        ? 0.72
        : sourceMinutes >= 300
          ? 0.82
          : sourceMinutes >= 150
            ? 0.92
            : 1;
    let raw = sourceMinutes * rate * multiplier;
    if (input.thumbnails) raw += videos * 12;
    if (input.upload) raw += videos * 8;
    if (input.billing === "onetime") raw *= 1.15;
    const price = Math.max(45, Math.round(raw / 5) * 5);
    const dubbedMinutes = sourceMinutes * languages;
    return {
      videos,
      minutes,
      languages,
      sourceMinutes,
      dubbedMinutes,
      price,
      hours: dubbedMinutes / 60,
      rate: price / dubbedMinutes,
      billing: input.billing === "onetime" ? "onetime" : "monthly",
      upload: !!input.upload,
      seo: !!input.seo,
      thumbnails: !!input.thumbnails,
    };
  }
  if (typeof module !== "undefined" && module.exports)
    module.exports = { calculateQuote };
  else root.ToonGhuriPricing = { calculateQuote };
})(typeof window !== "undefined" ? window : globalThis);
