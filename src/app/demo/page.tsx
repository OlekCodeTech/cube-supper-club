import Link from "next/link";
import { guestDinners, guests, roman } from "@/data/dinners";

const WHO: Record<string, string> = {
  Sarah: "One dinner, with a personal note from Michał",
  James: "Three dinners — “Your Tables”",
  Anna: "The dinner without a group photo",
};

export default function Demo() {
  return (
    <main className="door door--list">
      <p className="mast__mark">CUBE</p>
      <p className="mast__sub">Prototype · returning guests</p>
      <span className="door__rule" />
      <ul className="demo">
        {guests.map((g) => (
          <li key={g.token}>
            <Link href={`/t/${g.token}/`}>
              <span className="demo__name">{g.firstName}</span>
              <span className="demo__meta">
                {guestDinners(g).map((d) => `No. ${roman(d.number)}`).join(" · ")} — {WHO[g.firstName]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
