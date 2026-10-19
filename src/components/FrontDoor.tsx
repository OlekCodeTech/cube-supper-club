"use client";

import { dinners, formatDate, roman } from "@/data/dinners";
import { TablePhoto } from "./TablePhoto";
import { useReveal } from "@/lib/reveal";

// Placeholder until Michał confirms the address.
export const CONTACT_EMAIL = "michal@example.com";

const MANIFESTO = [
  "The dinner is the experience.",
  "The table is what makes it valuable.",
  "The relationships are what make it worth returning for.",
  "The network is the long-term outcome.",
];

const STEPS = [
  {
    title: "An invitation",
    text: "Michał invites every guest himself. A seat at Cube can’t be bought or booked, and no two tables are the same.",
  },
  {
    title: "The table",
    text: "Ten people from different worlds: hospitality, fashion, art, investment, craft. Chosen so that the conversations surprise everyone, including the host.",
  },
  {
    title: "Afterwards",
    text: "The dinner ends, the conversation doesn’t have to. Michał stays in touch, listens to what each guest is working on, and makes introductions when the moment is right.",
  },
];

export function FrontDoor() {
  useReveal(null);
  const latest = dinners[dinners.length - 1];

  return (
    <main className="exp">
      <header className="mast">
        <span className="mast__mark">CUBE</span>
        <span className="mast__sub">Supper Club</span>
      </header>

      <section className="ch ch--dark ch--hero" aria-labelledby="fd-title">
        <p className="eyebrow rise rise--1">
          London <span className="dot" /> since 2024
        </p>
        <h1 id="fd-title" className="display rise rise--2">
          Ten people.
          <br />
          <em>One table.</em>
        </h1>
        <p className="lede rise rise--3">
          A private supper club in London. Every guest is invited personally,
          and the conversations don’t end with dessert.
        </p>
        <figure className="hero__photo rise rise--4">
          <TablePhoto dinner={latest} priority />
        </figure>
      </section>

      <section className="ch ch--paper" aria-label="What Cube believes">
        <p className="chapter" data-reveal>The idea</p>
        <ol className="fd-manifesto">
          {MANIFESTO.map((line, i) => (
            <li key={line} data-reveal style={{ transitionDelay: `${i * 0.12}s` }}>
              {line}
            </li>
          ))}
        </ol>
      </section>

      <section className="ch ch--dark" aria-labelledby="fd-how">
        <p className="chapter" data-reveal>How it works</p>
        <h2 id="fd-how" className="title" data-reveal>
          Not an event.
          <br />
          <em>A table.</em>
        </h2>
        <ol className="fd-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} data-reveal>
              <span className="fd-steps__no">{roman(i + 1)}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ch ch--paper ch--strip" aria-labelledby="fd-tables">
        <div className="intro">
          <p className="chapter" data-reveal>So far</p>
          <h2 id="fd-tables" className="title" data-reveal>
            Nine tables,
            <br />
            <em>one story.</em>
          </h2>
        </div>
        <div className="fd-strip" tabIndex={0} aria-label="Past tables, scroll sideways">
          {dinners.map((d) => (
            <figure key={d.id} className="fd-strip__item">
              <TablePhoto dinner={d} />
              <figcaption>
                <span className="plate__no">No. {roman(d.number)}</span>
                <span>{formatDate(d.date)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="ch ch--dark fd-invite" aria-labelledby="fd-invite">
        <p className="chapter" data-reveal>By invitation</p>
        <h2 id="fd-invite" className="title" data-reveal>
          A seat can’t be booked.
          <br />
          <em>It can be suggested.</em>
        </h2>
        <p className="body body--dark" data-reveal>
          If you know someone who belongs at the table, tell Michał about them.
        </p>
        <p className="fd-contact" data-reveal>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p className="fd-guest" data-reveal>
          Were you at one of our tables? Your personal page arrives with Michał’s email.
        </p>
      </section>

      <footer className="foot">
        <span>CUBE Supper Club · London</span>
        <span>Good people. Better conversations.</span>
      </footer>
    </main>
  );
}
