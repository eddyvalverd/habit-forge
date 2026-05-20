"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";

type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};

const STORAGE_KEY = "habit-forge.habits";
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftDateString(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function getCurrentStreak(completedDates: string[], today: string) {
  const completedSet = new Set(completedDates);

  if (!completedSet.has(today)) {
    return 0;
  }

  let streak = 0;
  let cursor = today;

  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = shiftDateString(cursor, -1);
  }

  return streak;
}

function parseStoredHabits(value: string | null): Habit[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((habit): Habit[] => {
      if (
        !habit ||
        typeof habit !== "object" ||
        !("id" in habit) ||
        !("name" in habit) ||
        !("completedDates" in habit) ||
        typeof habit.id !== "string" ||
        typeof habit.name !== "string" ||
        !Array.isArray(habit.completedDates)
      ) {
        return [];
      }

      const completedDates: string[] = habit.completedDates.filter(
        (date: unknown): date is string => typeof date === "string",
      );

      return [
        {
          id: habit.id,
          name: habit.name,
          completedDates: Array.from(new Set(completedDates)).sort(),
        },
      ];
    });
  } catch {
    return [];
  }
}

export default function Home() {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return parseStoredHabits(window.localStorage.getItem(STORAGE_KEY));
  });
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits, isHydrated]);

  const today = getTodayDateString();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = habitName.trim();

    if (!trimmedName) {
      return;
    }

    setHabits((currentHabits) => [
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        completedDates: [],
      },
      ...currentHabits,
    ]);
    setHabitName("");
  }

  function toggleHabitCompletion(habitId: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completedToday = habit.completedDates.includes(today);

        return {
          ...habit,
          completedDates: completedToday
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today].sort(),
        };
      }),
    );
  }

  function deleteHabit(habitId: string) {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId));
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
            Daily habit tracker
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Habit Forge
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            Track a few daily habits, mark them done for today, and keep your streaks visible
            without creating an account.
          </p>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="habit-name">
              Habit name
            </label>
            <input
              id="habit-name"
              className="min-w-0 flex-1 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              type="text"
              value={habitName}
              onChange={(event) => setHabitName(event.target.value)}
              placeholder="Add a habit like Drink water"
              maxLength={80}
            />
            <button
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-base font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              type="submit"
            >
              Add habit
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          {!isHydrated ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">Loading habits</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Restoring your browser data.
              </p>
            </div>
          ) : habits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">No habits yet</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Create your first habit to start building a daily streak.
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const completedToday = habit.completedDates.includes(today);
              const streak = getCurrentStreak(habit.completedDates, today);

              return (
                <article
                  key={habit.id}
                  className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                        {habit.name}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 font-medium ${
                            completedToday
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {completedToday ? "Completed today" : "Not completed today"}
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                          Current streak: {streak} {streak === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:w-auto sm:min-w-44">
                      <button
                        className={`rounded-2xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-4 ${
                          completedToday
                            ? "bg-stone-900 text-white hover:bg-stone-700 focus:ring-stone-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200"
                        }`}
                        type="button"
                        onClick={() => toggleHabitCompletion(habit.id)}
                      >
                        {completedToday ? "Unmark today" : "Mark complete"}
                      </button>
                      <button
                        className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        Delete habit
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
