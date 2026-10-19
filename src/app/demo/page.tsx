import Link from "next/link";

const PARTS = [
  {
    no: "I",
    title: "Wizytówka Cube",
    who: "Dla każdego, kto wpisze „Cube Supper Club” w Google",
    text: "Buduje zaufanie przed pierwszym zaproszeniem. Nie sprzedaje miejsc i nie ma zapisów. Mówi tylko, czym jest Cube, i odsyła do Michała.",
    links: [{ href: "/", label: "Otwórz wizytówkę" }],
  },
  {
    no: "II",
    title: "Zaproszenie nowego gościa",
    who: "Charlotte dostaje osobisty link od Michała",
    text: "Dlaczego właśnie ona, czym jest Cube, jak wygląda wieczór, kto będzie przy stole (branże, bez nazwisk) i potwierdzenie miejsca.",
    links: [{ href: "/i/v6b1n8qx3m/", label: "Charlotte · Table X" }],
  },
  {
    no: "III",
    title: "Strona powracającego gościa",
    who: "Główny temat briefu",
    text: "Od wspomnienia własnej kolacji, przez wszystkie stoły, do kilku zdań o tym, co gość robi teraz. Odpowiedzi czyta tylko Michał.",
    links: [
      { href: "/t/k7q2m9xa4d/", label: "Sarah · jedna kolacja" },
      { href: "/t/r3v8n1pz6e/", label: "James · trzy kolacje" },
      { href: "/t/w5h9c4tb2y/", label: "Anna · kolacja bez zdjęcia" },
    ],
  },
  {
    no: "IV",
    title: "Host’s Book",
    who: "Panel, który widzi tylko Michał",
    text: "Odpowiedzi gości, notatki, introdukcje z podwójną zgodą, podpowiedzi AI i szkice maili. Dzięki niemu obietnica „the conversation continues” jest prawdziwa.",
    links: [{ href: "/host/", label: "Otwórz panel" }],
  },
];

export default function Tour() {
  return (
    <main className="tour" lang="pl">
      <header className="tour__head">
        <p className="mast__mark">CUBE</p>
        <p className="mast__sub">Supper Club · prototyp</p>
        <span className="door__rule" />
        <h1>Cała ścieżka gościa w czterech częściach</h1>
        <p className="tour__lede">
          Najlepiej oglądać na telefonie, bo tak goście otworzą link z maila. Zdjęcia, daty i osoby są przykładowe. Prawdziwe zdjęcia z kolacji wejdą w miejsce ciemnych kadrów ze świecami.
        </p>
      </header>
      <ol className="tour__list">
        {PARTS.map((p) => (
          <li key={p.no}>
            <span className="tour__no">{p.no}</span>
            <div>
              <h2>{p.title}</h2>
              <p className="tour__who">{p.who}</p>
              <p>{p.text}</p>
              <div className="tour__links">
                {p.links.map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
