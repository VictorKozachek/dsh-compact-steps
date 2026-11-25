# dsh-compact-steps

DeepSeek Harness plugin that collapses the **session step journal** (the "Bash · …",
"Think · …", "Read · …" rows) into a compact scrollable strip instead of a long wall of text.

## What it does

- Finds the step journal by **content**, not by hashed CSS classes: a container whose
  children mostly start with tool labels (`Bash`, `Think`, `Ran`, `Read`, `Write`, `Edit`,
  `Glob`, `Grep`, `Todo`, `Search`, `Fetch`, `✻`, `⏺`, `⏸`).
- Limits it to **120 px** with scroll and a soft fade at the bottom.
- **Double-click** the strip to expand/collapse.
- Watches the DOM with `MutationObserver`, so newly appended steps stay inside the strip.

No server-side code, no network calls, no data collected.

## Install

```bash
# from a local checkout
dsh plugin add /path/to/dsh-compact-steps

# or by hand: link the package into the web profile and add it to bundles
ln -s /path/to/dsh-compact-steps ~/.dsh/profiles/web/node_modules/dsh-compact-steps
# then add "dsh-compact-steps" to dsh.profile.bundles in ~/.dsh/profiles/web/package.json
# and run pnpm install in that profile
```

Reload the Web UI (Cmd/Ctrl+Shift+R) after installing.

## How it works

`lib/client.js` is a browser-side module registered through
`window.__ModuleLoader__.load`. It injects a small stylesheet and scans the DOM for the
step-journal container, tagging it with `data-dsh-compact-steps="on"`. CSS does the
rest:

```css
[data-dsh-compact-steps="on"] {
  max-height: 120px;
  overflow-y: auto;
  mask-image: linear-gradient(to bottom, #000 70%, transparent 100%);
}
```

Double-click toggles the attribute between `on` and `off`.

## Notes and limitations

- The detection is heuristic by design: DSH's web UI uses hashed CSS-module class names
  that change between builds, so content matching is the stable contract.
- If your locale changes the tool row labels, extend `LABELS` in `lib/client.js`.
- The plugin only affects presentation; it never changes session state or logs.
- `lib/index.js` must export `apply()` — DSH discovers the browser half only for plugin
  rows that are valid host plugin modules.

## License

MIT
