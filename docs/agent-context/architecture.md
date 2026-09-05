# Architecture and File Ownership

## Application flow

```mermaid
flowchart TD
  A[Zalo client / browser host] --> B[src/app.ts]
  B --> C[React Router]
  C --> D[PaddleApp coordinator]
  D --> E[Paddle screens]
  D --> F[Paddle components]
  D --> G[Paddle Jotai session store]
```

The active application is a frontend-only Paddle Sport demo. `src/app.ts` loads
ZaUI, Tailwind, and app styles before mounting React Router. The single route in
`src/router.tsx` renders `PaddleApp` at `/` with the environment-aware basename
from `src/utils/zma.ts`.

## Routes

| Path | Page         | Behavior                                                                      |
| ---- | ------------ | ----------------------------------------------------------------------------- |
| `/`  | Paddle Sport | Renders the three swipeable primary tabs and all associated workflow screens. |

The primary tabs are rendered in one horizontal track, so switching between
`Trang chủ`, `Buổi chơi`, and `Cá nhân` retains their mounted UI state. The
footer navigation is part of this tab shell.

## Paddle module structure

`src/pages/paddle/` owns the complete Paddle Sport frontend:

| Location       | Responsibility                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `index.tsx`    | App coordinator, tab swiping, navigation, and screen composition.                                               |
| `types.ts`     | Shared screen, role, time, and set-count types.                                                                 |
| `constants.ts` | Picker data, demo participants, and currency formatting helpers.                                                |
| `store.ts`     | Jotai atoms for all sessions and the currently selected session.                                                |
| `components/`  | Small shared UI primitives such as `MoneyInput` and `PaddleHeader`.                                             |
| `screens/`     | Page-level screens grouped by workflow: primary tabs, creation, session, scoring, payment, summary, and review. |

## State and interactions

`store.ts` owns the shared session state:

- `sessionsAtom` contains the demo session list, including creator ownership, current-user participation (`invited` or `checked-in`), open/completed status, session details, check-ins, and current-user payment state.
- `selectedSessionIdAtom` identifies the session opened from Home or Report.
- Creating a session adds it to the atom; check-in, payment confirmation, and ending a session update that same selected record.

On the Home tab, Host filters sessions to records created by the current user;
Người chơi filters to sessions where the current user is invited or already
checked in.

`PaddleApp` keeps only UI-local state:

- Role selection: `host` or `player`.
- Session details: name, date, start time, cost mode, cost value/range, and optional set count.
- Form drafts, score saved state, and session-detail inputs before creating a new session.
- Review state: venue/host star rating and next-set setting.
- Short user feedback is shown through a local toast state.

ZaUI components from `zmp-ui` are used for inputs, date/time selection, radio
buttons, checkboxes, text areas, and primary workflow actions. This demo does
not invoke host payment, sharing, or identity SDK integrations; those need a
confirmed backend and Zalo runtime contract before being implemented.

## Legacy cleanup

The previous generated catalog template, including `src/components/` and
`src/pages/home/`, was removed because it was no longer routed or imported.
New shared Paddle UI belongs under `src/pages/paddle/components/`, rather than
a global component folder.
