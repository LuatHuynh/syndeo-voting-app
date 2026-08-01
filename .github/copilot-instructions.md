# Syndeo Mini App: agent context

This repository is a React-based Zalo Mini App. Before modifying code, load the applicable document from [docs/agent-context/README.md](../docs/agent-context/README.md):

- Read [architecture.md](../docs/agent-context/architecture.md) for routes, state, data flow, and source ownership.
- Read [zalo-mini-app.md](../docs/agent-context/zalo-mini-app.md) before changing Zalo SDK calls, Mini App configuration, sharing, OA, payment, or routing behavior.
- Read [development.md](../docs/agent-context/development.md) before changing dependencies, build tooling, styling, or preparing a release.

## Working rules

- Preserve the current stack: React 18, TypeScript, React Router, Jotai, ZaUI, `zmp-sdk`, Vite, Tailwind, and SCSS.
- Use `@/` imports for modules under `src/`.
- Register full-screen views in `src/router.tsx`; page-level route metadata controls the custom header.
- Read configuration through `getConfig()` when application code needs `app-config.json` values. Do not hard-code OA IDs, API origins, or environment-specific values in components.
- Keep the mock-data fallback operational when introducing or changing API calls.
- Treat Zalo APIs as runtime integrations: handle rejected promises, permission denial, and host/client capability constraints gracefully.
- Keep `app-config.json`, `zmp-cli.json`, and package metadata aligned with confirmed product decisions. The current repository contains inherited template metadata that may be stale; do not treat it as product truth without verification.
