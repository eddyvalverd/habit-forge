# Habit Forge

Habit Forge is a simple daily habit tracker built with Next.js. It runs entirely in the browser and stores habits in `localStorage`, so users can create habits, mark them complete for today, view current streaks, and keep their data after a refresh without signing in.

## Features

- Create a habit with a name
- Reject empty habit names
- Mark or unmark a habit as completed today
- Show the current streak for each habit
- Delete habits
- Persist habits in browser `localStorage`
- Work on mobile and desktop widths

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

## Quality Checks

Run the required checks with:

```bash
npm run lint
npm run build
```

## Scope

This MVP is frontend-only. It does not include authentication, a backend, a database, notifications, calendar views, or AI features.
