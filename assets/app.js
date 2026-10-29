(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const menu = $("mobile-nav");
  const toggle = document.querySelector(".menu-toggle");
  const setMenuIcon = (open) =>
    toggle.querySelector("use")?.setAttribute("href", open ? "#i-close" : "#i-menu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    menu.hidden = !open;
    setMenuIcon(open);
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      setMenuIcon(false);
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      setMenuIcon(false);
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
  // Links that point at a FAQ entry (e.g. "where eligible" -> #testing-faq)
  // open that answer instead of landing on a collapsed question.
  const openDetailsFor = (hash) => {
    const target = hash.length > 1 && document.getElementById(hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link) openDetailsFor(link.getAttribute("href"));
  });
  openDetailsFor(location.hash);
  $("copyright-year").textContent = new Date().getFullYear();

  // Mobile sticky CTA: hide it while the hero actions or the sample form are
  // on screen so it never covers the form it points to.
  const mobileCta = $("mobile-cta");
  if (mobileCta && "IntersectionObserver" in window) {
    const watched = [
      document.querySelector(".hero-actions"),
      $("free-sample"),
    ].filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.isIntersecting
          ? visible.add(entry.target)
          : visible.delete(entry.target),
      );
      mobileCta.classList.toggle("is-hidden", visible.size > 0);
    });
    watched.forEach((el) => observer.observe(el));
  }
})();
