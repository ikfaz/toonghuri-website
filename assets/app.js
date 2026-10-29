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
  $("youtube-play")?.addEventListener(
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
  $("more-languages")?.addEventListener("click", () => {
    const open = $("more-languages").getAttribute("aria-expanded") !== "true";
    $("more-languages").setAttribute("aria-expanded", String(open));
    $("more-languages").textContent = open ? "Show less" : "+6 more";
    $("extra-languages").hidden = !open;
  });

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
  $("clear-plan")?.addEventListener("click", () => {
    $("sample-plan").value = "Free sample · Help me choose a plan";
    $("selected-plan").hidden = true;
  });

  const form = $("sample-form");
  form?.addEventListener("submit", async (event) => {
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
  $("sample-url")?.addEventListener("input", () =>
    $("sample-url").setCustomValidity(""),
  );
  $("copyright-year").textContent = new Date().getFullYear();
})();
