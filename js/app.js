(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../../cms-site/js/cms-source.js
  var cms_source_exports = {};
  __export(cms_source_exports, {
    BLOCK_TYPES: () => BLOCK_TYPES,
    HOME_SECTIONS: () => HOME_SECTIONS,
    NAV_ITEMS: () => NAV_ITEMS,
    buttonText: () => buttonText,
    getCMS: () => getCMS,
    imagePath: () => imagePath,
    renderBlocks: () => renderBlocks,
    safeLink: () => safeLink,
    validateCMS: () => validateCMS
  });
  var NAV_ITEMS = [
    ["home", "Ana s\u0259hif\u0259", "index.html"],
    ["games", "Oyunlar", "oyunlar.html"],
    ["table", "C\u0259dv\u0259l", "cedvel.html"],
    ["teams", "Komandalar", "komandalar.html"],
    ["players", "Futbol\xE7ular", "futbolcular.html"],
    ["scorers", "Bombardirl\u0259r", "bombardirler.html"],
    ["stats", "Statistika", "statistika.html"],
    ["media", "Media", "media.html"],
    ["news", "X\u0259b\u0259rl\u0259r", "xeberler.html"],
    ["about", "Haqq\u0131m\u0131zda", "haqqimizda.html"],
    ["playoffs", "Yar\u0131mfinal", "merhele.html"],
    ["compare", "M\xFCqayis\u0259", "muqayise.html"]
  ];
  var HOME_SECTIONS = [["pulse", "Liqa r\u0259q\u0259ml\u0259ri"], ["results", "Son n\u0259tic\u0259l\u0259r"], ["fixtures", "N\xF6vb\u0259ti oyunlar"], ["table", "Turnir c\u0259dv\u0259li"], ["videos", "Videolar"], ["scorers", "Bombardirl\u0259r"], ["teams", "Komandalar"], ["news", "X\u0259b\u0259rl\u0259r"], ["mvp", "\u018Fn yax\u015F\u0131 oyun\xE7ular"]];
  var BLOCK_TYPES = [["heading", "Ba\u015Fl\u0131q"], ["paragraph", "M\u0259tn"], ["image", "\u015E\u0259kil"], ["quote", "Sitat"], ["list", "Siyah\u0131"], ["button", "D\xFCym\u0259 / ke\xE7id"], ["divider", "Ay\u0131r\u0131c\u0131"]];
  function buttonText(color2) {
    const c = color2.slice(1).match(/../g).map((v) => parseInt(v, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const luminance = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return 1.05 / (luminance + 0.05) > (luminance + 0.05) / 0.05 ? "#ffffff" : "#071128";
  }
  __name(buttonText, "buttonText");
  function getCMS(data) {
    const site = data.site || {}, cms = data.cms || {};
    const defaults = {
      home: { title: "", highlight: "", buttonLabel: "Oyunlar v\u0259 n\u0259tic\u0259l\u0259r", buttonUrl: "/oyunlar.html", image: "", announcement: "", announcementUrl: "", sections: HOME_SECTIONS.map(([id]) => ({ id, visible: true })) },
      about: { title: "Liqa haqq\u0131nda", subtitle: "Sumqay\u0131tdan ba\u015Flayan mini futbol hekay\u0259si.", heading: "BU \u015E\u018FH\u018FRD\u018F OYUN B\u0130TM\u0130R.", image: "", blocks: [{ id: "about-note-heading", type: "heading", text: "R\u0259q\u0259ml\u0259r, r\u0259qab\u0259t v\u0259 icma", url: "", alt: "", level: 2 }, { id: "about-note-text", type: "paragraph", text: "Bu platformada turnir c\u0259dv\u0259li, b\xFCt\xFCn komandalar\u0131n hey\u0259tl\u0259ri, futbol\xE7ular, oyun statistikas\u0131 v\u0259 video arxivi bir arada toplan\u0131r. Oyun tarixl\u0259ri v\u0259 n\u0259tic\u0259l\u0259r saytdak\u0131 m\xF6vs\xFCm m\u0259lumatlar\u0131ndan avtomatik yarad\u0131l\u0131r.", url: "", alt: "", level: 2 }] },
      appearance: { background: "#f4f6fa", surface: "#ffffff", text: "#172640", muted: "#627189", font: "manrope", headingFont: "barlow", radius: 18, width: 1320 },
      branding: { logo: "/assets/logo.png", footerText: "Sumqay\u0131t\u0131n mini futbol h\u0259y\u0259can\u0131. Oyunlar, statistika, komandalar v\u0259 media bir m\u0259kanda.", copyright: "B\xFCt\xFCn h\xFCquqlar qorunur." },
      seo: { title: site.name || "", description: (site.hero || "").slice(0, 500), image: "" },
      navigation: NAV_ITEMS.map(([id, label]) => ({ id, label, visible: true })),
      pages: [],
      media: []
    };
    for (const key of ["home", "about", "appearance", "branding", "seo"]) defaults[key] = { ...defaults[key], ...cms[key] || {} };
    for (const key of ["navigation", "pages", "media"]) if (Array.isArray(cms[key])) defaults[key] = cms[key];
    if (Array.isArray(cms.navigation)) defaults.navigation = [...cms.navigation, ...NAV_ITEMS.filter(([id]) => !cms.navigation.some((n) => n.id === id)).map(([id, label]) => ({ id, label, visible: true }))];
    return defaults;
  }
  __name(getCMS, "getCMS");
  var object = /* @__PURE__ */ __name((x) => x && typeof x === "object" && !Array.isArray(x), "object");
  var keys = /* @__PURE__ */ __name((x, names) => object(x) && Object.keys(x).every((k) => names.includes(k)), "keys");
  var text = /* @__PURE__ */ __name((x, max = 300, required = false) => typeof x === "string" && x.length <= max && (!required || x.trim()) && !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x), "text");
  var ident = /* @__PURE__ */ __name((x) => typeof x === "string" && /^[a-z0-9][a-z0-9_-]{0,79}$/.test(x), "ident");
  var color = /* @__PURE__ */ __name((x) => typeof x === "string" && /^#[a-fA-F0-9]{6}$/.test(x), "color");
  var date = /* @__PURE__ */ __name((x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x + "T00:00:00Z")) && (/* @__PURE__ */ new Date(x + "T00:00:00Z")).toISOString().slice(0, 10) === x, "date");
  var imagePath = /* @__PURE__ */ __name((x) => x === "" || typeof x === "string" && /^\/assets\/(?:logo\.png|logos\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp))$/.test(x), "imagePath");
  function safeLink(x) {
    if (x === "") return true;
    if (typeof x !== "string" || !text(x, 1e3)) return false;
    if (/^\/(?:[a-z0-9_-]+\.html(?:\?[a-zA-Z0-9_%=&.-]*)?|sehife\/[a-z0-9][a-z0-9-]{0,79})$/.test(x) || x === "/") return true;
    try {
      const u = new URL(x);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }
  __name(safeLink, "safeLink");
  function validateCMS(cms) {
    const errors = [], check = /* @__PURE__ */ __name((ok, msg) => {
      if (!ok && errors.length < 30) errors.push(msg);
      return ok;
    }, "check");
    if (!check(keys(cms, ["home", "about", "appearance", "branding", "seo", "navigation", "pages", "media"]), "Redaktorun m\u0259lumat qurulu\u015Fu d\xFCzg\xFCn deyil.")) return errors;
    const H = cms.home, A = cms.about, T = cms.appearance, B = cms.branding, S = cms.seo;
    if (check(keys(H, ["title", "highlight", "buttonLabel", "buttonUrl", "image", "announcement", "announcementUrl", "sections"]), "Ana s\u0259hif\u0259 ayarlar\u0131 d\xFCzg\xFCn deyil.")) {
      check(text(H.title, 100) && text(H.highlight, 100) && text(H.buttonLabel, 80, true) && safeLink(H.buttonUrl) && !!H.buttonUrl && imagePath(H.image) && text(H.announcement, 300) && safeLink(H.announcementUrl), "Ana s\u0259hif\u0259d\u0259 m\u0259tn v\u0259 ya ke\xE7id d\xFCzg\xFCn deyil.");
      check(Array.isArray(H.sections) && H.sections.length === HOME_SECTIONS.length && new Set(H.sections.map((s) => s?.id)).size === HOME_SECTIONS.length && H.sections.every((s) => keys(s, ["id", "visible"]) && HOME_SECTIONS.some(([id]) => id === s.id) && typeof s.visible === "boolean"), "Ana s\u0259hif\u0259nin b\xF6lm\u0259l\u0259ri d\xFCzg\xFCn deyil.");
    }
    const blocks = /* @__PURE__ */ __name((items, label) => {
      if (!check(Array.isArray(items) && items.length <= 80, label + ": \u0259n \xE7ox 80 blok olmal\u0131d\u0131r.")) return;
      const ids = /* @__PURE__ */ new Set();
      items.forEach((b) => {
        if (!check(keys(b, ["id", "type", "text", "url", "alt", "level"]), label + ": blok d\xFCzg\xFCn deyil.")) return;
        check(ident(b.id) && !ids.has(b.id) && BLOCK_TYPES.some(([type]) => type === b.type) && text(b.text, 12e3) && text(b.alt, 300) && [2, 3, 4].includes(b.level), label + ": blokun m\u0259tni v\u0259 ya n\xF6v\xFC d\xFCzg\xFCn deyil.");
        ids.add(b.id);
        check(b.type === "image" ? imagePath(b.url) && !!b.url : b.type === "button" ? safeLink(b.url) && !!b.url : b.url === "", label + ": blokun ke\xE7idi d\xFCzg\xFCn deyil.");
      });
    }, "blocks");
    if (check(keys(A, ["title", "subtitle", "heading", "image", "blocks"]), "Haqq\u0131m\u0131zda ayarlar\u0131 d\xFCzg\xFCn deyil.")) {
      check(text(A.title, 160, true) && text(A.subtitle, 500) && text(A.heading, 200, true) && imagePath(A.image), "Haqq\u0131m\u0131zda ba\u015Fl\u0131\u011F\u0131 v\u0259 ya \u015F\u0259kli d\xFCzg\xFCn deyil.");
      blocks(A.blocks, "Haqq\u0131m\u0131zda");
    }
    if (check(keys(T, ["background", "surface", "text", "muted", "font", "headingFont", "radius", "width"]), "Dizayn ayarlar\u0131 d\xFCzg\xFCn deyil.")) check(["background", "surface", "text", "muted"].every((k) => color(T[k])) && ["manrope", "montserrat", "system", "georgia"].includes(T.font) && ["barlow", "montserrat", "system", "georgia"].includes(T.headingFont) && Number.isInteger(T.radius) && T.radius >= 0 && T.radius <= 32 && Number.isInteger(T.width) && T.width >= 960 && T.width <= 1600, "Dizayn r\u0259ngl\u0259ri, \u015Frift v\u0259 ya \xF6l\xE7\xFCl\u0259r d\xFCzg\xFCn deyil.");
    if (check(keys(B, ["logo", "footerText", "copyright"]), "Loqo v\u0259 alt hiss\u0259 ayarlar\u0131 d\xFCzg\xFCn deyil.")) check(imagePath(B.logo) && !!B.logo && text(B.footerText, 1500) && text(B.copyright, 300), "Loqo v\u0259 alt hiss\u0259 m\u0259tnl\u0259ri d\xFCzg\xFCn deyil.");
    if (check(keys(S, ["title", "description", "image"]), "Axtar\u0131\u015F ayarlar\u0131 d\xFCzg\xFCn deyil.")) check(text(S.title, 160) && text(S.description, 500) && imagePath(S.image), "Axtar\u0131\u015F ba\u015Fl\u0131\u011F\u0131, t\u0259sviri v\u0259 ya \u015F\u0259kli d\xFCzg\xFCn deyil.");
    check(Array.isArray(cms.navigation) && cms.navigation.length >= 10 && cms.navigation.length <= NAV_ITEMS.length && new Set(cms.navigation.map((n) => n?.id)).size === cms.navigation.length && NAV_ITEMS.slice(0, 10).every(([id]) => cms.navigation.some((n) => n?.id === id)) && cms.navigation.every((n) => keys(n, ["id", "label", "visible"]) && NAV_ITEMS.some(([id]) => id === n.id) && text(n.label, 50, true) && typeof n.visible === "boolean"), "Sayt menyusu d\xFCzg\xFCn deyil.");
    if (check(Array.isArray(cms.pages) && cms.pages.length <= 50, "\u018Fn \xE7ox 50 \u0259lav\u0259 s\u0259hif\u0259 olmal\u0131d\u0131r.")) {
      const ids = /* @__PURE__ */ new Set(), slugs = /* @__PURE__ */ new Set();
      cms.pages.forEach((p) => {
        if (!check(keys(p, ["id", "slug", "title", "description", "published", "showInMenu", "menuLabel", "blocks"]), "S\u0259hif\u0259nin qurulu\u015Fu d\xFCzg\xFCn deyil.")) return;
        check(ident(p.id) && !ids.has(p.id) && typeof p.slug === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(p.slug) && !slugs.has(p.slug) && text(p.title, 160, true) && text(p.description, 500) && typeof p.published === "boolean" && typeof p.showInMenu === "boolean" && text(p.menuLabel, 50, true), "S\u0259hif\u0259nin \xFCnvan\u0131, ad\u0131 v\u0259 ya statusu d\xFCzg\xFCn deyil.");
        ids.add(p.id);
        slugs.add(p.slug);
        blocks(p.blocks, "S\u0259hif\u0259");
      });
    }
    if (check(Array.isArray(cms.media) && cms.media.length <= 200, "Media kitabxanas\u0131nda \u0259n \xE7ox 200 \u015F\u0259kil ola bil\u0259r.")) {
      const urls = /* @__PURE__ */ new Set();
      cms.media.forEach((m) => {
        check(keys(m, ["url", "title", "alt", "date"]) && imagePath(m.url) && !!m.url && !urls.has(m.url) && text(m.title, 160, true) && text(m.alt, 300) && date(m.date), "Media \u015F\u0259kli v\u0259 ya m\u0259lumat\u0131 d\xFCzg\xFCn deyil.");
        urls.add(m?.url);
      });
    }
    return errors;
  }
  __name(validateCMS, "validateCMS");
  var escape = /* @__PURE__ */ __name((x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "escape");
  function renderBlocks(blocks) {
    return (blocks || []).map((b) => {
      const t = escape(b.text).replace(/\n/g, "<br>");
      if (b.type === "heading") return `<h${b.level}>${t}</h${b.level}>`;
      if (b.type === "paragraph") return `<p>${t}</p>`;
      if (b.type === "quote") return `<blockquote>${t}</blockquote>`;
      if (b.type === "list") return `<ul>${b.text.split("\n").filter((x) => x.trim()).map((x) => `<li>${escape(x)}</li>`).join("")}</ul>`;
      if (b.type === "image") return imagePath(b.url) ? `<figure><img src="${escape(b.url)}" alt="${escape(b.alt)}" loading="lazy">${b.text ? `<figcaption>${t}</figcaption>` : ""}</figure>` : "";
      if (b.type === "button") return safeLink(b.url) ? `<p><a class="btn pri" href="${escape(b.url)}" rel="noopener noreferrer">${t || "Ke\xE7id"}</a></p>` : "";
      return b.type === "divider" ? "<hr>" : "";
    }).join("");
  }
  __name(renderBlocks, "renderBlocks");

  // ../../cms-site/js/league-source.js
  var playerName = /* @__PURE__ */ __name((s) => String(s || "").normalize("NFC").replace(/\s*\((?:kapitan|qk|v\s*\/\s*k)\)\s*/gi, " ").replace(/\s+/g, " ").trim(), "playerName");
  var playerKey = /* @__PURE__ */ __name((s) => playerName(s).toLocaleLowerCase("az").split(" ").sort().join(" "), "playerKey");
  function matchStage(m) {
    return m.stage || (/yarımfinal/i.test(m.leg || "") ? "semifinal" : /\bfinal\b/i.test(m.leg || "") ? "final" : "group");
  }
  __name(matchStage, "matchStage");
  var creditedTeam = /* @__PURE__ */ __name((m, g) => g.og ? g.t === m.home ? m.away : m.home : g.t, "creditedTeam");
  function standings(league, group) {
    const teams = league.teams.filter((t) => t.group === group), by = new Map(teams.map((t) => [t.id, { id: t.id, o: 0, q: 0, h: 0, m: 0, vq: 0, bq: 0 }]));
    const matches = league.matches.filter((m) => m.status === "done" && matchStage(m) === "group");
    for (const m of matches) {
      const h = by.get(m.home), a = by.get(m.away);
      if (!h || !a) continue;
      h.o++;
      a.o++;
      h.vq += m.hs;
      h.bq += m.as;
      a.vq += m.as;
      a.bq += m.hs;
      if (m.hs > m.as) {
        h.q++;
        a.m++;
      } else if (m.hs < m.as) {
        a.q++;
        h.m++;
      } else {
        h.h++;
        a.h++;
      }
    }
    const rows = [...by.values()];
    rows.forEach((r) => {
      r.x = r.q * 3 + r.h;
      r.tf = r.vq - r.bq;
    });
    const key = /* @__PURE__ */ __name((r) => [r.x, r.tf, r.vq, -r.bq, r.q], "key");
    rows.sort((a, b) => {
      const ak = key(a), bk = key(b);
      for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return bk[i] - ak[i];
      return 0;
    });
    for (let i = 0; i < rows.length; ) {
      let j = i + 1;
      while (j < rows.length && key(rows[i]).join() === key(rows[j]).join()) j++;
      if (j - i > 1) {
        const tied = rows.slice(i, j), ids = new Set(tied.map((r) => r.id)), h = new Map(tied.map((r) => [r.id, { x: 0, tf: 0, vq: 0 }]));
        for (const m of matches) {
          if (!ids.has(m.home) || !ids.has(m.away)) continue;
          const a = h.get(m.home), b = h.get(m.away);
          a.tf += m.hs - m.as;
          b.tf += m.as - m.hs;
          a.vq += m.hs;
          b.vq += m.as;
          if (m.hs > m.as) a.x += 3;
          else if (m.hs < m.as) b.x += 3;
          else {
            a.x++;
            b.x++;
          }
        }
        tied.sort((a, b) => h.get(b.id).x - h.get(a.id).x || h.get(b.id).tf - h.get(a.id).tf || h.get(b.id).vq - h.get(a.id).vq || teams.find((t) => t.id === a.id).name.localeCompare(teams.find((t) => t.id === b.id).name, "az"));
        rows.splice(i, j - i, ...tied);
      }
      i = j;
    }
    rows.forEach((r, i) => r.rank = i + 1);
    return rows;
  }
  __name(standings, "standings");
  function scorers(league) {
    const names = new Map(league.teams.map((t) => [t.id, new Map(t.players.map((p) => [playerKey(p.name), playerName(p.name)]))])), by = /* @__PURE__ */ new Map();
    for (const m of league.matches.filter((m2) => m2.status === "done")) for (const g of m.goals) {
      if (g.og || g.unk || !g.p) continue;
      const key = playerKey(g.p) + "|" + g.t;
      let row = by.get(key);
      if (!row) {
        row = { p: playerName(g.p), t: g.t, g: 0, games: /* @__PURE__ */ new Set() };
        by.set(key, row);
      }
      row.g++;
      row.games.add(m.id);
    }
    const rows = [...by.values()].map((r) => ({ p: r.p, t: r.t, g: r.g, mp: r.games.size })).sort((a, b) => b.g - a.g || a.mp - b.mp || a.p.localeCompare(b.p, "az"));
    rows.forEach((r) => r.rank = 1 + rows.filter((x) => x.g > r.g).length);
    return rows;
  }
  __name(scorers, "scorers");
  function teamSummary(league, id) {
    const matches = league.matches.filter((m) => m.status === "done" && (m.home === id || m.away === id)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), result = { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0, yellow: 0, red: 0, form: [] };
    for (const m of matches) {
      const own = m.home === id ? m.hs : m.as, opp = m.home === id ? m.as : m.hs;
      result.played++;
      result.goalsFor += own;
      result.goalsAgainst += opp;
      result.wins += own > opp;
      result.draws += own === opp;
      result.losses += own < opp;
      result.cleanSheets += opp === 0;
      result.form.push(own > opp ? "Q" : own < opp ? "M" : "H");
      for (const card of m.cards) if (card.t === id) result[card.c === "r" ? "red" : "yellow"]++;
    }
    result.form = result.form.slice(-5);
    result.average = result.played ? result.goalsFor / result.played : 0;
    return result;
  }
  __name(teamSummary, "teamSummary");
  function headToHead(league, first, second) {
    const matches = league.matches.filter((m) => m.status === "done" && (m.home === first && m.away === second || m.home === second && m.away === first)).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    let firstWins = 0, secondWins = 0, draws = 0, firstGoals = 0, secondGoals = 0;
    for (const m of matches) {
      const a = m.home === first ? m.hs : m.as, b = m.home === second ? m.hs : m.as;
      firstGoals += a;
      secondGoals += b;
      firstWins += a > b;
      secondWins += b > a;
      draws += a === b;
    }
    return { matches, firstWins, secondWins, draws, firstGoals, secondGoals };
  }
  __name(headToHead, "headToHead");
  function competition(league) {
    const state = league.competition || { phase: "group", qualified: [] };
    const group = league.matches.filter((m) => matchStage(m) === "group"), done = group.filter((m) => m.status === "done");
    return { ...state, groupComplete: group.length > 0 && group.length === done.length, groupPlayed: done.length, qualified: state.qualified.filter((id) => league.teams.some((t) => t.id === id)), semifinals: league.matches.filter((m) => matchStage(m) === "semifinal"), finals: league.matches.filter((m) => matchStage(m) === "final") };
  }
  __name(competition, "competition");

  // ../../cms-site/js/arena-views.js
  function installArena(ctx) {
    const { P, L, S, CMS, H, B, T, M, DONE, PLAN, GROUPS, ST, STX, SC, PAGE, NAV, $, $$, esc, fd, fmtShort, ball, mcard, tableHTML, head, sech, formHTML, homeMedia, homeNews, mvps, playerLink } = ctx;
    const state = competition(L), logo = B.logo || "/assets/logo.png", phaseLabel = { group: "Qrup m\u0259rh\u0259l\u0259si", semifinal: "Yar\u0131mfinal", final: "Final", completed: "M\xF6vs\xFCm\xFCn yekunu" }[state.phase], qualified = state.qualified.map((id) => T[id]), goals = DONE.reduce((n, m) => n + m.hs + m.as, 0);
    const brandLabel = S.name === "Sumqay\u0131t Super Liqa" ? "SUMQAYIT<small>SUPER L\u0130QA</small>" : esc(S.name || L.name);
    const favoriteKey = "ssl.favoriteTeam.v1";
    let favorite = "", refreshFavorite = /* @__PURE__ */ __name(() => {
    }, "refreshFavorite");
    try {
      const saved = localStorage.getItem(favoriteKey);
      if (T[saved]) favorite = saved;
    } catch {
    }
    const star = /* @__PURE__ */ __name((id) => `<button class="favorite-button ${favorite === id ? "is-favorite" : ""}" type="button" data-favorite="${id}" aria-pressed="${favorite === id}" aria-label="${esc(T[id].name)} komandas\u0131n\u0131 sevimli se\xE7"><span class="fav-icon" aria-hidden="true">${favorite === id ? "\u2605" : "\u2606"}</span></button>`, "star");
    const groupBadge = /* @__PURE__ */ __name((id) => `<span class="group-badge">QRUP ${esc(T[id].group)}</span>`, "groupBadge");
    const mark = /* @__PURE__ */ __name((id) => state.qualified.includes(id) ? '<span class="qualified-badge">Yar\u0131mfinal\xE7\u0131 \u2197</span>' : "", "mark");
    const stageName = /* @__PURE__ */ __name((m) => matchStage(m) === "group" ? `${m.round}-ci tur` : matchStage(m) === "semifinal" ? "Yar\u0131mfinal" : "Final", "stageName");
    function teamCard(t) {
      const r = STX[t.id], summary = teamSummary(L, t.id);
      return `<article class="tcard club-card" style="--c:${t.color}">${star(t.id)}<a class="tcard-link" href="komanda.html?t=${t.id}"><div class="club-card-top">${groupBadge(t.id)}${mark(t.id)}</div>${ball(t.id, "lg")}<h3>${esc(t.name)}</h3><span class="club-position">${r.rank}-ci yer \xB7 ${r.x} xal</span>${formHTML(t.id)}<div class="club-bottom"><span>${summary.goalsFor}<small>qol</small></span><span>${t.registeredPlayers ?? t.players.length}<small>qeydiyyat</small></span><b>Komandaya bax \u2197</b></div></a></article>`;
    }
    __name(teamCard, "teamCard");
    function qualifierCard(t) {
      const r = STX[t.id];
      return `<a class="qualifier-card" href="komanda.html?t=${t.id}"><div class="qualifier-meta">${groupBadge(t.id)}<span>${r.rank}-ci YER</span></div>${ball(t.id, "lg")}<h3>${esc(t.name)}</h3><div class="qualifier-bottom"><strong>${r.x}<small>XAL</small></strong><span>${r.vq}:${r.bq}<small>QOLLAR</small></span><span class="arrow">\u2197</span></div></a>`;
    }
    __name(qualifierCard, "qualifierCard");
    function phasePanel() {
      return `<div class="phase-track" aria-label="Yar\u0131\u015F\u0131n m\u0259rh\u0259l\u0259l\u0259ri">${[["group", "01", "Qrup m\u0259rh\u0259l\u0259si"], ["semifinal", "02", "Yar\u0131mfinal"], ["final", "03", "Final"]].map(([id, num, label]) => `<div class="phase-step ${id === state.phase ? "current" : ""} ${id === "group" && state.groupComplete ? "finished" : ""}"><span>${num}</span><div><b>${label}</b><small>${id === "group" && state.groupComplete ? "Tamamland\u0131" : id === state.phase ? "Cari m\u0259rh\u0259l\u0259" : "N\xF6vb\u0259ti m\u0259rh\u0259l\u0259"}</small></div></div>`).join("")}</div>`;
    }
    __name(phasePanel, "phasePanel");
    function navHTML() {
      const mainIds = /* @__PURE__ */ new Set(["home", "games", "table", "teams", "media", "playoffs"]), main = NAV.filter(([, , id]) => mainIds.has(id)), extra = NAV.filter(([, , id]) => !mainIds.has(id));
      const link = /* @__PURE__ */ __name(([href, label, id]) => `<a href="${esc(href)}" class="${PAGE === id || PAGE === "team" && id === "teams" || PAGE === "player" && id === "players" || PAGE === "match" && id === "games" || PAGE === "custom" && id === "custom-" + location.pathname.split("/").at(-1) ? "on" : ""}">${esc(label)}</a>`, "link");
      const latest = DONE.length ? Math.max(...DONE.filter((m) => matchStage(m) === "group").map((m) => m.round)) : 0, recent = DONE.filter((m) => m.round === latest && matchStage(m) === "group");
      return `<div class="utility-bar"><div class="wrap"><span>${esc(L.season)} M\xD6VS\xDCM\xDC <i></i> SUMQAYIT \xB7 M\u0130N\u0130 FUTBOL</span><details class="favorite-menu" id="favorite-menu"><summary>\u2606 <span id="favorite-label">${favorite ? esc(T[favorite].name) : "Sevimli komandan\u0131 se\xE7"}</span></summary><div class="favorite-options">${L.teams.map((t) => `<button type="button" data-favorite="${t.id}" aria-pressed="${favorite === t.id}"><span class="fav-icon">${favorite === t.id ? "\u2605" : "\u2606"}</span>${ball(t.id, "xs")}${esc(t.name)}</button>`).join("")}</div></details></div></div><header class="nav"><div class="wrap nav-in"><a class="brand" href="index.html" aria-label="Ana s\u0259hif\u0259"><img src="${esc(logo)}" alt="${esc(S.name || L.name)} loqosu"><span>${brandLabel}</span></a><nav class="links" id="links" aria-label="\u018Fsas menyu">${main.map(link).join("")}${extra.length ? `<details class="more-menu"><summary>Dig\u0259r <span>\u2304</span></summary><div class="more-links">${extra.map(link).join("")}</div></details>` : ""}</nav><button class="global-search" id="search-open" type="button" aria-label="Saytda axtar\u0131\u015F a\xE7">\u2315</button><a class="header-live" href="media.html">\u25B6 <span>SSL TV</span></a><button class="burger" id="burger" aria-label="Menyunu a\xE7" aria-expanded="false" aria-controls="links">\u2630</button></div></header>${recent.length ? `<div class="score-strip"><div class="wrap"><a class="score-strip-label" href="oyunlar.html#r${latest}">${latest}-C\u0130 TUR <small>SON N\u018FT\u0130C\u018FL\u018FR</small></a><div class="score-strip-games">${recent.map((m) => `<a href="matc.html?id=${m.id}">${ball(m.home, "xs")}<span>${esc(T[m.home].code)}</span><b>${m.hs}<i>:</i>${m.as}</b><span>${esc(T[m.away].code)}</span>${ball(m.away, "xs")}</a>`).join("")}</div></div></div>` : ""}`;
    }
    __name(navHTML, "navHTML");
    function footerHTML() {
      const socials = [["youtube", "YouTube"], ["instagram", "Instagram"], ["facebook", "Facebook"], ["tiktok", "TikTok"]].filter(([key]) => S[key]);
      return `<footer class="arena-footer"><div class="wrap"><div class="footer-top"><a class="brand" href="index.html"><img src="${esc(logo)}" alt=""><span>${brandLabel}</span></a><div class="footer-season"><span>${esc(L.season)} M\xD6VS\xDCM\xDC</span><b>\u015E\u0259h\u0259r bir. H\u0259y\u0259can bir.</b></div></div><div class="ft"><div><p>${esc(B.footerText || "Sumqay\u0131t\u0131n mini futbol h\u0259y\u0259can\u0131. Oyunlar, statistika, komandalar v\u0259 media bir m\u0259kanda.")}</p><div class="footer-social">${socials.map(([key, label]) => `<a href="${esc(S[key])}" target="_blank" rel="noopener noreferrer">${label} \u2197</a>`).join("")}</div></div><div><h4>L\u0130QA M\u018FRK\u018FZ\u0130</h4>${NAV.slice(0, 6).map(([href, label]) => `<a href="${esc(href)}">${esc(label)}</a>`).join("")}</div><div><h4>DAHA \xC7OX</h4>${NAV.slice(6).map(([href, label]) => `<a href="${esc(href)}">${esc(label)}</a>`).join("")}</div><div><h4>\u018FLAQ\u018F</h4>${S.phone ? `<a href="tel:${esc(S.phone)}">${esc(S.phone)}</a>` : ""}${S.email ? `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : ""}<span>${esc(S.address || "Sumqay\u0131t, Az\u0259rbaycan")}</span><a class="admin-entry" href="admin.html">\u0130dar\u0259etm\u0259 \u2197</a></div></div><div class="copy"><span>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${esc(S.name || L.name)}. ${esc(B.copyright || "B\xFCt\xFCn h\xFCquqlar qorunur.")}</span><span>Son yenil\u0259nm\u0259: ${esc(L.updated)}</span></div></div></footer><button class="totop" id="totop" aria-label="Yuxar\u0131 qalx">\u2191</button>`;
    }
    __name(footerHTML, "footerHTML");
    P.home = () => {
      const lastRound = DONE.length ? Math.max(...DONE.filter((m) => matchStage(m) === "group").map((m) => m.round)) : 0, rounds = [...new Set(M.filter((m) => matchStage(m) === "group").map((m) => m.round))].sort((a, b) => a - b), next = PLAN.filter((m) => !state.groupComplete || matchStage(m) !== "group"), nextMatch = next[0];
      const feature = qualified.length ? `<div class="hero-feature-header"><span>\xD6N\u018F \xC7IXAN</span><h2>Yar\u0131mfinal\xE7\u0131lar</h2><a href="merhele.html">M\u0259rh\u0259l\u0259y\u0259 bax \u2197</a></div><div class="hero-qualifiers">${qualified.map(qualifierCard).join("")}</div>` : nextMatch ? `<div class="hero-feature-header"><span>MAT\xC7 G\xDCN\xDC</span><h2>N\xF6vb\u0259ti qar\u015F\u0131la\u015Fma</h2></div><div class="hero-fixture"><span>${stageName(nextMatch)} \xB7 ${fd(nextMatch.date)} \xB7 ${nextMatch.time}</span><div>${ball(nextMatch.home, "lg")}<b>VS</b>${ball(nextMatch.away, "lg")}</div><h3>${esc(T[nextMatch.home].name)} \u2014 ${esc(T[nextMatch.away].name)}</h3><a class="btn pri" href="matc.html?id=${nextMatch.id}">Mat\xE7 m\u0259rk\u0259zi \u2197</a></div>` : `<div class="hero-season-card"><img src="${esc(logo)}" alt="${esc(S.name)}"><h2>${esc(L.season)} m\xF6vs\xFCm\xFC</h2><p>Oyunlar, komandalar v\u0259 liqan\u0131n b\xFCt\xFCn r\u0259q\u0259ml\u0259ri bir m\u0259kanda.</p></div>`;
      const hero = `<section class="arena-hero hero"><svg class="pitch-lines" viewBox="0 0 720 430" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 40H700V400H20Z M360 40V400"/><circle cx="360" cy="220" r="65"/><path d="M20 105H125V335H20 M700 105H595V335H700 M20 155H63V285H20 M700 155H657V285H700"/></g></svg><div class="wrap arena-hero-grid"><div class="hero-story"><div class="hero-kicker"><span class="season-pill">${esc(L.season)} M\xD6VS\xDCM\xDC</span><span>${esc(phaseLabel)}</span></div><h1 class="big">${H.title ? esc(H.title) : "Sumqay\u0131t\u0131n"}<br><em class="hero-highlight">${esc(H.highlight || "futbol h\u0259y\u0259can\u0131.")}</em></h1><p class="hero-tagline">${esc(S.tagline)}</p><p class="lead">${esc(S.hero)}</p><div class="btns"><a class="btn pri" href="${esc(H.buttonUrl || "/oyunlar.html")}">${esc(H.buttonLabel || "Oyunlar v\u0259 n\u0259tic\u0259l\u0259r")} \u2197</a><a class="btn sec" href="merhele.html">Yar\u0131\u015F\u0131n m\u0259rh\u0259l\u0259l\u0259ri \u2192</a></div><div class="hero-footnote"><span>AZFAR ARENA</span><i></i><span>${L.teams.length} KOMANDA \xB7 ${GROUPS.length} QRUP</span></div>${H.image ? `<img class="cms-hero-image" src="${esc(H.image)}" alt="${esc(S.name)}">` : ""}</div><aside class="hero-feature">${feature}</aside></div></section>`;
      const metrics = `<section class="league-metrics"><div class="wrap">${[[DONE.length, "Tamamlanm\u0131\u015F oyun"], [goals, "Vurulan qol"], [DONE.length ? (goals / DONE.length).toFixed(2) : "0", "Oyunda orta qol"], [L.teams.length, "\u0130\u015Ftirak\xE7\u0131 komanda"]].map(([number, label]) => `<div><strong>${number}</strong><span>${label}</span></div>`).join("")}</div></section>`;
      const results = `<section class="sec"><div class="wrap">${sech("Mat\xE7 m\u0259rk\u0259zi", "Tur se\xE7, n\u0259tic\u0259l\u0259r\u0259 v\u0259 oyunun hadis\u0259l\u0259rin\u0259 bax.", ["oyunlar.html", "B\xFCt\xFCn oyunlar"])}<div class="home-round-controls"><div class="tabs" id="home-round-tabs">${rounds.map((round) => `<button class="tab ${round === lastRound ? "on" : ""}" data-home-round="${round}">${round}-ci tur</button>`).join("")}</div><button class="favorite-filter" id="favorite-filter" type="button" aria-pressed="false">\u2606 M\u0259nim komandam</button></div><p id="favorite-hint" class="sr" role="status"></p><div class="mgrid" id="home-round-results">${DONE.filter((m) => m.round === lastRound).map(mcard).join("")}</div></div></section>`;
      const table = `<section class="sec standings-section"><div class="wrap">${sech("Qrup c\u0259dv\u0259ll\u0259ri", state.groupComplete ? "Qrup m\u0259rh\u0259l\u0259sinin yekun s\u0131ralamas\u0131." : "Qrup m\u0259rh\u0259l\u0259sinin cari s\u0131ralamas\u0131.", ["cedvel.html", "Tam c\u0259dv\u0259l"])}<div class="g2">${GROUPS.map((group) => tableHTML(group, false)).join("")}</div>${state.qualified.length ? '<div class="qualification-key"><span></span> Yar\u0131mfinala v\u0259siq\u0259 qazanan komandalar</div>' : ""}</div></section>`;
      const scorerCards = SC.slice(0, 3).map((player, index) => `<a class="spotlight-player rank-${index + 1}" href="${playerLink(player.t, player.p)}"><div class="spotlight-meta"><span>0${index + 1}</span>${ball(player.t, "sm")}</div><div class="player-monogram" style="--c:${T[player.t].color}">${esc(player.p.split(" ").map((s) => s[0]).slice(0, 2).join(""))}</div><div class="spotlight-copy"><small>${esc(T[player.t].name)}</small><h3>${esc(player.p)}</h3></div><div class="spotlight-goals"><strong>${player.g}</strong><span>QOL</span><i>\u2197</i></div></a>`).join("");
      const scoring = `<section class="sec scorer-section"><div class="wrap">${sech("Qolun arxas\u0131ndak\u0131 adlar", "M\xF6vs\xFCm\xFCn bombardirl\u0259ri.", ["bombardirler.html", "B\xFCt\xFCn siyah\u0131"])}<div class="scorer-spotlight">${scorerCards}</div></div></section>`;
      const clubs = `<section class="sec"><div class="wrap">${sech("\u015E\u0259h\u0259rin komandalar\u0131", "H\u0259r komandan\u0131n \xF6z hekay\u0259si var.", ["komandalar.html", "B\xFCt\xFCn komandalar"])}<div class="g4">${L.teams.map(teamCard).join("")}</div><a class="compare-promo" href="muqayise.html"><div><span>KOMANDALAR \xDCZ-\xDCZ\u018F</span><h3>R\u0259q\u0259ml\u0259ri yan-yana m\xFCqayis\u0259 et.</h3></div><strong>M\xFCqayis\u0259y\u0259 ba\u015Fla \u2197</strong></a></div></section>`;
      const awards = mvps().slice(0, 4), mvp = awards.length ? `<section class="sec"><div class="wrap">${sech("Mat\xE7\u0131n ulduzlar\u0131", "\u018Fn \xE7ox MVP se\xE7il\u0259n futbol\xE7ular.", ["statistika.html", "Statistika"])}<div class="mvp-grid">${awards.map((p) => `<a href="${playerLink(p.t, p.p)}">${ball(p.t, "sm")}<div><b>${esc(p.p)}</b><span>${esc(T[p.t].name)}</span></div><strong>${p.n}<small>MVP</small></strong></a>`).join("")}</div></div></section>` : "";
      const fixtures = next.length ? `<section class="sec"><div class="wrap">${sech("N\xF6vb\u0259ti oyunlar", "Qar\u015F\u0131la\u015Fmalar\u0131n t\u0259qvimi.")}<div class="mgrid">${next.map(mcard).join("")}</div></div></section>` : "";
      const sections = { pulse: metrics, results, fixtures, table, videos: homeMedia(), scorers: scoring, teams: clubs, news: homeNews(), mvp };
      return hero + `<div class="wrap phase-home">${phasePanel()}</div>` + (H.sections || Object.keys(sections).map((id) => ({ id, visible: true }))).filter((x) => x.visible).map((x) => sections[x.id] || "").join("");
    };
    P.home.init = () => {
      if (!$("#home-round-tabs")) return;
      let round = $$("#home-round-tabs .on")[0]?.dataset.homeRound || "1", mine = false;
      const draw = /* @__PURE__ */ __name(() => {
        if (!favorite) mine = false;
        $("#favorite-filter").setAttribute("aria-pressed", String(mine));
        const matches = M.filter((m) => m.round === +round && matchStage(m) === "group" && (!mine || m.home === favorite || m.away === favorite));
        $("#home-round-results").innerHTML = matches.map(mcard).join("") || '<div class="empty">Bu turda se\xE7ilmi\u015F komandan\u0131n oyunu yoxdur.</div>';
        $$("#home-round-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.homeRound === round));
        $$("#home-round-results .rv").forEach((e) => e.classList.add("in"));
      }, "draw");
      $("#home-round-tabs").onclick = (e) => {
        const b = e.target.closest("[data-home-round]");
        if (b) {
          round = b.dataset.homeRound;
          draw();
        }
      };
      $("#favorite-filter").onclick = () => {
        if (!favorite) {
          $("#favorite-hint").className = "favorite-hint";
          $("#favorite-hint").textContent = "\u018Fvv\u0259l yuxar\u0131dak\u0131 menyudan sevimli komandan\u0131 se\xE7.";
          $("#favorite-menu").setAttribute("open", "");
          return;
        }
        mine = !mine;
        $("#favorite-filter").setAttribute("aria-pressed", String(mine));
        draw();
      };
      refreshFavorite = draw;
      draw();
    };
    P.playoffs = () => head("N\xF6vb\u0259ti m\u0259rh\u0259l\u0259", "Qrup m\u0259rh\u0259l\u0259sind\u0259n finala uzanan yol.") + `<section class="sec"><div class="wrap">${phasePanel()}${sech("Yar\u0131mfinal\xE7\u0131lar", `${state.qualified.length} komanda n\xF6vb\u0259ti m\u0259rh\u0259l\u0259d\u0259.`)}<div class="qualified-grid">${qualified.map(qualifierCard).join("") || '<div class="empty">N\xF6vb\u0259ti m\u0259rh\u0259l\u0259y\u0259 ke\xE7\u0259n komandalar elan edil\u0259c\u0259k.</div>'}</div><div class="playoff-schedule">${sech("Yar\u0131mfinal oyunlar\u0131", "Final yolundak\u0131 son add\u0131m.")}<div class="mgrid">${state.semifinals.length ? state.semifinals.map(mcard).join("") : '<div class="schedule-pending"><span class="schedule-number">02</span><div><h3>Yar\u0131mfinala haz\u0131r\u0131q.</h3><p>Qar\u015F\u0131la\u015Fmalar v\u0259 tarixl\u0259r elan edil\u0259nd\u0259 burada g\xF6r\xFCn\u0259c\u0259k.</p></div><a class="btn pri" href="oyunlar.html">Qrup oyunlar\u0131na bax \u2197</a></div>'}</div></div>${state.finals.length ? `${sech("Final", "Kuboka ged\u0259n yol.")}<div class="mgrid">${state.finals.map(mcard).join("")}</div>` : ""}</div></section>`;
    P.compare = () => head("Komandalar \xFCz-\xFCz\u0259", "R\u0259qibl\u0259rin m\xF6vs\xFCm g\xF6st\u0259ricil\u0259rini v\u0259 qar\u015F\u0131l\u0131ql\u0131 oyunlar\u0131n\u0131 m\xFCqayis\u0259 et.") + `<section class="sec"><div class="wrap"><div class="compare-selectors"><label>Birinci komanda<select id="compare-first">${L.teams.map((t, i) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></label><span>VS</span><label>\u0130kinci komanda<select id="compare-second">${L.teams.map((t, i) => `<option value="${t.id}"${i === 1 ? " selected" : ""}>${esc(t.name)}</option>`).join("")}</select></label></div><div id="compare-content"></div></div></section>`;
    P.compare.init = () => {
      const f = $("#compare-first"), s = $("#compare-second"), params = new URLSearchParams(location.search);
      if (T[params.get("a")]) f.value = params.get("a");
      if (T[params.get("b")]) s.value = params.get("b");
      const draw = /* @__PURE__ */ __name(() => {
        if (f.value === s.value) {
          $("#compare-content").innerHTML = '<div class="empty">M\xFCqayis\u0259 \xFC\xE7\xFCn iki f\u0259rqli komanda se\xE7.</div>';
          return;
        }
        const a = teamSummary(L, f.value), b = teamSummary(L, s.value), h = headToHead(L, f.value, s.value), stats = [["Oyun", "played"], ["Q\u0259l\u0259b\u0259", "wins"], ["He\xE7-he\xE7\u0259", "draws"], ["Vurulan qol", "goalsFor"], ["Burax\u0131lan qol", "goalsAgainst"], ["Qap\u0131n\u0131 toxunulmaz saxlad\u0131\u011F\u0131 oyun", "cleanSheets"], ["Sar\u0131 kart", "yellow"], ["Q\u0131rm\u0131z\u0131 kart", "red"]];
        $("#compare-content").innerHTML = `<div class="comparison-hero"><a href="komanda.html?t=${f.value}">${ball(f.value, "xl")}<h2>${esc(T[f.value].name)}</h2>${formHTML(f.value)}</a><div><span>QAR\u015EILIQLI OYUNLAR</span><strong>${h.matches.length}</strong><p>${h.firstWins} q\u0259l\u0259b\u0259 <i>\xB7</i> ${h.draws} he\xE7-he\xE7\u0259 <i>\xB7</i> ${h.secondWins} q\u0259l\u0259b\u0259</p></div><a href="komanda.html?t=${s.value}">${ball(s.value, "xl")}<h2>${esc(T[s.value].name)}</h2>${formHTML(s.value)}</a></div><div class="comparison-table">${stats.map(([label, key]) => `<div><b>${a[key]}</b><span>${label}</span><b>${b[key]}</b></div>`).join("")}</div>${sech("Qar\u015F\u0131l\u0131ql\u0131 g\xF6r\xFC\u015Fl\u0259r", "Bu m\xF6vs\xFCmd\u0259 ke\xE7irilmi\u015F oyunlar.")}<div class="mgrid">${h.matches.map(mcard).join("") || '<div class="empty">Bu iki komanda aras\u0131nda tamamlanm\u0131\u015F oyun yoxdur.</div>'}</div>`;
        $$("#compare-content .rv").forEach((e) => e.classList.add("in"));
      }, "draw");
      f.onchange = draw;
      s.onchange = draw;
      draw();
    };
    P.teams = () => head("Komandalar", `${L.teams.length} komanda. Bir \u015F\u0259h\u0259r. Bir liqa.`) + `<section class="sec"><div class="wrap"><div class="clubs-intro"><p>Hey\u0259tl\u0259r, oyunlar v\u0259 h\u0259r komandan\u0131n m\xF6vs\xFCm hekay\u0259si.</p><a class="btn pri" href="muqayise.html">Komandalar\u0131 m\xFCqayis\u0259 et \u2197</a></div><div class="g4">${L.teams.map(teamCard).join("")}</div></div></section>`;
    const oldTeam = P.team;
    P.team = () => {
      const html = oldTeam(), id = new URLSearchParams(location.search).get("t"), t = T[id];
      if (!t) return html;
      return html.replace(`<span class="eyebrow">QRUP ${t.group}</span>`, `<span class="eyebrow">QRUP ${t.group}</span>${mark(id)}`).replace('<div class="meta">', `<div class="team-actions">${star(id)}<a class="btn sec" href="muqayise.html?a=${id}">M\xFCqayis\u0259 et \u2197</a><span class="registered-count">${t.registeredPlayers ?? t.players.length} liqa qeydiyyat\u0131</span></div><div class="meta">`).replace(/🏆 |📊 |🧑‍🏫 /g, "");
    };
    const oldMatch = P.match;
    P.match = () => {
      const html = oldMatch(), id = new URLSearchParams(location.search).get("id"), m = M.find((x) => x.id === id);
      if (!m) return html;
      return html.replace('<div class="match-dashboard">', `<div class="match-tools"><a href="muqayise.html?a=${m.home}&b=${m.away}">Bu komandalar\u0131 m\xFCqayis\u0259 et \u2197</a><button type="button" id="copy-match-link">Ke\xE7idi kopyala</button><span id="copy-match-status" role="status"></span></div><div class="match-dashboard">`);
    };
    P.match.init = () => {
      const b = $("#copy-match-link");
      if (b) b.onclick = async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          $("#copy-match-status").textContent = "Ke\xE7id kopyaland\u0131.";
        } catch {
          $("#copy-match-status").textContent = "Ke\xE7idi brauzerin \xFCnvan s\u0259trind\u0259n kopyalaya bil\u0259rs\u0259n.";
        }
      };
    };
    const oldTable = P.table;
    P.table = () => oldTable().replace("Qrup m\u0259rh\u0259l\u0259si. Komanda ad\u0131na basaraq hey\u0259t v\u0259 oyunlarla tan\u0131\u015F ola bil\u0259rsiniz.", state.groupComplete ? "Qrup m\u0259rh\u0259l\u0259sinin yekun c\u0259dv\u0259li v\u0259 yar\u0131mfinal\xE7\u0131lar." : "Qrup m\u0259rh\u0259l\u0259sind\u0259 komandalar\u0131n cari s\u0131ralamas\u0131.");
    P.notfound = () => head("S\u0259hif\u0259 tap\u0131lmad\u0131", "Axtard\u0131\u011F\u0131n s\u0259hif\u0259 k\xF6\xE7\xFCr\xFCl\xFCb v\u0259 ya m\xF6vcud deyil.") + `<section class="sec"><div class="wrap"><a class="btn pri" href="index.html">Ana s\u0259hif\u0259y\u0259 qay\u0131t \u2197</a></div></section>`;
    function bind() {
      document.body.classList.add("arena-site");
      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-favorite]");
        if (!b) return;
        e.preventDefault();
        const id = b.dataset.favorite;
        if (!T[id]) return;
        favorite = favorite === id ? "" : id;
        try {
          if (favorite) localStorage.setItem(favoriteKey, favorite);
          else localStorage.removeItem(favoriteKey);
        } catch {
        }
        $$("[data-favorite]").forEach((button) => {
          const active = button.dataset.favorite === favorite;
          button.classList.toggle("is-favorite", active);
          button.setAttribute("aria-pressed", String(active));
          const icon = button.querySelector(".fav-icon");
          if (icon) icon.textContent = active ? "\u2605" : "\u2606";
        });
        $("#favorite-label").textContent = favorite ? T[favorite].name : "Sevimli komandan\u0131 se\xE7";
        if (!favorite && $("#favorite-filter")) $("#favorite-filter").setAttribute("aria-pressed", "false");
        $("#favorite-menu").removeAttribute("open");
        refreshFavorite();
      });
      $$("tbody tr").forEach((row) => {
        const anchor = row.querySelector('a[href*="komanda.html?t="]');
        if (!anchor) return;
        const id = anchor.getAttribute("href").split("t=")[1];
        if (state.qualified.includes(id)) {
          row.classList.add("qualified-row");
          const name = row.querySelector(".tm b");
          if (name) name.insertAdjacentHTML("afterend", '<span class="table-qualified">Yar\u0131mfinal</span>');
        }
      });
    }
    __name(bind, "bind");
    return { navHTML, footerHTML, bind };
  }
  __name(installArena, "installArena");

  // ../../cms-site/js/app-source.js
  window.SSL_CMS = cms_source_exports;
  (function() {
    const L = window.LEAGUE, S = window.SITE || {}, C = window.SSL_CONTENT || { news: [], videos: [], socials: {} };
    if (!L) {
      document.body.innerHTML = '<p style="padding:40px;color:#fff">content.js tap\u0131lmad\u0131</p>';
      return;
    }
    if (S.primary) document.documentElement.style.setProperty("--b600", S.primary);
    if (S.accent) document.documentElement.style.setProperty("--red", S.accent);
    const CMS = window.SSL_CMS ? window.SSL_CMS.getCMS(window.CONTENT) : {}, H = CMS.home || {}, B = CMS.branding || {};
    if (window.CONTENT?.cms) {
      const a = CMS.appearance, root = document.documentElement;
      for (const [key, value] of Object.entries({ "--b950": a.background, "--b900": a.surface, "--b800": a.surface, "--txt": a.text, "--mut": a.muted, "--r": a.radius + "px", "--content-width": a.width + "px", "--br": a.text + "22", "--button-text": window.SSL_CMS.buttonText(S.accent), "--arena-bg": a.background, "--arena-surface": a.surface, "--arena-text": a.text, "--arena-muted": a.muted })) root.style.setProperty(key, value);
      const fonts = { manrope: '"Manrope",system-ui,sans-serif', montserrat: '"Montserrat",system-ui,sans-serif', system: "system-ui,sans-serif", georgia: "Georgia,serif", barlow: '"Barlow Condensed","Arial Narrow",Impact,sans-serif' };
      root.style.setProperty("--font", fonts[a.font]);
      root.style.setProperty("--display", fonts[a.headingFont]);
      document.body.classList.add("cms-themed");
    }
    const T = /* @__PURE__ */ Object.create(null);
    L.teams.forEach((t) => T[t.id] = t);
    const $ = /* @__PURE__ */ __name((s, r = document) => r.querySelector(s), "$"), $$ = /* @__PURE__ */ __name((s, r = document) => [...r.querySelectorAll(s)], "$$");
    const MON = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
    const esc = /* @__PURE__ */ __name((s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "esc");
    const fd = /* @__PURE__ */ __name((d) => {
      if (!d) return "";
      const [y, m, dd] = d.split("-");
      return `${+dd} ${MON[m - 1]} ${y}`;
    }, "fd"), fs = /* @__PURE__ */ __name((d) => {
      const [, m, dd] = d.split("-");
      return `${+dd} ${MON[m - 1].slice(0, 3)}`;
    }, "fs");
    const nrm = /* @__PURE__ */ __name((s) => String(s || "").normalize("NFC").toLocaleLowerCase("az").replace(/\s+/g, " ").trim(), "nrm"), tok = playerKey;
    const M = L.matches.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), DONE = M.filter((m) => m.status === "done"), PLAN = M.filter((m) => m.status !== "done");
    const ball = /* @__PURE__ */ __name((id, sz = "md") => `<span class="ball ${sz}${id === "fvs" ? " d" : ""}"><img src="assets/logos/${T[id].logo}" alt="${esc(T[id].name)}" loading="lazy"></span>`, "ball");
    const cr = creditedTeam;
    const matchLabel = /* @__PURE__ */ __name((m) => matchStage(m) === "group" ? m.round + "-ci tur" : matchStage(m) === "semifinal" ? "Yar\u0131mfinal" : "Final", "matchLabel");
    function standings2(group) {
      return standings(L, group);
    }
    __name(standings2, "standings");
    const GROUPS = [...new Set(L.teams.map((t) => t.group))].sort(), ST = Object.fromEntries(GROUPS.map((g) => [g, standings2(g)])), STX = /* @__PURE__ */ Object.create(null);
    GROUPS.forEach((g) => ST[g].forEach((r) => STX[r.id] = { ...r, group: g }));
    const form = /* @__PURE__ */ __name((id, n = 5) => DONE.filter((m) => m.home === id || m.away === id).slice(-n).map((m) => {
      const h = m.home === id, f = h ? m.hs : m.as, a = h ? m.as : m.hs;
      return f > a ? "Q" : f < a ? "M" : "H";
    }), "form");
    const formHTML = /* @__PURE__ */ __name((id) => `<span class="fm">${form(id).map((c) => `<i class="${c}">${c}</i>`).join("") || "<small>\u2014</small>"}</span>`, "formHTML");
    function scorers2() {
      return scorers(L);
    }
    __name(scorers2, "scorers");
    const SC = scorers2();
    function mvps() {
      const mp = /* @__PURE__ */ new Map();
      DONE.forEach((m) => {
        if (!m.mvp) return;
        const k = tok(m.mvp.p) + "|" + m.mvp.t;
        const e = mp.get(k) || { p: playerName(m.mvp.p), t: m.mvp.t, n: 0 };
        e.n++;
        mp.set(k, e);
      });
      return [...mp.values()].sort((a, b) => b.n - a.n || a.p.localeCompare(b.p, "az"));
    }
    __name(mvps, "mvps");
    const brandName = /* @__PURE__ */ __name(() => S.name === "Sumqay\u0131t Super Liqa" ? "SUMQAYIT<br>SUPER L\u0130QA" : esc(S.name || L.name), "brandName");
    const PAGE = document.body.dataset.page || "";
    const DEFAULT_NAV = [["index.html", "Ana s\u0259hif\u0259", "home"], ["oyunlar.html", "Oyunlar", "games"], ["cedvel.html", "C\u0259dv\u0259l", "table"], ["komandalar.html", "Komandalar", "teams"], ["futbolcular.html", "Futbol\xE7ular", "players"], ["bombardirler.html", "Bombardirl\u0259r", "scorers"], ["statistika.html", "Statistika", "stats"], ["media.html", "Media", "media"], ["xeberler.html", "X\u0259b\u0259rl\u0259r", "news"], ["haqqimizda.html", "Haqq\u0131m\u0131zda", "about"], ["merhele.html", "Yar\u0131mfinal", "playoffs"], ["muqayise.html", "M\xFCqayis\u0259", "compare"]];
    const NAV = (CMS.navigation ? CMS.navigation.filter((n) => n.visible).map((n) => [DEFAULT_NAV.find((x) => x[2] === n.id)[0], n.label, n.id]) : DEFAULT_NAV).concat((CMS.pages || []).filter((p) => p.published && p.showInMenu).map((p) => ["/sehife/" + p.slug, p.menuLabel, "custom-" + p.slug]));
    const siteLogo = B.logo || "/assets/logo.png";
    function chrome() {
      const last = DONE.slice(-8).reverse(), tk = last.map((m) => `<span>${esc(T[m.home].code)} <b>${m.hs}\u2013${m.as}</b> ${esc(T[m.away].code)}</span>`).join("");
      const nav = arena.navHTML();
      const soc = [["youtube", "YouTube"], ["instagram", "Instagram"], ["facebook", "Facebook"], ["tiktok", "TikTok"]].filter(([k]) => S[k]).map(([k, n]) => `<a href="${esc(S[k])}" target="_blank" rel="noopener">${n}</a>`).join("");
      const foot = arena.footerHTML();
      document.body.insertAdjacentHTML("afterbegin", (H.announcement ? `<div class="site-announcement">${H.announcementUrl ? `<a href="${esc(H.announcementUrl)}" rel="noopener noreferrer">${esc(H.announcement)} \u2197</a>` : esc(H.announcement)}</div>` : "") + nav);
      document.body.insertAdjacentHTML("beforeend", foot);
      document.body.insertAdjacentHTML("beforeend", `<div class="search-overlay" id="search-overlay" hidden><div class="search-box" role="dialog" aria-modal="true" aria-labelledby="search-title"><div class="search-title"><div><span class="eyebrow">SSL / AXTARI\u015E</span><h2 id="search-title">N\u018F AXTARIRSAN?</h2></div><button id="search-close" type="button" aria-label="Axtar\u0131\u015F\u0131 ba\u011Fla">\u2715</button></div><input id="global-q" type="search" autocomplete="off" placeholder="Komanda, futbol\xE7u v\u0259 ya oyun..." aria-label="Axtar\u0131\u015F s\xF6z\xFC"><div class="search-results" id="search-results"><p>Komanda, futbol\xE7u v\u0259 ya oyun ad\u0131 yaz.</p></div><div class="search-tip">Ba\u011Flamaq \xFC\xE7\xFCn ESC d\xFCym\u0259sin\u0259 bas.</div></div></div>`);
      const overlay = $("#search-overlay"), query = $("#global-q");
      let returnFocus = null;
      const closeSearch = /* @__PURE__ */ __name(() => {
        overlay.hidden = true;
        document.body.classList.remove("searching");
        if (returnFocus?.focus) returnFocus.focus();
      }, "closeSearch");
      const openSearch = /* @__PURE__ */ __name(() => {
        returnFocus = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add("searching");
        query.value = "";
        $("#search-results").innerHTML = "<p>Komanda, futbol\xE7u v\u0259 ya oyun ad\u0131 yaz.</p>";
        query.focus();
      }, "openSearch");
      $("#search-open").onclick = openSearch;
      $("#search-close").onclick = closeSearch;
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest(".search-results a")) closeSearch();
      });
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          overlay.hidden ? openSearch() : closeSearch();
        } else if (e.key === "Escape" && !overlay.hidden) closeSearch();
      });
      query.oninput = () => {
        const q = nrm(query.value);
        if (q.length < 2) {
          $("#search-results").innerHTML = "<p>\u018Fn az\u0131 2 simvol yaz.</p>";
          return;
        }
        const teams = L.teams.filter((t) => nrm(t.name).includes(q)).map((t) => ({ title: t.name, sub: "Komanda \xB7 Qrup " + t.group, href: "komanda.html?t=" + encodeURIComponent(t.id), logo: t.id }));
        const players = L.teams.flatMap((t) => t.players.filter((p) => nrm(p.name).includes(q)).map((p) => ({ title: p.name, sub: "Futbol\xE7u \xB7 " + t.name, href: playerLink(t.id, p.name), logo: t.id })));
        const matches = M.filter((m) => nrm(T[m.home].name + " " + T[m.away].name).includes(q)).slice(0, 7).map((m) => ({ title: T[m.home].name + " \u2014 " + T[m.away].name, sub: m.round + "-ci tur \xB7 " + fd(m.date), href: "matc.html?id=" + encodeURIComponent(m.id), logo: m.home }));
        const found = [...teams, ...players.slice(0, 12), ...matches].slice(0, 18);
        $("#search-results").innerHTML = found.length ? found.map((x) => `<a href="${x.href}">${ball(x.logo, "sm")}<span><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></span><em>\u2197</em></a>`).join("") : "<p>N\u0259tic\u0259 tap\u0131lmad\u0131.</p>";
      };
      $("#burger").onclick = () => {
        const open = $("#links").classList.toggle("open");
        $("#burger").setAttribute("aria-expanded", String(open));
        $("#burger").setAttribute("aria-label", open ? "Menyunu ba\u011Fla" : "Menyunu a\xE7");
      };
      $("#totop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
      addEventListener("scroll", () => $("#totop").classList.toggle("show", scrollY > 600), { passive: true });
    }
    __name(chrome, "chrome");
    function details(m) {
      const side = /* @__PURE__ */ __name((id) => {
        const mp = /* @__PURE__ */ new Map();
        m.goals.filter((g) => cr(m, g) === id).forEach((g) => {
          const k = (g.unk ? "?" : g.p) + (g.og ? "|og" : "");
          const e = mp.get(k) || { ...g, n: 0 };
          e.n++;
          mp.set(k, e);
        });
        return [...mp.values()].map((g) => `<li>\u26BD ${g.unk ? `<i>${g.og ? "Avtoqol \xB7 m\xFC\u0259llif qeyd edilm\u0259yib" : "M\xFC\u0259llif qeyd edilm\u0259yib"}</i>` : esc(playerName(g.p))}${g.og ? " <small>(\xF6z qap\u0131s\u0131na)</small>" : ""}${g.n > 1 ? ` <b>\xD7${g.n}</b>` : ""}</li>`).join("") || '<li class="mut">\u2014</li>';
      }, "side"), cards = /* @__PURE__ */ __name((id) => m.cards.filter((c) => c.t === id).map((c) => `<li>${c.c === "r" ? "\u{1F7E5}" : "\u{1F7E8}"} ${esc(c.p)}</li>`).join(""), "cards");
      const hc = cards(m.home), ac = cards(m.away);
      return `<div class="mc-det"><div class="dt2"><div><h5>${esc(T[m.home].name)}</h5><ul>${side(m.home)}</ul></div><div class="r"><h5>${esc(T[m.away].name)}</h5><ul>${side(m.away)}</ul></div></div>${hc || ac ? `<div class="dt2 dt-row"><div><h5>KARTLAR</h5><ul>${hc || '<li class="mut">\u2014</li>'}</ul></div><div class="r"><h5>KARTLAR</h5><ul>${ac || '<li class="mut">\u2014</li>'}</ul></div></div>` : ""}${m.mvp ? `<div class="dt-row"><span class="mvp">\u2605 \u018Fn yax\u015F\u0131 oyun\xE7u: ${esc(m.mvp.p)} <small>(${esc(T[m.mvp.t].name)})</small></span></div>` : ""}</div>`;
    }
    __name(details, "details");
    function mcard(m) {
      const h = T[m.home], a = T[m.away], d = m.status === "done", has = d && (m.goals.length || m.cards.length || m.mvp);
      return `<article class="mc card rv" id="${m.id}"><div class="mc-top"><span class="pill">${matchLabel(m)}</span><span>${fd(m.date)} \xB7 ${esc(m.time)}</span><span class="st ${d ? "ok" : "pl"}">${d ? "Tamamland\u0131" : "Planla\u015Fd\u0131r\u0131l\u0131b"}</span></div><div class="mc-main"><a class="mt" href="komanda.html?t=${h.id}">${ball(h.id)}<b>${esc(h.name)}</b></a><div class="mc-sc">${d ? `<span>${m.hs}</span><i>:</i><span>${m.as}</span>` : "<em>VS</em>"}</div><a class="mt r" href="komanda.html?t=${a.id}">${ball(a.id)}<b>${esc(a.name)}</b></a></div><div class="mc-ft"><span>\u{1F4CD} ${esc(m.venue || "")}</span><a class="match-open" href="matc.html?id=${encodeURIComponent(m.id)}">Mat\xE7 m\u0259rk\u0259zi \u2197</a>${has ? '<button class="mc-more" aria-expanded="false">Qol / kartlar \u25BE</button>' : ""}</div>${has ? details(m) : ""}</article>`;
    }
    __name(mcard, "mcard");
    function head(t, p) {
      return `<section class="phead"><div class="wrap"><span class="eyebrow">SUMQAYIT SUPER L\u0130QA</span><h1>${t}</h1><p>${p}</p></div></section>`;
    }
    __name(head, "head");
    const sech = /* @__PURE__ */ __name((t, p, l) => `<div class="sec-h rv"><div><h2>${t}</h2>${p ? `<p>${p}</p>` : ""}</div>${l ? `<a class="more-link" href="${l[0]}">${l[1]} \u2192</a>` : ""}</div>`, "sech");
    function tableHTML(g, ext) {
      const R = ST[g];
      return `<div class="card rv"><div class="grp-h">Qrup ${g}<span>${DONE.length ? esc(L.season) + " M\xD6VS\xDCM\xDC" : ""}</span></div><div class="tw"><table class="t${ext ? "" : " sm"}"><thead><tr><th>#</th><th>Komanda</th><th>O</th><th>Q</th><th>H</th><th>M</th>${ext ? '<th class="hm">VQ</th><th class="hm">BQ</th><th>TF</th>' : ""}<th>X</th>${ext ? '<th class="hm">Forma</th>' : ""}</tr></thead><tbody>${R.map((r) => `<tr><td class="rk">${r.rank}</td><td class="tm"><a href="komanda.html?t=${r.id}">${ball(r.id, "sm")}<b>${esc(T[r.id].name)}</b></a></td><td>${r.o}</td><td>${r.q}</td><td>${r.h}</td><td>${r.m}</td>${ext ? `<td class="hm">${r.vq}</td><td class="hm">${r.bq}</td><td class="${r.tf > 0 ? "pos" : r.tf < 0 ? "neg" : ""}">${r.tf > 0 ? "+" : ""}${r.tf}</td>` : ""}<td class="x">${r.x}</td>${ext ? `<td class="hm">${formHTML(r.id)}</td>` : ""}</tr>`).join("")}</tbody></table></div></div>`;
    }
    __name(tableHTML, "tableHTML");
    function pageEnd() {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }), { threshold: 0.12 });
      $$(".rv,.chart .col,.bar").forEach((e) => io.observe(e));
      $$("[data-count]").forEach((el) => {
        const to = +el.dataset.count, dec = +el.dataset.dec || 0;
        const io2 = new IntersectionObserver((es) => {
          if (es[0].isIntersecting) {
            io2.disconnect();
            const t0 = performance.now();
            (/* @__PURE__ */ __name((function f(t) {
              const p = Math.min(1, (t - t0) / 1200), v = to * (1 - Math.pow(1 - p, 3));
              el.textContent = v.toFixed(dec);
              if (p < 1) requestAnimationFrame(f);
            }), "f"))(t0);
          }
        });
        io2.observe(el);
      });
      document.addEventListener("click", (e) => {
        const b = e.target.closest(".mc-more");
        if (!b) return;
        const c = b.closest(".mc");
        c.classList.toggle("open");
        b.setAttribute("aria-expanded", c.classList.contains("open"));
        b.textContent = c.classList.contains("open") ? "Ba\u011Fla \u25B4" : "Qol / kartlar \u25BE";
      });
      const cd = $("#cd");
      if (cd) {
        const tg = new Date(cd.dataset.t).getTime();
        const tick = /* @__PURE__ */ __name(() => {
          let s = Math.max(0, Math.floor((tg - Date.now()) / 1e3));
          const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
          $$("b", cd).forEach((b, i) => b.textContent = String(v[i]).padStart(2, "0"));
        }, "tick");
        tick();
        setInterval(tick, 1e3);
      }
      if (location.hash) {
        const el = document.getElementById(location.hash.slice(1));
        if (el && el.classList.contains("mc")) {
          el.classList.add("open");
          setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
        }
      }
    }
    __name(pageEnd, "pageEnd");
    const fmtShort = /* @__PURE__ */ __name((d) => {
      if (!d) return "";
      const a = d.split("-");
      return `${a[2]}.${a[1]}.${a[0]}`;
    }, "fmtShort");
    const NEWS = C.news || [], VIDEOS = C.videos || [];
    function newsCard(n, featured = false) {
      return `<a class="news-card ${featured ? "featured" : ""}" ${n.url ? 'target="_blank" rel="noopener noreferrer"' : ""} href="${n.url ? esc(n.url) : "xeberler.html?id=" + encodeURIComponent(n.id)}"><div class="news-art ${n.image ? "news-art-photo" : ""}"><span class="news-art-mark">${esc(n.mark || "SSL")}</span><span class="news-art-badge">${esc(n.category)}</span><img src="${esc(n.image || siteLogo)}" alt="${n.image ? esc(n.title) : ""}" loading="lazy"></div><div class="news-copy"><span class="news-meta">${fmtShort(n.date)} <i></i> ${esc(n.source)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><span class="read-more">${n.url ? "M\u0259qal\u0259ni oxu" : "X\u0259b\u0259ri oxu"} <b>\u2197</b></span></div></a>`;
    }
    __name(newsCard, "newsCard");
    function videoCard(v, i = 0) {
      return `<article class="video-card"><div class="video-art video-art-${i % 3}"><span class="video-air"><span class="live-dot"></span> OYUN ARX\u0130V\u0130</span><div class="video-duel">${ball(v.home, "lg")}<span>VS</span>${ball(v.away, "lg")}</div><span class="video-watermark">SSL TV</span><a class="video-play" target="_blank" rel="noopener noreferrer" href="${esc(v.url)}" aria-label="${esc(v.label)} videosunu YouTube-da izl\u0259">\u25B6</a></div><div class="video-content"><div class="video-overline">${fmtShort(v.date)} \xB7 YOUTUBE</div><h3>${esc(v.label)}</h3><div class="video-links"><a target="_blank" rel="noopener noreferrer" href="${esc(v.url)}">Videonu izl\u0259 \u2197</a>${M.some((m) => m.id === v.match) ? `<a href="matc.html?id=${encodeURIComponent(v.match)}">Mat\xE7 statistikas\u0131 \u2192</a>` : ""}</div></div></article>`;
    }
    __name(videoCard, "videoCard");
    function homePulse() {
      return `<section class="pulse"><div class="wrap pulse-inner"><div class="pulse-title"><span class="live-dot"></span> L\u0130QANIN N\u018FBZ\u0130 <small>/ ${esc(L.season)} M\xD6VS\xDCM\xDC</small></div><div class="pulse-values"><a href="oyunlar.html">${DONE.length} <span>OYUN</span></a><a href="statistika.html">${DONE.reduce((x, m) => x + m.hs + m.as, 0)} <span>QOL</span></a><a href="komandalar.html">${L.teams.length} <span>KOMANDA</span></a><a href="bombardirler.html">${SC[0] ? SC[0].g : 0} <span>L\u0130DER QOL</span></a></div></div></section>`;
    }
    __name(homePulse, "homePulse");
    function homeMedia() {
      if (!VIDEOS.length) return "";
      return `<section class="sec pro-media-home"><div class="wrap">${sech("SSL TV / Mat\xE7 arxivi", "Oyunun h\u0259y\u0259can\u0131 ekran\u0131nda davam edir.", ["media.html", "B\xFCt\xFCn videolar"])}<div class="video-grid">${VIDEOS.slice(0, 2).map(videoCard).join("")}</div></div></section>`;
    }
    __name(homeMedia, "homeMedia");
    function homeNews() {
      if (!NEWS.length) return "";
      return `<section class="sec editorial-home"><div class="wrap">${sech("Meydandan k\u0259nar", "Liqan\u0131n g\xFCnd\u0259mi, x\u0259b\u0259rl\u0259r v\u0259 m\u0259qal\u0259l\u0259r", ["xeberler.html", "X\u0259b\u0259r m\u0259rk\u0259zi"])}<div class="news-grid">${NEWS.slice(0, 3).map((n, i) => newsCard(n, i === 0)).join("")}</div></div></section>`;
    }
    __name(homeNews, "homeNews");
    function findPlayerGoals(team, name) {
      return DONE.flatMap((m) => m.goals.filter((g) => !g.og && !g.unk && g.t === team && tok(g.p) === tok(name)).map((g) => ({ m, g })));
    }
    __name(findPlayerGoals, "findPlayerGoals");
    function playerLink(t, p) {
      p = T[t]?.players.find((x) => tok(x.name) === tok(p))?.name || p;
      return `futbolcu.html?t=${encodeURIComponent(t)}&p=${encodeURIComponent(p)}`;
    }
    __name(playerLink, "playerLink");
    function playerBadge(p) {
      return p.gk ? "QAPI\xC7I" : "OYUN\xC7U";
    }
    __name(playerBadge, "playerBadge");
    const P = {};
    P.home = () => {
      const goals = DONE.reduce((a, m) => a + m.hs + m.as, 0), nx = PLAN[0], lastR = DONE.length ? Math.max(...DONE.map((m) => m.round)) : 0, nextR = nx ? nx.round : 0, lastM = DONE.filter((m) => m.round === lastR), nextM = PLAN.filter((m) => m.round === nextR);
      const topS = SC.slice(0, 5), mv = mvps().slice(0, 5), mx = topS[0] ? topS[0].g : 1;
      const hero = `<section class="hero"><div class="beams"></div><img class="wm" src="${esc(siteLogo)}" alt=""><div class="wrap hero-in"><div>${H.image ? `<img class="cms-hero-image" src="${esc(H.image)}" alt="${esc(S.name)}">` : ""}<span class="eyebrow">${esc(S.tagline || "Mini futbol")}</span><h1 class="big">${H.title ? esc(H.title) : brandName()}${H.highlight ? `<br><em class="hero-highlight">${esc(H.highlight)}</em>` : ""}</h1><p class="lead">${esc(S.hero)}</p><div class="btns"><a class="btn pri" href="${esc(H.buttonUrl || "/oyunlar.html")}">${esc(H.buttonLabel || "Oyunlar v\u0259 n\u0259tic\u0259l\u0259r")}</a><a class="btn sec" href="cedvel.html">\u{1F4CA} Turnir c\u0259dv\u0259li</a>${S.youtube ? `<a class="btn sec" href="${esc(S.youtube)}" target="_blank" rel="noopener">\u25B6 Canl\u0131 yay\u0131m</a>` : ""}</div><div class="kpis"><div class="kpi"><b data-count="${DONE.length}">0</b><span>Oyun</span></div><div class="kpi"><b data-count="${goals}">0</b><span>Qol</span></div><div class="kpi"><b data-count="${DONE.length ? goals / DONE.length : 0}" data-dec="1">0</b><span>Oyunda orta qol</span></div><div class="kpi"><b data-count="${L.teams.length}">0</b><span>Komanda</span></div></div></div>
 ${nx ? `<aside class="nxt rv"><h3>N\xD6VB\u018FT\u0130 OYUN</h3><div class="sub">${nx.round}-ci tur \xB7 ${fd(nx.date)} \xB7 ${esc(nx.time)} \xB7 ${esc(nx.venue || "")}</div><div class="vs"><a href="komanda.html?t=${nx.home}">${ball(nx.home, "lg")}<b>${esc(T[nx.home].name)}</b></a><em>VS</em><a href="komanda.html?t=${nx.away}">${ball(nx.away, "lg")}<b>${esc(T[nx.away].name)}</b></a></div><div class="cd" id="cd" data-t="${nx.date}T${nx.time}:00+04:00"><div><b>00</b><span>G\xDCN</span></div><div><b>00</b><span>SAAT</span></div><div><b>00</b><span>D\u018FQ</span></div><div><b>00</b><span>SAN</span></div></div>${nextM.length > 1 ? `<div class="nxt-list">${nextM.slice(nextM.indexOf(nx) + 1).map((m) => `<a href="matc.html?id=${encodeURIComponent(m.id)}">${ball(m.home, "xs")}<span>${esc(T[m.home].name)} \u2013 ${esc(T[m.away].name)}</span><time>${esc(m.time)}</time></a>`).join("")}</div>` : ""}</aside>` : '<aside class="nxt"><h3>M\xD6VS\xDCM</h3><div class="sub">N\xF6vb\u0259ti oyunlar tezlikl\u0259 elan olunacaq</div></aside>'}</div></section>`;
      const lastS = lastM.length ? `<section class="sec"><div class="wrap">${sech(`${lastR}-ci tur n\u0259tic\u0259l\u0259ri`, "\u018Fn son ke\xE7iril\u0259n oyunlar", ["oyunlar.html", "B\xFCt\xFCn oyunlar"])}<div class="mgrid">${lastM.map(mcard).join("")}</div></div></section>` : "";
      const nextS = nextM.length ? `<section class="sec" style="padding-top:0"><div class="wrap">${sech(`${nextR}-ci tur`, "N\xF6vb\u0259ti turun oyunlar\u0131")}<div class="mgrid">${nextM.map(mcard).join("")}</div></div></section>` : "";
      const tbl = `<section class="sec"><div class="wrap">${sech("Turnir c\u0259dv\u0259li", "Qrup m\u0259rh\u0259l\u0259sinin cari v\u0259ziyy\u0259ti", ["cedvel.html", "Tam c\u0259dv\u0259l"])}<div class="g2">${GROUPS.map((g) => tableHTML(g, false)).join("")}</div></div></section>`;
      const sc = `<section class="sec"><div class="wrap">${sech("Bombardirl\u0259r", "\u018Fn \xE7ox qol vuran oyun\xE7ular", ["bombardirler.html", "B\xFCt\xFCn siyah\u0131"])}<div class="sl">${topS.map((s) => `<div class="sr card rv"><span class="rk">${s.rank}</span>${ball(s.t, "sm")}<div><b>${esc(s.p)}</b><small>${esc(T[s.t].name)}</small></div><div class="bar" style="--w:${s.g / mx * 100}%"><i></i></div><span class="g">${s.g}</span></div>`).join("")}</div></div></section>`;
      const tm = `<section class="sec"><div class="wrap">${sech("Komandalar", `${L.teams.length} i\u015Ftirak\xE7\u0131`, ["komandalar.html", "Ham\u0131s\u0131"])}<div class="g4">${L.teams.map(teamCard).join("")}</div></div></section>`;
      const mv_ = mv.length ? `<section class="sec"><div class="wrap">${sech("Mat\xE7\u0131n \u0259n yax\u015F\u0131 oyun\xE7ular\u0131", "\u018Fn \xE7ox \u201C\u018Fn yax\u015F\u0131 oyun\xE7u\u201D se\xE7il\u0259nl\u0259r", ["statistika.html", "Statistika"])}<div class="card rv lst">${mv.map((x) => `<div class="li">${ball(x.t, "sm")}<div><b>${esc(x.p)}</b><small>${esc(T[x.t].name)}</small></div><span class="v">\u2605 ${x.n}</span></div>`).join("")}</div></div></section>` : "";
      const sections = { pulse: homePulse(), results: lastS, fixtures: nextS, table: tbl, videos: homeMedia(), scorers: sc, teams: tm, news: homeNews(), mvp: mv_ };
      return hero + (H.sections ? H.sections.filter((x) => x.visible).map((x) => sections[x.id] || "").join("") : homePulse() + lastS + nextS + tbl + homeMedia() + sc + tm + homeNews() + mv_);
    };
    function teamCard(t) {
      const r = STX[t.id];
      return `<a class="tcard card rv" style="--c:${t.color}" href="komanda.html?t=${t.id}">${ball(t.id, "lg")}<h3>${esc(t.name)}</h3><small>QRUP ${t.group} \xB7 ${r.rank}-ci YER</small>${formHTML(t.id)}<div class="pts">${r.x} xal \xB7 ${r.vq}:${r.bq} qol</div></a>`;
    }
    __name(teamCard, "teamCard");
    P.table = () => head("Turnir c\u0259dv\u0259li", "Qrup m\u0259rh\u0259l\u0259si. Komanda ad\u0131na basaraq hey\u0259t v\u0259 oyunlarla tan\u0131\u015F ola bil\u0259rsiniz.") + `<section class="sec"><div class="wrap"><div class="g2" style="grid-template-columns:1fr">${GROUPS.map((g) => tableHTML(g, true)).join('<div style="height:26px"></div>')}</div><div class="card rv legend" style="margin-top:26px"><span><b>O</b> Oyun</span><span><b>Q</b> Q\u0259l\u0259b\u0259</span><span><b>H</b> He\xE7-he\xE7\u0259</span><span><b>M</b> M\u0259\u011Flubiyy\u0259t</span><span><b>VQ</b> Vurulan qol</span><span><b>BQ</b> Burax\u0131lan qol</span><span><b>TF</b> Top f\u0259rqi</span><span><b>X</b> Xal</span></div></div></section><section class="sec" style="padding-top:0"><div class="wrap">${sech("S\u0131ralama qaydalar\u0131", "Komandalar xallar\u0131 b\u0259rab\u0259r olduqda a\u015Fa\u011F\u0131dak\u0131 ard\u0131c\u0131ll\u0131q t\u0259tbiq olunur")}<div class="card rv" style="padding:22px 28px"><ol class="rules">${L.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol></div></div></section>`;
    P.games = () => {
      const rs = [...new Set(M.map((m) => m.round))].sort((a, b) => a - b);
      return head("Oyunlar v\u0259 n\u0259tic\u0259l\u0259r", "B\xFCt\xFCn turlar\u0131n n\u0259tic\u0259l\u0259ri, qolvuranlar, kartlar v\u0259 mat\xE7\u0131n \u0259n yax\u015F\u0131 oyun\xE7usu.") + `<section class="sec"><div class="wrap"><div class="tabs" id="tabs"><button class="tab" data-r="all">Ham\u0131s\u0131</button>${rs.map((r) => `<button class="tab" data-r="${r}">${r}-ci tur</button>`).join("")}</div><div class="ctl"><select id="tf" aria-label="Komanda"><option value="">B\xFCt\xFCn komandalar</option>${L.teams.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div><div id="gl"></div></div></section>`;
    };
    P.games.init = () => {
      const rs = [...new Set(M.map((m) => m.round))].sort((a, b) => a - b);
      const fromMatch = M.find((m) => "#" + m.id === location.hash);
      let cur = fromMatch ? String(fromMatch.round) : location.hash.match(/^#r(\d+)$/) ? location.hash.slice(2) : String(PLAN.length ? PLAN[0].round : rs[rs.length - 1]);
      const draw = /* @__PURE__ */ __name(() => {
        const tf = $("#tf").value;
        $$(".tab").forEach((b) => b.classList.toggle("on", b.dataset.r === cur));
        const list = M.filter((m) => (cur === "all" || m.round == cur) && (!tf || m.home === tf || m.away === tf));
        const by = {};
        list.forEach((m) => (by[m.round] = by[m.round] || []).push(m));
        $("#gl").innerHTML = Object.keys(by).sort((a, b) => a - b).map((r) => `<div class="rh">${r}-ci tur<small>${esc(by[r][0].leg || "")}</small></div><div class="mgrid">${by[r].map(mcard).join("")}</div>`).join("") || '<div class="empty">Oyun tap\u0131lmad\u0131</div>';
        $$("#gl .rv").forEach((e) => setTimeout(() => e.classList.add("in"), 30));
        if (fromMatch && document.getElementById(fromMatch.id)) {
          const target = document.getElementById(fromMatch.id);
          target.classList.add("open");
          const btn = target.querySelector(".mc-more");
          if (btn) {
            btn.setAttribute("aria-expanded", "true");
            btn.textContent = "Ba\u011Fla \u25B4";
          }
          setTimeout(() => target.scrollIntoView({ block: "center" }), 100);
        }
      }, "draw");
      $("#tabs").onclick = (e) => {
        const b = e.target.closest(".tab");
        if (b) {
          cur = b.dataset.r;
          draw();
        }
      };
      $("#tf").onchange = draw;
      draw();
    };
    P.teams = () => head("Komandalar", `${L.teams.length} komanda. H\u0259r komandan\u0131n hey\u0259ti, oyunlar\u0131 v\u0259 g\xF6st\u0259ricil\u0259ri.`) + `<section class="sec"><div class="wrap"><div class="g4">${L.teams.map(teamCard).join("")}</div></div></section>`;
    P.team = () => {
      const id = new URLSearchParams(location.search).get("t"), t = T[id];
      if (!t) {
        location.replace("komandalar.html");
        return "";
      }
      const summary = teamSummary(L, id), r = { ...STX[id], o: summary.played, q: summary.wins, h: summary.draws, m: summary.losses, vq: summary.goalsFor, bq: summary.goalsAgainst, tf: summary.goalsFor - summary.goalsAgainst }, mine = M.filter((m) => m.home === id || m.away === id), mySc = SC.filter((s) => s.t === id), gmap = {};
      mySc.forEach((s) => gmap[tok(s.p)] = s.g);
      const cards = { y: 0, r: 0 };
      DONE.forEach((m) => m.cards.forEach((c) => {
        if (c.t === id) cards[c.c]++;
      }));
      const gs = mySc.reduce((a, s) => a + s.g, 0);
      return `<section class="th" style="--c:${t.color}"><div class="wrap th-in">${ball(id, "xl")}<div><span class="eyebrow">QRUP ${t.group}</span><h1>${esc(t.name)}</h1><div class="meta"><span>\u{1F3C6} <b>${r.rank}-ci yer</b></span><span>\u{1F4CA} <b>${r.x} xal</b></span>${t.coach ? `<span>\u{1F9D1}\u200D\u{1F3EB} Ba\u015F m\u0259\u015Fq\xE7i: <b>${esc(t.coach)}</b></span>` : ""}<span>Forma: ${formHTML(id)}</span></div><div class="sg"><div><b>${r.o}</b><span>OYUN</span></div><div><b>${r.q}</b><span>Q\u018FL\u018FB\u018F</span></div><div><b>${r.h}</b><span>HE\xC7-HE\xC7\u018F</span></div><div><b>${r.m}</b><span>M\u018F\u011ELUB.</span></div><div><b>${r.vq}</b><span>VURULAN</span></div><div><b>${r.bq}</b><span>BURAXILAN</span></div><div><b>${r.tf > 0 ? "+" : ""}${r.tf}</b><span>TOP F\u018FRQ\u0130</span></div><div><b>${cards.y}\u{1F7E8} ${cards.r}\u{1F7E5}</b><span>KARTLAR</span></div></div></div></div></section>
 <section class="sec"><div class="wrap">${sech("Oyunlar", "Komandan\u0131n b\xFCt\xFCn mat\xE7lar\u0131")}<div class="mgrid">${mine.map(mcard).join("")}</div></div></section>
 ${mySc.length ? `<section class="sec" style="padding-top:0"><div class="wrap">${sech("Komandan\u0131n bombardirl\u0259ri", `C\u0259mi ${gs} qol (\xF6z qap\u0131s\u0131na vurulanlar daxil deyil)`)}<div class="sl">${mySc.slice(0, 6).map((s, i) => `<div class="sr card rv"><span class="rk">${i + 1}</span>${ball(id, "sm")}<div><b>${esc(s.p)}</b><small>${s.mp} oyunda</small></div><div class="bar" style="--w:${s.g / mySc[0].g * 100}%"><i></i></div><span class="g">${s.g}</span></div>`).join("")}</div></div></section>` : ""}
 ${t.players.length ? `<section class="sec" style="padding-top:0"><div class="wrap">${sech("Hey\u0259t", `${t.players.length} oyun\xE7u`)}<div class="ros" style="--c:${t.color}">${t.players.map((p) => {
        const g = gmap[tok(p.name)];
        return `<a class="pl rv" href="${playerLink(id, p.name)}"><span class="nm">${esc(p.n)}</span><div><b>${esc(p.name)}${p.gk ? '<span class="tag">GK</span>' : ""}${p.cap === "C" ? '<span class="tag c">C</span>' : p.cap === "VC" ? '<span class="tag v">V</span>' : ""}</b><small>${p.gk ? "Qap\u0131\xE7\u0131" : "Oyun\xE7u"}</small></div>${g ? `<div class="gg">${g}<span>QOL</span></div>` : ""}</a>`;
      }).join("")}</div></div></section>` : ""}`;
    };
    P.scorers = () => head("Bombardirl\u0259r", "M\xF6vs\xFCm\xFCn \u0259n \xE7ox qol vuran oyun\xE7ular\u0131. \xD6z qap\u0131s\u0131na vurulan qollar hesaba daxil edilmir.") + `<section class="sec"><div class="wrap"><div class="podium">${[1, 0, 2].map((i) => SC[i] ? `<div class="pd card rv p${i + 1}"><span class="n">${i + 1}</span>${ball(SC[i].t, i ? "lg" : "xl")}<h4>${esc(SC[i].p)}</h4><small>${esc(T[SC[i].t].name).toUpperCase()}</small><div class="gl">${SC[i].g}<span>QOL</span></div></div>` : "").join("")}</div><div class="ctl"><input id="q" type="search" placeholder="Oyun\xE7u axtar\u2026" aria-label="Oyun\xE7u axtar"><select id="tf" aria-label="Komanda"><option value="">B\xFCt\xFCn komandalar</option>${L.teams.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div><div class="sl" id="sl"></div></div></section>`;
    P.scorers.init = () => {
      const mx = SC[0] ? SC[0].g : 1, draw = /* @__PURE__ */ __name(() => {
        const q = nrm($("#q").value), tf = $("#tf").value, a = SC.filter((s) => (!q || nrm(s.p).includes(q)) && (!tf || s.t === tf));
        $("#sl").innerHTML = a.map((s) => `<div class="sr card"><span class="rk">${s.rank}</span>${ball(s.t, "sm")}<div><b>${esc(s.p)}</b><small>${esc(T[s.t].name)} \xB7 ${s.mp} oyun</small></div><div class="bar go" style="--w:${s.g / mx * 100}%"><i></i></div><span class="g">${s.g}</span></div>`).join("") || '<div class="empty">Oyun\xE7u tap\u0131lmad\u0131</div>';
      }, "draw");
      $("#q").oninput = draw;
      $("#tf").onchange = draw;
      draw();
    };
    P.news = () => {
      const id = new URLSearchParams(location.search).get("id"), n = NEWS.find((n2) => n2.id === id);
      if (n) return head(esc(n.title), `${fmtShort(n.date)} \xB7 ${esc(n.source)}`) + `<section class="sec"><div class="wrap"><article class="card" style="padding:28px">${n.image ? `<img class="news-featured-image" src="${esc(n.image)}" alt="${esc(n.title)}">` : ""}<p>${esc(n.text || n.summary).replace(/\n/g, "<br>")}</p><a class="btn sec" href="xeberler.html">B\xFCt\xFCn x\u0259b\u0259rl\u0259r \u2192</a></article></div></section>`;
      return head("X\u0259b\u0259r m\u0259rk\u0259zi", "Sumqay\u0131t Super Liqa v\u0259 mini futbol al\u0259mind\u0259n se\xE7il\u0259n materiallar.") + `<section class="sec"><div class="wrap"><div class="editorial-intro"><span class="eyebrow">SSL / REDAKS\u0130YA</span><h2>Liqan\u0131n <em>g\xFCnd\u0259mind\u0259.</em></h2><p>Son x\u0259b\u0259rl\u0259r, oyun icmallar\u0131 v\u0259 meydandan k\u0259nar hekay\u0259l\u0259r.</p></div><div class="news-grid">${NEWS.map((n2, i) => newsCard(n2, i === 0)).join("")}</div></div></section>`;
    };
    P.media = () => head("SSL TV / Media", "Mat\xE7lar\u0131n videolar\u0131, sosial hesablar v\u0259 yay\u0131mlar\u0131n arxivi.") + `<section class="sec"><div class="wrap"><div class="broadcast-bar"><div><span class="eyebrow">R\u018FSM\u0130 KANAL</span><h2>OYUNU YEN\u0130D\u018FN YA\u015EA.</h2><p>Tam qar\u015F\u0131la\u015Fmalar v\u0259 g\u0259l\u0259c\u0259k canl\u0131 yay\u0131mlar \xFC\xE7\xFCn YouTube kanal\u0131na ke\xE7.</p></div><a class="btn pri" target="_blank" rel="noopener noreferrer" href="${esc(S.youtube || "#")}">\u25B6 YouTube kanal\u0131na ke\xE7 \u2197</a></div>${sech("Oyun videolar\u0131", "M\u0259lum v\u0259 yoxlan\u0131lm\u0131\u015F oyun yay\u0131mlar\u0131")}<div class="video-grid video-grid-all">${VIDEOS.map(videoCard).join("")}</div><div class="social-grid"><a href="${esc(S.instagram || "#")}" target="_blank" rel="noopener noreferrer"><b>IG</b><span><strong>Instagram</strong><small>Payla\u015F\u0131mlar v\u0259 oyun afi\u015Falar\u0131</small></span><span>\u2197</span></a><a href="${esc(S.youtube || "#")}" target="_blank" rel="noopener noreferrer"><b>YT</b><span><strong>YouTube</strong><small>Canl\u0131 yay\u0131mlar v\u0259 oyun arxivi</small></span><span>\u2197</span></a><a href="${esc(S.tiktok || "#")}" target="_blank" rel="noopener noreferrer"><b>TT</b><span><strong>TikTok</strong><small>Q\u0131sa videolar v\u0259 anlar</small></span><span>\u2197</span></a></div></div></section>`;
    P.about = () => {
      const a = CMS.about || {}, blocks = window.SSL_CMS ? window.SSL_CMS.renderBlocks(a.blocks) : "";
      return head(esc(a.title || "Liqa haqq\u0131nda"), esc(a.subtitle || "Sumqay\u0131tdan ba\u015Flayan mini futbol hekay\u0259si.")) + `<section class="sec"><div class="wrap"><div class="about-layout"><div class="about-statement"><span class="eyebrow">${esc(C.about?.city || "Sumqay\u0131t")} \xB7 ${esc(C.about?.season || L.season)}</span><h2>${esc(a.heading || "BU \u015E\u018FH\u018FRD\u018F OYUN B\u0130TM\u0130R.")}</h2><p>${esc(C.about?.mission || "Mini futbolun inki\u015Faf\u0131n\u0131 d\u0259st\u0259kl\u0259yirik.").replace(/\n/g, "<br>")}</p><a href="komandalar.html" class="btn pri">Komandalar\u0131 tan\u0131 \u2197</a></div><div class="about-monogram ${a.image ? "about-photo" : ""}"><img src="${esc(a.image || siteLogo)}" alt="${esc(a.title || S.name)}">${a.image ? "" : `<span>${esc(S.name || L.name)}</span>`}</div></div><div class="about-facts"><div><b>${esc(C.about?.season || L.season)}</b><span>BA\u015ELAN\u011EIC M\xD6VS\xDCM\xDC</span></div><div><b>${L.teams.length}</b><span>KOMANDA</span></div><div><b>${GROUPS.length}</b><span>QRUP</span></div><div><b>${esc(C.about?.venue || "AZFAR")}</b><span>OYUN M\u018FKANI</span></div></div><article class="cms-content cms-blocks">${blocks}</article></div></section>`;
    };
    P.custom = () => {
      const slug = location.pathname.split("/").at(-1), p = (CMS.pages || []).find((p2) => p2.slug === slug && p2.published);
      return p ? head(esc(p.title), esc(p.description)) + `<section class="sec"><div class="wrap"><article class="cms-content cms-blocks">${window.SSL_CMS.renderBlocks(p.blocks)}</article></div></section>` : head("S\u0259hif\u0259 tap\u0131lmad\u0131", "S\u0259hif\u0259 yay\u0131mlanmay\u0131b v\u0259 ya silinib.");
    };
    P.players = () => head("Futbol\xE7ular", "B\xFCt\xFCn komandalar\u0131n hey\u0259tl\u0259ri v\u0259 m\xF6vs\xFCmd\u0259 qeyd\u0259 al\u0131nm\u0131\u015F qol statistikas\u0131.") + `<section class="sec"><div class="wrap"><div class="roster-stat"><span>${L.teams.reduce((a, t) => a + (t.registeredPlayers ?? t.players.length), 0)} <small>L\u0130QA QEYD\u0130YYATI</small></span><span>${L.teams.length} <small>KOMANDA HEY\u018FT\u0130</small></span></div><div class="ctl pro-ctl"><input id="q" type="search" placeholder="Ad v\u0259 soyada g\xF6r\u0259 axtar..." aria-label="Futbol\xE7u axtar"><select id="tf" aria-label="Komanda"><option value="">B\xFCt\xFCn komandalar</option>${L.teams.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div><div id="players-list" class="player-grid"></div></div></section>`;
    P.players.init = () => {
      const ps = L.teams.flatMap((t) => t.players.map((p) => ({ t, p }))), render = /* @__PURE__ */ __name(() => {
        const q = nrm($("#q").value), tf = $("#tf").value;
        let a = ps.filter(({ t, p }) => (!tf || t.id === tf) && (!q || nrm(p.name).includes(q)));
        $("#players-list").innerHTML = a.map(({ t, p }) => {
          const goals = findPlayerGoals(t.id, p.name).length;
          return `<a class="player-tile" href="${playerLink(t.id, p.name)}"><span class="player-number">${esc(p.n)}</span>${ball(t.id, "sm")}<span class="player-label"><strong>${esc(p.name)}</strong><small>${esc(t.name)} \xB7 ${playerBadge(p)}</small></span><span class="player-score">${goals ? goals + " \u26BD" : "\u2197"}</span></a>`;
        }).join("") || '<div class="empty">Axtar\u0131\u015Fa uy\u011Fun futbol\xE7u yoxdur</div>';
      }, "render");
      $("#q").addEventListener("input", render);
      $("#tf").addEventListener("change", render);
      render();
    };
    P.player = () => {
      const pms = new URLSearchParams(location.search), tid = pms.get("t"), name = pms.get("p"), team = T[tid], p = team?.players.find((x) => x.name === name);
      if (!team || !p) return head("Futbol\xE7u tap\u0131lmad\u0131", "Futbol\xE7ular siyah\u0131s\u0131na qay\u0131d\u0131n.") + `<section class="sec"><div class="wrap"><a class="btn pri" href="futbolcular.html">Futbol\xE7ulara bax \u2192</a></div></section>`;
      const gl = findPlayerGoals(tid, p.name), games = [...new Map(gl.map((x) => [x.m.id, x.m])).values()], y = DONE.reduce((a, m) => a + m.cards.filter((c) => c.t === tid && tok(c.p) === tok(name) && c.c === "y").length, 0), red = DONE.reduce((a, m) => a + m.cards.filter((c) => c.t === tid && tok(c.p) === tok(name) && c.c === "r").length, 0);
      return `<section class="player-hero"><div class="wrap player-hero-inner" style="--c:${esc(team.color)}"><div class="player-back-num">${esc(p.n)}</div><div><a class="crumb" href="futbolcular.html">\u2190 B\xDCT\xDCN FUTBOL\xC7ULAR</a><span class="eyebrow">${playerBadge(p)} \xB7 ${esc(team.name)}</span><h1>${esc(p.name)}</h1><p>${p.cap === "C" ? "Komandan\u0131n kapitan\u0131" : p.cap === "VC" ? "Kapitan m\xFCavini" : p.gk ? "Qap\u0131\xE7\u0131" : "Komandan\u0131n futbol\xE7usu"}</p><a class="player-club" href="komanda.html?t=${team.id}">${ball(team.id, "sm")}${esc(team.name)} \u2197</a></div></div></section><section class="sec"><div class="wrap"><div class="about-facts player-facts"><div><b>${gl.length}</b><span>QOL</span></div><div><b>${games.length}</b><span>QOL VURDU\u011EU MAT\xC7</span></div><div><b>${y}</b><span>SARI KART</span></div><div><b>${red}</b><span>QIRMIZI KART</span></div></div>${games.length ? `${sech("Qol vurdu\u011Fu mat\xE7lar", "Yaln\u0131z m\xFC\u0259llifi d\u0259qiq qeyd\u0259 al\u0131nm\u0131\u015F qollar")}<div class="mgrid">${games.map(mcard).join("")}</div>` : `<p class="player-note">Bu futbol\xE7unun ad\u0131na uy\u011Fun qol qeydi tap\u0131lmad\u0131. Qol statistikas\u0131nda adlar\u0131n yaz\u0131l\u0131\u015F f\u0259rql\u0259ri n\u0259tic\u0259y\u0259 t\u0259sir ed\u0259 bil\u0259r.</p>`}</div></section>`;
    };
    P.match = () => {
      const id = new URLSearchParams(location.search).get("id"), m = M.find((m2) => m2.id === id);
      if (!m) return head("Mat\xE7 tap\u0131lmad\u0131", "Oyunun linkini yoxlay\u0131n.") + `<section class="sec"><div class="wrap"><a class="btn pri" href="oyunlar.html">Oyunlara qay\u0131t \u2192</a></div></section>`;
      const d = m.status === "done", vid = VIDEOS.find((v) => v.match === m.id), homeGoals = m.goals.filter((g) => cr(m, g) === m.home), awayGoals = m.goals.filter((g) => cr(m, g) === m.away), homeCards = m.cards.filter((c) => c.t === m.home), awayCards = m.cards.filter((c) => c.t === m.away);
      const ev = /* @__PURE__ */ __name((gs, cs) => [...gs.map((g) => ({ type: "\u26BD", p: g.unk ? g.og ? "Avtoqol \xB7 m\xFC\u0259llif qeyd edilm\u0259yib" : "M\xFC\u0259llif qeyd edilm\u0259yib" : playerName(g.p), note: g.og ? "\xD6z qap\u0131s\u0131na" : "" })), ...cs.map((c) => ({ type: c.c === "r" ? "\u{1F7E5}" : "\u{1F7E8}", p: c.p, note: c.c === "r" ? "Q\u0131rm\u0131z\u0131 kart" : "Sar\u0131 kart" }))].map((x) => `<div class="event"><span>${x.type}</span><div><b>${esc(x.p)}</b>${x.note ? `<small>${esc(x.note)}</small>` : ""}</div></div>`).join("") || '<div class="empty">Hadis\u0259 m\u0259lumat\u0131 qeyd edilm\u0259yib</div>', "ev");
      return `<section class="match-hero"><div class="wrap"><a class="crumb" href="oyunlar.html">\u2190 B\xDCT\xDCN OYUNLAR</a><div class="match-heading"><span>${matchLabel(m).toLocaleUpperCase("az")} \xB7 ${esc(m.leg || "")}</span><span class="match-status ${d ? "done" : ""}">${d ? "TAMAMLANDI" : "PLANLA\u015EDIRILIB"}</span></div><h1 class="sr-only">${esc(T[m.home].name)} \u2014 ${esc(T[m.away].name)}</h1><div class="match-showdown"><a href="komanda.html?t=${m.home}">${ball(m.home, "xl")}<strong>${esc(T[m.home].name)}</strong></a><div class="match-central">${d ? `<div class="match-result">${m.hs}<i>:</i>${m.as}</div>` : '<div class="match-result upcoming">VS</div>'}<span>${fd(m.date)} \xB7 ${esc(m.time)}</span><span>${esc(m.venue || "")}</span></div><a href="komanda.html?t=${m.away}">${ball(m.away, "xl")}<strong>${esc(T[m.away].name)}</strong></a></div></div></section><section class="sec"><div class="wrap"><div class="match-dashboard"><div class="card"><h2 class="dash-title">OYUNUN HAD\u0130S\u018FL\u018FR\u0130</h2>${d ? `<div class="events-cols"><div><h3>${esc(T[m.home].name)}</h3>${ev(homeGoals, homeCards)}</div><div><h3>${esc(T[m.away].name)}</h3>${ev(awayGoals, awayCards)}</div></div>` : '<div class="empty">Oyun ba\u015Flad\u0131qdan sonra qeyd\u0259 al\u0131nan hadis\u0259l\u0259r burada olacaq.</div>'}${m.mvp ? `<div class="match-mvp">\u2605 MAT\xC7IN \u018FN YAX\u015EI OYUN\xC7USU <b>${esc(m.mvp.p)}</b> <span>${esc(T[m.mvp.t].name)}</span></div>` : ""}</div><aside class="match-sidebar"><div class="card match-side-box"><h3>OYUN KARTI</h3><div><span>Tur</span><b>${m.round}</b></div><div><span>Tarix</span><b>${fd(m.date)}</b></div><div><span>Ba\u015Flama saat\u0131</span><b>${esc(m.time)}</b></div><div><span>M\u0259kan</span><b>${esc(m.venue || "")}</b></div><div><span>V\u0259ziyy\u0259t</span><b>${d ? "Tamamlan\u0131b" : "Planla\u015Fd\u0131r\u0131l\u0131b"}</b></div></div>${vid ? `<div class="card match-video"><span class="eyebrow">SSL TV</span><h3>BU OYUNU \u0130ZL\u018F</h3><p>Mat\xE7\u0131n video yaz\u0131s\u0131na bax.</p><a class="btn pri" href="${esc(vid.url)}" target="_blank" rel="noopener noreferrer">\u25B6 YouTube-da izl\u0259 \u2197</a></div>` : `<div class="card match-video"><span class="eyebrow">SSL TV</span><h3>V\u0130DEO ARX\u0130V\u0130</h3><p>Bu oyun \xFC\xE7\xFCn t\u0259sdiql\u0259nmi\u015F video linki h\u0259l\u0259 daxil edilm\u0259yib.</p><a class="btn sec" href="media.html">Dig\u0259r videolar \u2192</a></div>`}</aside></div></div></section>`;
    };
    P.stats = () => {
      const rs = [...new Set(DONE.map((m) => m.round))].sort((a, b) => a - b), pr = rs.map((r) => ({ r, g: DONE.filter((m) => m.round === r).reduce((a, m) => a + m.hs + m.as, 0), n: DONE.filter((m) => m.round === r).length })), mxg = Math.max(1, ...pr.map((x) => x.g));
      const TS = L.teams.map((t) => {
        const s = teamSummary(L, t.id);
        return { t, o: s.played, vq: s.goalsFor, bq: s.goalsAgainst };
      }), att = TS.slice().sort((a, b) => b.vq / Math.max(1, b.o) - a.vq / Math.max(1, a.o)), def = TS.slice().sort((a, b) => a.bq / Math.max(1, a.o) - b.bq / Math.max(1, b.o));
      const cd = L.teams.map((t) => ({ t, y: 0, r: 0 }));
      DONE.forEach((m) => m.cards.forEach((c) => {
        const x = cd.find((z) => z.t.id === c.t);
        x[c.c]++;
      }));
      cd.sort((a, b) => a.r - b.r || a.y - b.y);
      const hat = [];
      DONE.forEach((m) => {
        const mp = {};
        m.goals.forEach((g) => {
          if (g.og || g.unk) return;
          const k = tok(g.p) + "|" + g.t;
          mp[k] = mp[k] || { p: playerName(g.p), t: g.t, n: 0 };
          mp[k].n++;
        });
        Object.values(mp).filter((x) => x.n >= 3).forEach((x) => hat.push({ ...x, m }));
      });
      hat.sort((a, b) => b.n - a.n);
      const big = DONE.slice().sort((a, b) => Math.abs(b.hs - b.as) - Math.abs(a.hs - a.as) || b.hs + b.as - (a.hs + a.as)).slice(0, 3), hi = DONE.slice().sort((a, b) => b.hs + b.as - (a.hs + a.as)).slice(0, 3), og = DONE.reduce((a, m) => a + m.goals.filter((g) => g.og).length, 0), mv = mvps().slice(0, 8);
      const mrow = /* @__PURE__ */ __name((m) => `<a class="li" href="matc.html?id=${encodeURIComponent(m.id)}">${ball(m.home, "xs")}<div><b>${esc(T[m.home].name)} ${m.hs}\u2013${m.as} ${esc(T[m.away].name)}</b><small>${matchLabel(m)} \xB7 ${fd(m.date)}</small></div>${ball(m.away, "xs")}</a>`, "mrow");
      return head("Statistika", "M\xF6vs\xFCm\xFCn r\u0259q\u0259ml\u0259ri, rekordlar v\u0259 \u0259n yax\u015F\u0131lar.") + `<section class="sec"><div class="wrap"><div class="kpis" style="margin:0 0 34px"><div class="kpi"><b data-count="${DONE.length}">0</b><span>Oyun</span></div><div class="kpi"><b data-count="${DONE.reduce((a, m) => a + m.hs + m.as, 0)}">0</b><span>Qol</span></div><div class="kpi"><b data-count="${DONE.reduce((a, m) => a + m.cards.filter((c) => c.c === "y").length, 0)}">0</b><span>Sar\u0131 kart</span></div><div class="kpi"><b data-count="${DONE.reduce((a, m) => a + m.cards.filter((c) => c.c === "r").length, 0)}">0</b><span>Q\u0131rm\u0131z\u0131 kart</span></div></div>
 <div class="g2"><div class="card rv"><div class="ch">TURLAR \xDCZR\u018F QOLLAR</div><div class="chart">${pr.map((x) => `<div class="col" style="--h:${x.g / mxg * 190}px"><b>${x.g}</b><i></i><span>${x.r}-ci TUR</span></div>`).join("")}</div></div>
 <div class="card rv"><div class="ch">REKORDLAR</div><div class="lst">${big[0] ? `<div class="li"><div><b>\u018Fn b\xF6y\xFCk hesab f\u0259rqi</b><small>${esc(T[big[0].home].name)} ${big[0].hs}\u2013${big[0].as} ${esc(T[big[0].away].name)}</small></div><span class="v">+${Math.abs(big[0].hs - big[0].as)}</span></div>` : ""}${hi[0] ? `<div class="li"><div><b>\u018Fn \xE7ox qollu oyun</b><small>${esc(T[hi[0].home].name)} ${hi[0].hs}\u2013${hi[0].as} ${esc(T[hi[0].away].name)}</small></div><span class="v">${hi[0].hs + hi[0].as}</span></div>` : ""}${hat[0] ? `<div class="li"><div><b>Bir oyunda \u0259n \xE7ox qol</b><small>${esc(hat[0].p)} (${esc(T[hat[0].t].name)})</small></div><span class="v">${hat[0].n}</span></div>` : ""}<div class="li"><div><b>\xD6z qap\u0131s\u0131na vurulan qol</b><small>M\xF6vs\xFCm \u0259rzind\u0259</small></div><span class="v">${og}</span></div><div class="li"><div><b>Oyunda orta qol</b><small>B\xFCt\xFCn ke\xE7irilmi\u015F oyunlar</small></div><span class="v">${DONE.length ? (DONE.reduce((a, m) => a + m.hs + m.as, 0) / DONE.length).toFixed(1) : 0}</span></div></div></div></div>
 <div class="g2" style="margin-top:22px"><div class="card rv"><div class="ch">\u018FN G\xDCCL\xDC H\xDCCUM <small style="color:var(--mut)">(oyunda orta qol)</small></div><div class="lst">${att.slice(0, 4).map((x) => `<a class="li" href="komanda.html?t=${x.t.id}">${ball(x.t.id, "sm")}<div><b>${esc(x.t.name)}</b><small>${x.vq} qol \xB7 ${x.o} oyun</small></div><span class="v">${(x.vq / Math.max(1, x.o)).toFixed(1)}</span></a>`).join("")}</div></div>
 <div class="card rv"><div class="ch">\u018FN G\xDCCL\xDC M\xDCDAF\u0130\u018F <small style="color:var(--mut)">(oyunda burax\u0131lan qol)</small></div><div class="lst">${def.slice(0, 4).map((x) => `<a class="li" href="komanda.html?t=${x.t.id}">${ball(x.t.id, "sm")}<div><b>${esc(x.t.name)}</b><small>${x.bq} qol \xB7 ${x.o} oyun</small></div><span class="v">${(x.bq / Math.max(1, x.o)).toFixed(1)}</span></a>`).join("")}</div></div></div>
 <div class="g2" style="margin-top:22px"><div class="card rv"><div class="ch">KARTLAR (az olandan \xE7oxa)</div><div class="lst">${cd.map((x) => `<a class="li" href="komanda.html?t=${x.t.id}">${ball(x.t.id, "sm")}<b>${esc(x.t.name)}</b><span class="v">${x.y}\u{1F7E8} ${x.r}\u{1F7E5}</span></a>`).join("")}</div></div>
 <div class="card rv"><div class="ch">\u018FN YAX\u015EI OYUN\xC7ULAR (MVP)</div><div class="lst">${mv.map((x) => `<div class="li">${ball(x.t, "sm")}<div><b>${esc(x.p)}</b><small>${esc(T[x.t].name)}</small></div><span class="v">\u2605 ${x.n}</span></div>`).join("")}</div></div></div>
 ${hat.length ? `<div class="card rv" style="margin-top:22px"><div class="ch">3 V\u018F DAHA \xC7OX QOL (HET-TR\u0130K)</div><div class="lst">${hat.map((x) => `<a class="li" href="matc.html?id=${encodeURIComponent(x.m.id)}">${ball(x.t, "sm")}<div><b>${esc(x.p)}</b><small>${esc(T[x.m.home].name)} ${x.m.hs}\u2013${x.m.as} ${esc(T[x.m.away].name)} \xB7 ${fd(x.m.date)}</small></div><span class="v">${x.n} qol</span></a>`).join("")}</div></div>` : ""}
 <div class="g2" style="margin-top:22px"><div class="card rv"><div class="ch">\u018FN B\xD6Y\xDCK Q\u018FL\u018FB\u018FL\u018FR</div><div class="lst">${big.map(mrow).join("")}</div></div><div class="card rv"><div class="ch">\u018FN QOLLU OYUNLAR</div><div class="lst">${hi.map(mrow).join("")}</div></div></div></div></section>`;
    };
    const arena = installArena({ P, L, S, C, CMS, H, B, T, M, DONE, PLAN, GROUPS, ST, STX, SC, PAGE, NAV, $, $$, esc, fd, fs, fmtShort, ball, mcard, tableHTML, head, sech, formHTML, homeMedia, homeNews, mvps, playerLink });
    chrome();
    const fn = P[PAGE];
    if (fn) {
      $("#app").innerHTML = fn();
      if (fn.init) fn.init();
    }
    arena.bind();
    pageEnd();
    document.title = ({ home: "", playoffs: "Yar\u0131mfinal \xB7 ", compare: "Komandalar\u0131 m\xFCqayis\u0259 et \xB7 ", table: "Turnir c\u0259dv\u0259li \xB7 ", games: "Oyunlar v\u0259 n\u0259tic\u0259l\u0259r \xB7 ", teams: "Komandalar \xB7 ", scorers: "Bombardirl\u0259r \xB7 ", stats: "Statistika \xB7 ", news: "X\u0259b\u0259rl\u0259r \xB7 ", media: "SSL TV \xB7 ", about: "Liqa haqq\u0131nda \xB7 ", players: "Futbol\xE7ular \xB7 ", player: "Futbol\xE7u \xB7 ", match: "Mat\xE7 m\u0259rk\u0259zi \xB7 " }[PAGE] || "") + (PAGE === "team" && T[new URLSearchParams(location.search).get("t")] ? T[new URLSearchParams(location.search).get("t")].name + " \xB7 " : "") + (S.name || L.name);
    if (PAGE === "home" && CMS.seo?.title) document.title = CMS.seo.title;
    if (PAGE === "about") document.title = (CMS.about?.title || "Liqa haqq\u0131nda") + " \xB7 " + (S.name || L.name);
    if (PAGE === "custom") {
      const p = (CMS.pages || []).find((p2) => p2.published && p2.slug === location.pathname.split("/").at(-1));
      if (p) document.title = p.title + " \xB7 " + (S.name || L.name);
    }
  })();
})();
