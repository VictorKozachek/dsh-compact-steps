/**
 * dsh-compact-steps — браузерная половина.
 *
 * Не полагается на хешированные CSS-классы: находит журнал шагов по содержимому
 * (контейнер, у которого много детей, начинающихся с меток инструментов) и
 * помечает его атрибутом data-dsh-compact-steps. CSS ограничивает высоту,
 * включает прокрутку и мягкий градиент; двойной клик разворачивает/сворачивает.
 */
window.__ModuleLoader__.load({
  id: "dsh-compact-steps",
  factory: () => {
    const STYLE_ID = "dsh-compact-steps-style";
    const ATTR = "data-dsh-compact-steps";
    const LABELS = /^(Bash|Think|Ran|Read|Write|Edit|Glob|Grep|Todo|Wait|Search|Fetch|✻|⏺|⏸|🔧|🛠|⚙)/;

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        [${ATTR}="on"] {
          max-height: 120px;
          overflow-y: auto;
          overscroll-behavior: contain;
          mask-image: linear-gradient(to bottom, #000 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 70%, transparent 100%);
          padding-right: 6px;
          scrollbar-width: thin;
        }
        [${ATTR}="off"] { max-height: none; mask-image: none; -webkit-mask-image: none; }
        [${ATTR}] { transition: max-height .15s ease; }
      `;
      document.head.appendChild(style);
    }

    function isCandidate(el) {
      if (!el || el.children.length < 8) return false;
      let hits = 0;
      const kids = [...el.children];
      for (const k of kids.slice(0, 40)) {
        const t = (k.textContent || "").trim();
        if (LABELS.test(t)) hits++;
      }
      return hits >= Math.min(6, Math.ceil(kids.length * 0.5));
    }

    function scan() {
      injectStyle();
      const all = document.querySelectorAll("div, section, ul, ol, article");
      for (const el of all) {
        if (el.hasAttribute(ATTR)) continue;
        if (!isCandidate(el)) continue;
        el.setAttribute(ATTR, "on");
        el.title = "Журнал шагов сжат. Двойной клик — развернуть.";
        el.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          el.setAttribute(ATTR, el.getAttribute(ATTR) === "on" ? "off" : "on");
        });
      }
    }

    let pending = false;
    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; try { scan(); } catch (e) {} });
    }

    const start = () => {
      scan();
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();

    return {};
  },
});
