import Link from "next/link";

export default function NotFound() {
  return (
    <main className="door">
      <p className="mast__mark">CUBE</p>
      <p className="mast__sub">Supper Club</p>
      <span className="door__rule" />
      <p className="door__text">We don’t recognise this link.<br />If it came from Michał, please reply to his message.</p>
      <Link className="quiet-link" href="/">Back</Link>
    </main>
  );
}
