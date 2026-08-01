# Technical Stack

## Application runtime

| Area                   | Technology                   | Current version / configuration                      |
| ---------------------- | ---------------------------- | ---------------------------------------------------- |
| UI runtime             | React and React DOM          | `18.3.1`                                             |
| Language               | TypeScript                   | strict checking; `ES6` target; JSX automatic runtime |
| Routing                | React Router DOM             | `6.23.0`, browser router                             |
| State                  | Jotai                        | `2.10.0`                                             |
| Zalo host integration  | `zmp-sdk`                    | `2.41.0`                                             |
| Zalo component library | `zmp-ui`                     | `1.11.5`                                             |
| Notifications          | React Hot Toast              | `2.4.1`                                              |
| Carousel               | Embla React and Autoplay     | `8.3.0`                                              |
| Motion / gestures      | React Spring and Use Gesture | `9.7.4` / `10.3.1`                                   |

## Build and styles

| Area                   | Technology               | Repository convention                         |
| ---------------------- | ------------------------ | --------------------------------------------- |
| Bundler                | Vite                     | `5.2.13`; source root is `src/`               |
| Zalo build integration | `zmp-vite-plugin`        | included alongside the React plugin           |
| CSS utilities          | Tailwind CSS             | `3.4.3`; scans `src/**/*.{js,jsx,ts,tsx,vue}` |
| Preprocessing          | Sass / SCSS              | global styles in `src/css/`                   |
| CSS processing         | PostCSS and Autoprefixer | configured in `postcss.config.js`             |
| Import alias           | `@/`                     | resolves to `src/` in Vite and TypeScript     |

## Key source locations

| Concern                | Location                | Notes                                                                               |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| Bootstrap              | `src/app.ts`            | mounts `RouterProvider`; imports global styles; sets `window.APP_CONFIG` if absent. |
| Bundler configuration  | `vite.config.mts`       | Vite source root, Zalo plugin, React plugin, and alias.                             |
| Compiler configuration | `tsconfig.json`         | strict TypeScript settings and alias mapping.                                       |
| Theme tokens           | `src/css/tailwind.scss` | CSS variables consumed through Tailwind color extensions.                           |
| Global overrides       | `src/css/app.scss`      | selection behavior plus ZaUI and toast adjustments.                                 |

## Constraints for code changes

- Avoid adding another state manager; Jotai is the actual runtime state solution.
- Prefer existing ZaUI controls and established shared components before introducing a new UI library.
- Preserve the current browser-compatible JavaScript target and avoid Node-only APIs in client code.
- Use `@/` for imports inside `src/`; retain relative imports for root-level configuration such as `app-config.json`.
- Load global stylesheet additions through the existing `src/app.ts` bootstrap path unless a style is intentionally component-scoped.

## Configuration drift to know

- `zmp-cli.json` declares `recoil`, but application code uses Jotai. Treat the CLI value as inherited, stale generator metadata unless deliberately migrating state management.
- `package.json` names the package `sport-by-syndeo-zalo-miniapp`, while the template and README use `zaui-fashion` labels. Verify branding requirements before renaming either.
