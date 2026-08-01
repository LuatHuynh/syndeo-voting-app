# Agent Context Library

Use this directory as the project-specific source of truth for coding agents. It records observed repository behavior as of 2026-08-01 and links to the applicable official Zalo documentation. Confirm external-platform behavior against the linked documentation when a change depends on it.

## Index

| Document                                           | Use it when                                                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Technical stack](technical-stack.md)              | Selecting libraries, modifying build tools, TypeScript, CSS, or dependencies.                                              |
| [Architecture and data flow](architecture.md)      | Adding or changing pages, routes, state, cart behavior, API calls, or shared UI.                                           |
| [Zalo Mini App platform](zalo-mini-app.md)         | Working with `app-config.json`, `zmp-sdk`, native capabilities, permissions, payment, sharing, OA, or Zalo-hosted routing. |
| [Development and release workflow](development.md) | Running locally, testing in Zalo, building, deploying, or resolving configuration drift.                                   |

## Snapshot

- **Repository reality:** a ZaUI Fashion e-commerce template with catalog, cart, payment invocation, profile, search, and Official Account (OA) interactions. It is not yet a voting-specific implementation.
- **Runtime:** a web application hosted inside the Zalo client, built with React and Vite and integrated through `zmp-sdk` and `zmp-ui`.
- **Data mode:** `template.apiUrl` is empty, so catalog content currently loads from bundled JSON mock files.
- **Source of truth hierarchy:** verified requirements and platform documentation override this library; this library documents the current codebase rather than deciding business requirements.
