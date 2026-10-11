# LifeStyle

Frontend for LifeStyle, a personal health dashboard. A signed-in user enters body
measurements, sleep habits and workout preferences; the backend returns computed
metrics, a sleep-efficiency prediction and recommended training programs, and this
app visualises them and combines them into one health score.

The backend is a separate Django REST project. This repository contains only the
frontend.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 (custom utilities are defined in `src/index.css`)
- React Router for the two routes
- Zustand for state, persisted to `localStorage`
- Axios with JWT access/refresh handling
- Zod for form validation
- Vitest and Testing Library for tests

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env    # then set VITE_API_BASE_URL to your backend
npm run dev
```

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, no trailing slash | `http://127.0.0.1:8000` |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the unit tests once |
| `npm run check` | Type-check, lint and test; run this before committing |

## Routes

| Path | Page |
|---|---|
| `/` | Landing page with login and registration |
| `/dashboard` | Body, sleep, workout and overview views; requires a signed-in user |

## Project structure

```
src/
  pages/      HomePage, Dashboard
  home/       landing-page sections and their animation helpers
  features/
    auth/     login, registration, session restore, route guard
    body/     body measurements form and metrics dashboard
    sleep/    sleep form and efficiency dashboard
    workout/  program search form and program dashboard
    overview/ combined health score, derived from the three stores
  shared/
    api/      Axios instance and token refresh
    errors/   AppError, HTTP-to-AppError mapping, error boundary
    layout/   dashboard sidebar
    ui/       Button, Input, Card, Modal, Badge, Spinner, ErrorMessage
    utils/    toasts, insight text
```

Each feature follows the same layering: component → `useX` hook → `xService`
→ Axios, with results written to `xStore`.

## How data is stored

- Analysis results (body, sleep, workout) are kept in the browser's `localStorage`.
  They are not loaded back from the server, so they appear only in the browser
  where they were submitted.
- Results are cleared on every login and logout, so two users sharing a browser
  never see each other's data.
- JWT tokens are also kept in `localStorage`. An expired access token is refreshed
  automatically; if the refresh token is rejected, the user is signed out.

## API endpoints used

| Feature | Endpoints |
|---|---|
| Auth | `POST /api/accounts/register/`, `login/`, `logout/`, `token/refresh/`, `GET /api/accounts/me/` |
| Body | `POST /api/body_profiles/create/`, `POST /api/body-metrics/calculate/`, `POST /api/rule-base/generate/` |
| Sleep | `POST /api/sleep/create/`, `GET /api/sleep/latest/details/` |
| Workout | `POST /api/sport/recommend/` |

A sleep analysis requires a body analysis first; the backend rejects it otherwise.

## Deployment

The app is a single-page application, so the host must serve `index.html` for
unknown paths. `public/_redirects` does this on Netlify; other hosts need their
own equivalent setting.
