"use client";
export const timeOptions = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 heure" },
  { value: 120, label: "2 heures" },
  { value: 240, label: "L’après-midi" },
];
export function TimeSelector({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (minutes: number) => void;
}) {
  return (
    <div className="time-options">
      {timeOptions.map((t) => (
        <button
          key={t.value}
          className={selected === t.value ? "selected" : ""}
          aria-pressed={selected === t.value}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
