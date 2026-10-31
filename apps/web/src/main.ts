import {
  embedUrlForStream,
  getConfig,
  getRunOfShow,
  getSegments,
  getSponsors,
  segmentTypeClass,
  type RunOfShowItem,
  type ShowSegment,
  type SiteConfig,
  type Sponsor,
} from "./api";

type Route = "home" | "schedule" | "sponsors" | "segments";

function parseRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/schedule") return "schedule";
  if (path === "/sponsors") return "sponsors";
  if (path === "/segments") return "segments";
  return "home";
}

function navLink(href: string, label: string, active: boolean): string {
  return `<a class="nav-link${active ? " active" : ""}" href="${href}">${label}</a>`;
}

function layout(title: string, body: string, route: Route): string {
  return `
    <div class="ambient"></div>
    <header class="site-header glass">
      <div class="brand">
        <a href="/" class="logo">🌿 Stoner4TheRecord</a>
        <p class="tagline">The Station That Never Stops Smoking.</p>
      </div>
      <nav class="nav">
        ${navLink("/", "Watch Live", route === "home")}
        ${navLink("/schedule", "Schedule", route === "schedule")}
        ${navLink("/sponsors", "Sponsors", route === "sponsors")}
        ${navLink("/segments", "Segments", route === "segments")}
      </nav>
    </header>
    <main class="main">
      <h1 class="page-title">${title}</h1>
      ${body}
    </main>
    <footer class="site-footer glass">
      <p>stoner4therecord.com · Live cannabis culture entertainment network</p>
      <p class="muted">Programming data from official run-of-show v1.1</p>
    </footer>
  `;
}

function renderHome(config: SiteConfig, sponsors: Sponsor[]): string {
  const embed = embedUrlForStream(config.liveStreamUrl);
  const sponsorCards = sponsors
    .slice(0, 3)
    .map(
      (s) => `
      <article class="card sponsor-card">
        <span class="pill">${s.category ?? "Partner"}</span>
        <h3>${s.name}</h3>
        <p>${s.description ?? ""}</p>
        ${s.promo_code ? `<p class="promo">Code: <strong>${s.promo_code}</strong></p>` : ""}
      </article>
    `,
    )
    .join("");

  return layout(
    "Live Station",
    `
    <section class="hero glass">
      <div class="live-badge"><span class="dot"></span> LIVE SLOT</div>
      <div class="player-wrap">
        <iframe
          title="Stoner4TheRecord live stream"
          src="${embed}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="hero-meta">
        <div><span class="label">Current segment</span><strong>Chit Chat Smoke Sesh</strong></div>
        <div><span class="label">Official runtime</span><strong>~${Math.floor(config.officialShowRuntimeMinutes / 60)}h ${config.officialShowRuntimeMinutes % 60}m</strong></div>
        <div><span class="label">Pre-show</span><strong>${config.preShowLengthLabel}</strong></div>
      </div>
      <p class="stream-note muted">Stream URL is configured via <code>LIVE_STREAM_URL</code> on the Worker (YouTube Live, Mux, or other embed URL).</p>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Featured Sponsors</h2>
        <a href="/sponsors" class="text-link">View all →</a>
      </div>
      <div class="grid three">${sponsorCards || "<p class='muted'>Connect DATABASE_URL and run seeds to load sponsors.</p>"}</div>
    </section>

    <section class="section glass quick-links">
      <h2>Explore</h2>
      <div class="grid three">
        <a class="card link-card" href="/schedule"><h3>📅 Run of Show</h3><p>Official broadcast timeline with segment lengths.</p></a>
        <a class="card link-card" href="/segments"><h3>🎮 Stoner Games</h3><p>Bingo, trivia, Wheel of Weed, and more.</p></a>
        <a class="card link-card" href="/sponsors"><h3>🎙️ Live Sponsors</h3><p>Every spotlight is live — no prerecorded ads.</p></a>
      </div>
    </section>
    `,
    "home",
  );
}

