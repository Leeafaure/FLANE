"use client";
export const moods = [
  "du joli",
  "du calme",
  "un truc parisien",
  "pas touristique",
  "une terrasse",
  "une petite place",
  "cosy",
  "pas cher",
  "chic mais accessible",
  "caché",
  "du vintage",
];
export function MoodFilters({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (moods: string[]) => void;
}) {
  return (
    <div className="mood-chips" aria-label="Tes envies">
      {moods.map((m) => (
        <button
          className={`chip ${selected.includes(m) ? "selected" : ""}`}
          aria-pressed={selected.includes(m)}
          key={m}
          onClick={() =>
            onChange(
              selected.includes(m)
                ? selected.filter((s) => s !== m)
                : [...selected, m],
            )
          }
        >
          {selected.includes(m) && <span>✓ </span>}
          {m}
        </button>
      ))}
    </div>
  );
}
