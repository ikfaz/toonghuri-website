(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const menu = $("mobile-nav");
  const toggle = document.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    menu.hidden = !open;
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.focus();
    }
  });

  // YouTube owns audio selection. Its native Settings > Audio track menu
  // exposes the eleven verified tracks without rebuilding their playback.
  $("youtube-play").addEventListener(
    "click",
    () => {
      const frame = document.createElement("iframe");
      const params = new URLSearchParams({
        autoplay: "1",
        rel: "0",
        playsinline: "1",
      });
      frame.src = `https://www.youtube.com/embed/JCj6V_AqaOQ?${params}`;
      frame.title =
        "Pip the Little Cloud — ToonGhuri video with 11 audio languages";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      $("youtube-stage").replaceChildren(frame);
      frame.focus();
    },
    { once: true },
  );
  $("more-languages").addEventListener("click", () => {
    const open = $("more-languages").getAttribute("aria-expanded") !== "true";
    $("more-languages").setAttribute("aria-expanded", String(open));
    $("more-languages").textContent = open ? "Show less" : "+6 more";
    $("extra-languages").hidden = !open;
  });

  fetch("assets/waveforms.json")
    .then((response) => {
      if (!response.ok) throw new Error("Waveform unavailable");
      return response.json();
    })
    .then((data) => {
      for (const language of ["bn", "en"]) {
        const element = $("wave-" + language);
        const bars = data[language]
          .filter((value, index) => index % 2 === 0)
          .map((value) => {
            const bar = document.createElement("i");
            bar.style.height = `${Math.max(7, value * 100)}%`;
            return bar;
          });
        element.replaceChildren(...bars);
      }
    })
    .catch(() => {
      document.querySelectorAll(".waveform").forEach((element) => {
        element.textContent = "Audio preview in the featured video";
      });
    });
  const titles = {
    en: "The Missing Village Bell",
    es: "La campana perdida del pueblo",
    ja: "村の消えた鐘",
  };
  document.querySelectorAll("[data-title-language]").forEach((button) =>
    button.addEventListener("click", () => {
      const language = button.dataset.titleLanguage;
      $("localized-title").textContent = titles[language];
      $("localized-title").lang = language;
      document
        .querySelectorAll("[data-title-language]")
        .forEach((peer) =>
          peer.setAttribute("aria-pressed", String(peer === button)),
        );
    }),
  );

  let billing = "monthly";
  const euro = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const number = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 1 });
  function quote() {
    return window.ToonGhuriPricing.calculateQuote({
      videos: $("cb-videos").value,
      minutes: $("cb-minutes").value,
      languages: $("cb-languages").value,
      seo: $("cb-seo").checked,
      thumbnails: $("cb-thumbnails").checked,
      upload: $("cb-upload").checked,
      billing,
    });
  }
  function updateQuote() {
    const q = quote();
    $("cb-videos-value").textContent =
      `${q.videos} ${q.videos === 1 ? "video" : "videos"}`;
    $("cb-minutes-value").textContent = `${q.minutes} minutes`;
    $("cb-languages-value").textContent = `${q.languages} languages`;
    $("cb-price").textContent = euro.format(q.price);
    $("cb-volume").textContent = `${number.format(q.sourceMinutes)} minutes`;
    $("cb-language-total").textContent = q.languages;
    $("cb-output").textContent = `${number.format(q.hours)} hours`;
    $("cb-delivery").textContent = q.upload ? "YouTube Studio" : "Google Drive";
    $("cb-rate").textContent = `€${q.rate.toFixed(2)} per dubbed minute`;
    $("cb-price-suffix").textContent =
      billing === "monthly" ? "/ month" : "one-time";
    $("cb-type-label").textContent =
      billing === "monthly"
        ? "YOUR CUSTOM MONTHLY PLAN"
        : "YOUR CUSTOM ONE-TIME OFFER";
    $("cb-videos-label").textContent =
      billing === "monthly" ? "Videos per month" : "Number of videos";
    document
      .querySelectorAll("[data-count]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.count) === q.languages),
        ),
      );
  }
  [
    "cb-videos",
    "cb-minutes",
    "cb-languages",
    "cb-seo",
    "cb-thumbnails",
    "cb-upload",
  ].forEach((id) => $(id).addEventListener("input", updateQuote));
  document.querySelectorAll("[data-billing]").forEach((button) =>
    button.addEventListener("click", () => {
      billing = button.dataset.billing;
      document
        .querySelectorAll("[data-billing]")
        .forEach((peer) =>
          peer.setAttribute("aria-pressed", String(peer === button)),
        );
      updateQuote();
    }),
  );
  document.querySelectorAll("[data-count]").forEach((button) =>
    button.addEventListener("click", () => {
      $("cb-languages").value = button.dataset.count;
      updateQuote();
    }),
  );
  updateQuote();

  function setPlan(text) {
    $("sample-plan").value = text;
    $("selected-plan-text").textContent = text;
    $("selected-plan").hidden = false;
  }
  document
    .querySelectorAll("[data-plan]")
    .forEach((link) =>
      link.addEventListener("click", () => setPlan(link.dataset.plan)),
    );
  $("select-custom").addEventListener("click", () => {
    const q = quote();
    const deliverables = [
      q.seo ? "Subtitles + translated titles/chapters" : "",
      q.thumbnails ? "3 thumbnails/video" : "",
      q.upload ? "Studio upload" : "Drive delivery",
    ]
      .filter(Boolean)
      .join(" · ");
    setPlan(
      `Custom ${q.billing === "monthly" ? "monthly" : "one-time"} · ${euro.format(q.price)} · ${q.videos} videos × ${q.minutes} minutes · ${q.languages} languages · ${deliverables}`,
    );
  });
  $("clear-plan").addEventListener("click", () => {
    $("sample-plan").value = "Free sample · Help me choose a plan";
    $("selected-plan").hidden = true;
  });

  const form = $("sample-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const url = new URL($("sample-url").value.trim());
    if (
      !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
        url.hostname.toLowerCase(),
      ) ||
      !["http:", "https:"].includes(url.protocol)
    ) {
      $("sample-url").setCustomValidity(
        "Please enter a YouTube video or channel link.",
      );
      $("sample-url").reportValidity();
      return;
    }
    const payload = {
      plan: $("sample-plan").value,
      url: url.href,
      contact: $("sample-contact").value.trim(),
      channel: $("sample-channel").value.trim() || "Not provided",
      length: "Not provided",
      customNotes: "Preferred languages: " + $("sample-languages").value.trim(),
    };
    const emailBody = `Hi ToonGhuri Studio,\n\nI'd like a free 90-second sample.\n\nVideo/channel: ${payload.url}\nName/channel: ${payload.channel}\nContact: ${payload.contact}\n${payload.customNotes}\nPlan: ${payload.plan}\n`;
    $("email-request").href =
      "mailto:studio@toonghuri.com?" +
      new URLSearchParams({
        subject: "Free dubbing sample — " + payload.channel,
        body: emailBody,
      })
        .toString()
        .replace(/\+/g, "%20");
    const submit = $("sample-submit");
    const originalContent = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = "Preparing your request…";
    $("form-result").hidden = true;
    try {
      if (form.dataset.delivery === "email") throw new Error("Email delivery");
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      )
        throw new Error("Request not confirmed");
      const result = await response.json();
      if (result.ok !== true) throw new Error("Request not confirmed");
      $("form-result-text").textContent =
        "Your sample request has been received. We’ll follow up at the email you provided.";
      $("email-request").hidden = true;
    } catch (_) {
      $("form-result-text").textContent =
        "Your request is ready. Send it by email below to complete your sample request.";
      $("email-request").hidden = false;
    } finally {
      submit.disabled = false;
      submit.innerHTML = originalContent;
      $("form-result").hidden = false;
    }
  });
  $("sample-url").addEventListener("input", () =>
    $("sample-url").setCustomValidity(""),
  );
  $("copyright-year").textContent = new Date().getFullYear();
})();
