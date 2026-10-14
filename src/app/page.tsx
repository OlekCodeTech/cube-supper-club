import Link from "next/link";

export default function Home() {
  return (
    <main className="door">
      <p className="mast__mark">CUBE</p>
      <p className="mast__sub">Supper Club</p>
      <span className="door__rule" />
      <p className="door__text">
        This page opens with a personal link.
        <br />
        If you were at one of our tables, Michał will send you yours.
      </p>
      <Link className="quiet-link" href="/demo/">Prototype — guest examples</Link>
    </main>
  );
}
