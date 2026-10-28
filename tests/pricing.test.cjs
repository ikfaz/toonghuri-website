const assert = require("node:assert/strict");
const { calculateQuote } = require("../assets/pricing.js");
const base = {
  videos: 8,
  minutes: 30,
  languages: 12,
  seo: true,
  thumbnails: true,
  upload: true,
  billing: "monthly",
};
const monthly = calculateQuote(base);
assert.equal(monthly.price, 950);
assert.equal(monthly.sourceMinutes, 240);
assert.equal(monthly.dubbedMinutes, 2880);
assert.equal(monthly.hours, 48);
assert.equal(calculateQuote({ ...base, billing: "onetime" }).price, 1095);
assert.equal(
  calculateQuote({
    ...base,
    videos: 1,
    minutes: 5,
    languages: 2,
    seo: false,
    thumbnails: false,
    upload: false,
  }).price,
  45,
);
assert.equal(
  calculateQuote({ ...base, videos: 50, minutes: 60, languages: 100 }).price,
  31390,
);
assert.equal(calculateQuote({ ...base, upload: false }).price, 885);
assert.ok(calculateQuote({ ...base, languages: 25 }).price > monthly.price);
assert.equal(calculateQuote({ ...base, languages: 999 }).languages, 100);
assert.equal(calculateQuote({ ...base, languages: 1 }).languages, 2);
console.log(
  "Pricing checks passed: existing default, one-time, minimum, upper tier, add-ons, and input bounds.",
);
