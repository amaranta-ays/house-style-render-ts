# house-style-render-ts

TypeScript renderer for the AI-Lab house style. Markdown → house-styled HTML via preprocessor + remark/rehype pipeline + medium-specific adapters (React, vanilla, email).

## Install

```bash
npm install github:amaranta-ays/house-style-render-ts#v0.1.0
```

Pin to a specific tag in production consumers; bump the tag when you want updates.

## Exports

| Subpath | Purpose |
|---|---|
| `house-style-render-ts` | Main renderer + React components (`OrbitSpinner`, `MarkdownMessage`) |
| `house-style-render-ts/styles.css` | Design tokens (CSS custom properties) |
| `house-style-render-ts/components.css` | Component styles |
| `house-style-render-ts/preprocessor` | Markdown preprocessor only |
| `house-style-render-ts/email` | Email adapter |

## Local development

Use `npm link` for live editing across consumers:

```bash
# In this repo
npm link

# In a consumer (e.g., netsuite-command-center/dashboard)
npm link house-style-render-ts
```

## Release flow

1. Edit code, or — if updating design tokens — edit `~/ai-lab/plugins/house-style-render/shared/(tokens|components).css` (the source of truth).
2. If you edited the shared CSS, run `~/ai-lab/scripts/sync-house-style.ps1` to refresh this package's `styles/` snapshot.
3. `npm run build` — refresh `dist/` (committed).
4. Bump `version` in `package.json`.
5. Commit + push.
6. `git tag vX.Y.Z && git push origin vX.Y.Z`.
7. Consumers bump the `#vX.Y.Z` tag in their `package.json` and `npm install`.

## Notes

`styles/tokens.css` and `styles/components.css` are bundled copies of the design tokens originally maintained in `ai-lab/plugins/house-style-render/shared/`. Until cross-language tooling unifies them, treat the copies here as authoritative for TS consumers.