function renderSchedule(items: RunOfShowItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr class="${item.is_pre_show ? "pre-show" : ""}">
        <td>${item.is_pre_show ? "Pre" : item.sort_order}</td>
        <td>${item.segment_name}</td>
        <td><span class="pill ${segmentTypeClass(item.segment_type)}">${item.segment_type}</span></td>
        <td>${item.length_label ?? (item.length_minutes != null ? `${item.length_minutes} min` : "—")}</td>
      </tr>
    `,
    )
    .join("");

  return layout(
    "Broadcast Schedule",
    `
    <p class="lede">Official live broadcast format (~4 hours 6 minutes excluding pre-show). Segment lengths are flexible per episode; sponsor slots are always live.</p>
    <div class="table-wrap glass">
      <table class="schedule-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Segment</th>
            <th>Type</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="4">No schedule data — run migrations and seed.</td></tr>`}</tbody>
      </table>
    </div>
    `,
    "schedule",
  );
}

function renderSponsors(sponsors: Sponsor[]): string {
  const cards = sponsors
    .map(
      (s) => `
      <article class="card sponsor-card">
        <div class="card-top">
          <span class="pill">${s.category ?? "Partner"}</span>
          ${s.is_featured ? '<span class="pill featured">Featured</span>' : ""}
        </div>
        <h3>${s.name}</h3>
        <p>${s.description ?? ""}</p>
        ${s.promo_code ? `<p class="promo">Promo: <strong>${s.promo_code}</strong></p>` : ""}
        ${s.website_url ? `<a class="text-link" href="${s.website_url}" target="_blank" rel="noopener noreferrer">Visit partner site</a>` : ""}
      </article>
    `,
    )
    .join("");

  return layout(
    "Sponsors",
    `
    <p class="lede">Live Sponsor Spotlights (8 minutes) appear after every Chit Chat Smoke Sesh and before DJ sets, comedy, and games. No prerecorded commercials.</p>
    <div class="grid two">${cards || "<p class='muted'>No sponsors in database yet.</p>"}</div>
    `,
    "sponsors",
  );
}

function renderSegments(segments: ShowSegment[]): string {
  const byCategory = segments.reduce<Record<string, ShowSegment[]>>((acc, seg) => {
    (acc[seg.category] ??= []).push(seg);
    return acc;
  }, {});

  const sections = Object.entries(byCategory)
    .map(
      ([category, list]) => `
      <section class="section">
        <h2>${category}</h2>
        <div class="grid two">
          ${list
            .map(
              (s) => `
            <article class="card">
              <h3>${s.name}</h3>
              <p>${s.description ?? ""}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </section>
    `,
    )
    .join("");

  return layout(
    "Show Segments",
    `
    <p class="lede">Programming blocks from the official show format — from the Smoke Sesh hub to the one-hour Stoner Games block.</p>
    ${sections || "<p class='muted'>No segment catalog loaded.</p>"}
    `,
    "segments",
  );
}

function renderError(message: string): string {
  return layout(
    "Something went wrong",
    `<div class="error glass"><p>${message}</p><p class="muted">Ensure the API Worker is running and DATABASE_URL is set for data routes.</p></div>`,
    "home",
  );
}

async function render() {
  const route = parseRoute();
  const root = document.getElementById("app");
  if (!root) return;

  root.innerHTML = `<div class="loading glass">Tuning in…</div>`;

  try {
    const config = await getConfig();
    let html = "";
    if (route === "home") {
      let sponsors: Sponsor[] = [];
      try {
        const res = await getSponsors(true);
        sponsors = res.sponsors;
      } catch {
        sponsors = [];
      }
      html = renderHome(config, sponsors);
    } else if (route === "schedule") {
      const { items } = await getRunOfShow();
      html = renderSchedule(items);
    } else if (route === "sponsors") {
      const { sponsors } = await getSponsors();
      html = renderSponsors(sponsors);
    } else {
      const { segments } = await getSegments();
      html = renderSegments(segments);
    }
    root.innerHTML = html;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    root.innerHTML = renderError(msg);
  }
}

window.addEventListener("popstate", () => void render());
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const anchor = target?.closest("a");
  if (!anchor || anchor.target === "_blank") return;
  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin) return;
  e.preventDefault();
  history.pushState({}, "", url.pathname);
  void render();
});

void render();
