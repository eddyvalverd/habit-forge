# Habit Forge

Habit Forge is a simple daily habit tracker built with Next.js. It runs entirely in the browser and stores habit data in `localStorage`, so users can create habits, mark them complete for today, track current streaks, and keep their data after a refresh without creating an account.

## Features

- Create a habit with a name
- Reject empty or whitespace-only habit names
- Mark or unmark a habit as completed for today
- Show the current streak for each habit
- Delete habits
- Persist habits in browser `localStorage`
- Support mobile and desktop layouts

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Quality Checks

```bash
npm run lint
npm run build
```

## Known Limitations

- Data is stored only in the current browser via `localStorage`.
- There is no account system, sync, export, or backup.
- Habits are daily-only; there are no categories, reminders, or calendar views.
- Duplicate habit names are allowed because name uniqueness is not part of the MVP scope.

## Next Version Ideas

- Edit an existing habit name
- Add habit notes or categories
- Add weekly history or calendar views
- Add import/export for habit data
- Add optional reminders or notifications
