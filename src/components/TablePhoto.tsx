import { type Dinner, formatDate, roman } from "@/data/dinners";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * One frame for one dinner. Three states:
 * - real group photo
 * - "pending": prototype placeholder until the photo is supplied
 * - null: no group photo exists → typographic card (a designed state, not an error)
 */
export function TablePhoto({
  dinner,
  priority = false,
  className = "",
}: {
  dinner: Dinner;
  priority?: boolean;
  className?: string;
}) {
  if (dinner.photo === null) {
    return (
      <div className={`frame frame--type ${className}`} role="img" aria-label={`Table ${dinner.number}, ${formatDate(dinner.date)}. No group photograph.`}>
        <span className="frame__numeral">{roman(dinner.number)}</span>
        <span className="frame__date">{formatDate(dinner.date)}</span>
        <span className="frame__rule" />
        <span className="frame__quote">No photograph.<br />Only the conversations.</span>
      </div>
    );
  }

  if (dinner.photo === "pending") {
    return (
      <div className={`frame frame--pending ${className}`} role="img" aria-label={`Group photo, Table ${dinner.number}`}>
        <span className="frame__glow" aria-hidden />
        <span className="frame__pending-label">Group photo · Table {roman(dinner.number)}</span>
      </div>
    );
  }

  return (
    <div className={`frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={base + dinner.photo}
        alt={`The table at Cube Supper Club, ${formatDate(dinner.date)}, ${dinner.venue}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
