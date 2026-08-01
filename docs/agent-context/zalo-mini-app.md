# Zalo Mini App Platform Context

## Platform model

A Zalo Mini App is a web application running inside the Zalo ecosystem. This project uses standard React and web APIs for its view and application logic, while `zmp-sdk` bridges to Zalo-host capabilities such as identity, payments, sharing, and Official Accounts. Browser-only local development cannot fully prove host-dependent behavior; verify it in the Zalo Mini App test or preview environment.

Primary official references:

- [Mini App platform overview](https://docs.zaloplatforms.com/docs/MA)
- [Getting-started and delivery workflow](https://docs.zaloplatforms.com/docs/MA/intro/getting-started)
- [Mini App API reference](https://docs.zaloplatforms.com/docs/MA/api/intro)
- [App configuration reference](https://docs.zaloplatforms.com/docs/MA/devtools/app-config)
- [Zalo Mini App CLI](https://docs.zaloplatforms.com/docs/MA/devtools/cli/intro)

## Project configuration

`app-config.json` is at the repository root, as required by the platform. Its current effective configuration is:

| Field                                  | Current value             | Meaning                                                                                                     |
| -------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `app.title`                            | `test`                    | Mini App name / required application title.                                                                 |
| `app.textColor`                        | `black`                   | default navigation and status-bar text/icon color.                                                          |
| `app.headerColor`                      | `#ffffff`                 | default navigation/status-bar color in normal status-bar mode.                                              |
| `app.statusBar`                        | `normal`                  | standard status-bar presentation.                                                                           |
| `app.actionBarHidden`                  | `true`                    | hides the default Mini App navigation bar; this app supplies its own header.                                |
| `app.hideAndroidBottomNavigationBar`   | `false`                   | preserves Android bottom navigation.                                                                        |
| `app.hideIOSSafeAreaBottom`            | `true`                    | hides the iOS bottom safe-area inset. Validate real device layout when changing it.                         |
| `app.selfControlLoading`               | `false`                   | platform dismisses splash loading automatically. Do not call `closeLoading` unless changing this to `true`. |
| `listCSS`, `listSyncJS`, `listAsyncJS` | empty arrays              | no separately declared external resources.                                                                  |
| `template.apiUrl`                      | empty string              | activates bundled mock-data mode.                                                                           |
| `template.oaIDtoOpenChat`              | configured numeric string | OA identifier used by customer-support chat.                                                                |

Configuration is loaded directly by `src/app.ts` and read in application code through `src/utils/template.ts`. Put deploy-specific values in configuration and access them via `getConfig()`; do not duplicate them across components.

## Current SDK integrations

| Feature          | SDK API            | Source                                | Implementation notes                                                                                                                                                                       |
| ---------------- | ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| User data        | `getUserInfo()`    | `src/state.ts`                        | asynchronous atom; no explicit permission request is configured. Treat availability and consent as runtime outcomes.                                                                       |
| Customer support | `openChat()`       | `src/hooks.ts`                        | opens the OA ID from `template.oaIDtoOpenChat`.                                                                                                                                            |
| Payment          | `purchase()`       | `src/hooks.ts`                        | called with cart total and Vietnamese order description; success currently clears only local cart state. Confirm payment/order fulfilment with backend requirements before production use. |
| OA follow UI     | `showOAWidget()`   | `src/pages/profile/follow-oa.tsx`     | renders into the `oaWidget` element. OA authentication/eligibility may be required by Zalo.                                                                                                |
| Sharing          | `openShareSheet()` | `src/pages/catalog/share-buttont.tsx` | shares a `zmp_deep_link` with a product title, image, and `/product/:id` path.                                                                                                             |

## Host-integration rules

- Import Zalo APIs from `zmp-sdk`, not from browser globals.
- Await SDK calls and surface a useful failure state. Users can deny permissions, a client may lack capability support, and API calls can fail outside the Zalo host.
- Request only the necessary permissions and explain why before prompting. Do not claim a permission or payment succeeded until the SDK response and required server-side verification complete.
- Keep deep-link paths aligned with `src/router.tsx` and retain the environment-aware basename in `getBasePath()`.
- For an API that requires platform setup, version support, authentication, OA association, or payment approval, consult the linked official API reference before coding and record the operational requirement in the feature documentation.

## Theme and localization options

The official app-configuration reference supports object forms for `headerColor` and `textColor` with `light` and `dark` values, and localized `headerTitle` values such as `vi` and `en`. The repository currently uses simple string values. Only adopt these options after confirming target Zalo client support and visual QA in both themes.
