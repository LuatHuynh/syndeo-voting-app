# Development and Release Workflow

## Prerequisites

- Node.js is required. The active terminal context indicates Node 20 is selected; keep the installed dependencies compatible with the project lockfile/package manager in use.
- Zalo Mini App CLI provides login, testing, and deployment capabilities. See the [official CLI guide](https://docs.zaloplatforms.com/docs/MA/devtools/cli/intro).
- For the full host experience, use the Zalo Mini App VS Code extension or CLI preview/testing flow. A plain browser does not validate all `zmp-sdk` APIs.

## Package scripts

| Script      | Command             | Purpose                                                                                                                                                                                                       |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development | `npm run start`     | runs `zmp start`.                                                                                                                                                                                             |
| Deployment  | `npm run deploy`    | runs `zmp deploy`; authenticate first using the supported Zalo workflow.                                                                                                                                      |
| CSS build   | `npm run build:css` | runs a PostCSS command targeting `src/css/tailwind.css` and `src/css/styles.css`. Verify these paths before relying on this inherited script because the active global stylesheet is `src/css/tailwind.scss`. |

The README notes historic compatibility concerns between Vite 5 and certain older Zalo Mini App tooling. Treat the current official documentation and the installed extension/CLI versions as authoritative when selecting a development flow.

## Recommended change workflow

1. Read the relevant document in this context library before making changes.
2. Keep `app-config.json` valid JSON and root-scoped.
3. For a UI-only change, validate in the local development view and on relevant small-device layouts.
4. For route changes, test direct navigation and a Zalo deep link under the host-specific base path.
5. For API changes, test both configured-API mode and mock fallback where practical; ensure error fallback behavior remains intentional.
6. For SDK calls, verify in a logged-in Zalo test/preview environment and test denial/failure paths.
7. Before deployment, confirm the correct Mini App identity, environment, OA configuration, backend origin, and payment setup. Do not deploy placeholder configuration as a production release.

## Production-readiness gaps currently visible

- No remote API origin is configured, so live catalog and order persistence are absent.
- Cart state is only in memory and disappears on a reload or app restart.
- The payment call has no visible server-side order creation, payment verification, or fulfilment integration.
- Product and application branding is inconsistent across metadata, README content, and UI text.
- `zmp-cli.json` retains generator/template values, including a state-management declaration that does not match the actual Jotai implementation.

Treat these as known implementation gaps, not automatic change requests. Confirm product and integration requirements before addressing them.
