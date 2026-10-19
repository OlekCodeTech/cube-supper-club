"use client";

import { useEffect, useRef, useState } from "react";
import { NUMBER_WORDS, formatDate, roman } from "@/data/dinners";
import type { Invitation, UpcomingTable } from "@/data/invitations";
import { AutoGrow, useReveal } from "@/lib/reveal";

type Reply = "yes" | "maybe" | "no";

const weekday = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });

function icsHref(t: UpcomingTable) {
  const d = t.date.replaceAll("-", "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cube Supper Club//EN",
    "BEGIN:VEVENT",
    `UID:cube-${t.id}@cube`,
    `DTSTART;TZID=Europe/London:${d}T190000`,
    `DTEND;TZID=Europe/London:${d}T230000`,
    `SUMMARY:Cube Supper Club · Table ${roman(t.number)}`,
    `LOCATION:${t.venue}, ${t.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

export function InvitationPage({ invite, table }: { invite: Invitation; table: UpcomingTable }) {
  const key = `cube:invite:${invite.token}`;
  const [reply, setReply] = useState<Reply | null>(null);
  const [dietary, setDietary] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<Reply | null>(null);
  const [sending, setSending] = useState(false);
  const doneRef = useRef<HTMLElement>(null);
  useReveal(sent);

  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setSent(JSON.parse(s).reply);
    } catch {}
  }, [key]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reply) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800)); // prototype: simulated
    try {
      localStorage.setItem(key, JSON.stringify({ reply, dietary, note }));
    } catch {}
    setSending(false);
    setSent(reply);
    requestAnimationFrame(() => doneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const open = table.seats - table.confirmed;

  return (
    <main className="exp">
      <header className="mast">
        <span className="mast__mark">CUBE</span>
        <span className="mast__sub">Supper Club</span>
      </header>

      {/* I — THE INVITATION */}
      <section className="ch ch--dark ch--hero inv-hero" aria-labelledby="inv1">
        <p className="eyebrow rise rise--1">
          Table {roman(table.number)} <span className="dot" /> {weekday(table.date)}, {formatDate(table.date)}
        </p>
        <h1 id="inv1" className="display rise rise--2">
          {invite.firstName},
          <br />
          <em>you’re invited.</em>
        </h1>
        <p className="lede rise rise--3">
          {table.time} · {table.venue}, {table.city}
        </p>
        <blockquote className="note rise rise--4">
          <p>{invite.why}</p>
          <cite>Michał</cite>
        </blockquote>
        <a className="scroll-cue" href="#inv2" aria-label="Continue">
          <span />
        </a>
      </section>

      {/* II — WHAT CUBE IS */}
      <section className="ch ch--paper" id="inv2" aria-labelledby="inv2h">
        <div className="intro">
          <p className="chapter" data-reveal>II</p>
          <h2 id="inv2h" className="title" data-reveal>
            Not an event.
            <br />
            <em>A table.</em>
          </h2>
          <p className="body" data-reveal>
            Cube is a private supper club. There are no tickets, no name badges and no pitches. Just ten people Michał has chosen, one long dinner, and conversations that often carry on long after it.
          </p>
        </div>
        <dl className="inv-evening" data-reveal>
          <div>
            <dt>19:00</dt>
            <dd>Arrival and a drink. Michał introduces everyone.</dd>
          </div>
          <div>
            <dt>19:45</dt>
            <dd>Dinner at one table. Three courses, one conversation.</dd>
          </div>
          <div>
            <dt>Late</dt>
            <dd>The table stays as long as it wants to.</dd>
          </div>
        </dl>
      </section>

      {/* III — THE TABLE */}
      <section className="ch ch--dark" aria-labelledby="inv3h">
        <p className="chapter" data-reveal>III</p>
        <h2 id="inv3h" className="title" data-reveal>
          The table is
          <br />
          <em>coming together.</em>
        </h2>
        <div className="inv-seats" data-reveal aria-label={`${table.confirmed} of ${table.seats} seats confirmed`}>
          {Array.from({ length: table.seats }, (_, i) => (
            <span key={i} className={i < table.confirmed ? "is-taken" : ""} />
          ))}
        </div>
        <p className="inv-seats__cap" data-reveal>
          {NUMBER_WORDS[table.confirmed]} seats confirmed · {NUMBER_WORDS[open]} still open
        </p>
        <ul className="inv-fields" data-reveal>
          {table.fields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="body body--dark" data-reveal>
          You won’t find a guest list here. Michał chooses the mix so that no two people come from the same world, and every conversation teaches you something. A few days before the dinner he’ll tell you a little about who you’ll be sitting with.
        </p>
      </section>

      {/* IV — CONFIRM */}
      {!sent && (
        <section className="ch ch--paper ch--form" aria-labelledby="inv4h">
          <div className="intro">
            <p className="chapter" data-reveal>IV</p>
            <h2 id="inv4h" className="title" data-reveal>
              Will you
              <br />
              <em>join us?</em>
            </h2>
            <p className="body" data-reveal>Please reply by {formatDate(table.replyBy)}.</p>
          </div>
          <form className="talk" onSubmit={onSubmit} noValidate>
            <fieldset className="talk__share inv-reply" data-reveal>
              <legend className="sr-only">Your reply</legend>
              {(
                [
                  ["yes", "Yes, I’ll be there."],
                  ["maybe", "I’d love to, but I need to check."],
                  ["no", "I can’t make this date."],
                ] as [Reply, string][]
              ).map(([v, label]) => (
                <label key={v}>
                  <input type="radio" name="reply" id={`reply-${v}`} checked={reply === v} onChange={() => setReply(v)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            {reply === "yes" && (
              <>
                <label className="talk__q is-in" data-reveal>
                  <span className="talk__n">01</span>
                  <span className="talk__label">Anything we should know for the kitchen?</span>
                  <AutoGrow id="dietary" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="Allergies, dietary requirements" maxLength={400} />
                </label>
                <label className="talk__q is-in" data-reveal>
                  <span className="talk__n">02</span>
                  <span className="talk__label">Anything you’d like Michał to know before the evening?</span>
                  <AutoGrow id="inv-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" maxLength={800} />
                </label>
              </>
            )}
            <div className="talk__send" data-reveal>
              <button type="submit" disabled={!reply || sending}>
                {sending ? "Sending…" : reply === "yes" ? "Confirm my seat" : "Send my reply"}
              </button>
              <p className="talk__fine">Your reply goes to Michał only.</p>
            </div>
          </form>
        </section>
      )}

      {/* V — CONFIRMATION */}
      {sent && (
        <section ref={doneRef} className="ch ch--dark ch--ending" aria-labelledby="inv5h">
          <p className="chapter">V</p>
          {sent === "yes" && (
            <>
              <h2 id="inv5h" className="display display--ending">
                See you
                <br />
                <em>at the table.</em>
              </h2>
              <p className="lede">
                {weekday(table.date)}, {formatDate(table.date)} · {table.venue}
                <br />A few days before, I’ll tell you who you’ll be sitting with.
              </p>
              <a className="quiet-link" href={icsHref(table)} download={`cube-table-${table.number}.ics`}>
                Add to calendar
              </a>
            </>
          )}
          {sent === "maybe" && (
            <>
              <h2 id="inv5h" className="display display--ending">
                No rush.
                <br />
                <em>Your seat is held.</em>
              </h2>
              <p className="lede">I’ll keep it for you until {formatDate(table.replyBy)}. Just come back to this page when you know.</p>
            </>
          )}
          {sent === "no" && (
            <>
              <h2 id="inv5h" className="display display--ending">
                Thank you
                <br />
                <em>for letting me know.</em>
              </h2>
              <p className="lede">I hope we’ll find another table for you soon.</p>
            </>
          )}
          <p className="sign sign--light">Michał</p>
          {sent !== "yes" && (
            <button type="button" className="quiet-link" onClick={() => setSent(null)}>
              Change my reply
            </button>
          )}
        </section>
      )}

      <footer className="foot">
        <span>CUBE Supper Club</span>
        <span>This invitation was made for you. Please keep the link to yourself.</span>
      </footer>
    </main>
  );
}
