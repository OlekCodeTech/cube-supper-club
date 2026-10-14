"use client";

import { useEffect, useRef, useState } from "react";
import { type Dinner, type Guest, NUMBER_WORDS, formatDate, roman } from "@/data/dinners";
import { TablePhoto } from "./TablePhoto";
import { submitConversation, type Answers } from "@/lib/submit";

const QUESTIONS: { key: keyof Answers; q: string; hint: string }[] = [
  { key: "workingOn", q: "What are you working on at the moment?", hint: "A project, a venture, a new chapter…" },
  { key: "curiousAbout", q: "What has caught your curiosity lately?", hint: "Something you’re exploring, reading or thinking about" },
  { key: "lookingFor", q: "Is there something you’re looking for?", hint: "Advice, a partner, a recommendation, a fresh perspective" },
  { key: "wouldMeet", q: "Who would you enjoy meeting?", hint: "A kind of person, a world, a particular perspective" },
  { key: "canOffer", q: "And what could you bring to someone else?", hint: "Experience, an introduction, an open door" },
];

const EMPTY: Answers = { workingOn: "", curiousAbout: "", lookingFor: "", wouldMeet: "", canOffer: "", sharing: "private" };

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function AutoGrow(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [props.value]);
  return <textarea ref={ref} rows={1} {...props} />;
}

export function Experience({ guest, mine, all }: { guest: Guest; mine: Dinner[]; all: Dinner[] }) {
  const storageKey = `cube:conversation:${guest.token}`;
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const endingRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const [revisit, setRevisit] = useState(false);
  useReveal(state);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAnswers({ ...EMPTY, ...JSON.parse(saved) });
        setState("sent");
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (revisit && state === "idle") formRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [revisit, state]);

  const latest = mine[mine.length - 1];
  const many = mine.length > 1;
  const mineIds = new Set(mine.map((d) => d.id));
  const hasAnswer = QUESTIONS.some(({ key }) => answers[key].trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasAnswer) return;
    setState("sending");
    try {
      await submitConversation({ token: guest.token, firstName: guest.firstName, dinners: guest.dinners, answers });
      try {
        localStorage.setItem(storageKey, JSON.stringify(answers));
      } catch {}
      setState("sent");
      requestAnimationFrame(() => endingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      setState("error");
    }
  }

  return (
    <main className="exp">
      <header className="mast">
        <span className="mast__mark">CUBE</span>
        <span className="mast__sub">Supper Club</span>
      </header>

      {/* I — YOUR TABLE */}
      <section className="ch ch--dark ch--hero" aria-labelledby="ch1">
        <div className="hero__text">
          <p className="eyebrow rise rise--1">
            {many ? `${NUMBER_WORDS[mine.length] ?? mine.length} tables` : `Table ${roman(latest.number)}`}
            <span className="dot" />
            {many ? `since ${new Date(mine[0].date).getFullYear()}` : formatDate(latest.date)}
          </p>
          <h1 id="ch1" className="display rise rise--2">
            {many ? "Your Tables" : "Your Table"}
          </h1>
          <p className="lede rise rise--3">
            {many ? (
              <>
                {guest.firstName}, you have sat with us {NUMBER_WORDS[mine.length] ?? mine.length} times.
                <br />
                Each evening, a different table.
              </>
            ) : (
              <>
                {guest.firstName}, you were part of this evening
                <br />
                at {latest.venue}, {latest.city}.
              </>
            )}
          </p>
        </div>

        <figure className="hero__photo rise rise--4">
          <TablePhoto dinner={latest} priority />
          <figcaption>
            <span>No. {roman(latest.number)}</span>
            <span>{formatDate(latest.date)}</span>
            <span>{latest.venue}</span>
          </figcaption>
        </figure>

        {many && (
          <ol className="yours" data-reveal>
            {mine.map((d) => (
              <li key={d.id}>
                <span className="yours__no">{roman(d.number)}</span>
                <span className="yours__date">{formatDate(d.date)}</span>
                <span className="yours__line">{d.line}</span>
              </li>
            ))}
          </ol>
        )}

        {(guest.note || !many) && (
          <blockquote className="note" data-reveal>
            <p>{guest.note ?? latest.line}</p>
            {guest.note && <cite>Michał</cite>}
          </blockquote>
        )}

        <a className="scroll-cue" href="#ch2" aria-label="Continue">
          <span />
        </a>
      </section>

      {/* II — ONE TABLE BECAME MANY */}
      <section className="ch ch--paper" id="ch2" aria-labelledby="ch2h">
        <div className="intro">
          <p className="chapter" data-reveal>II</p>
          <h2 id="ch2h" className="title" data-reveal>
            One table
            <br />
            <em>became many.</em>
          </h2>
          <p className="body" data-reveal>
            {many ? "Your evenings" : "Your evening"} sit among {NUMBER_WORDS[all.length] ?? all.length}. Different people, different conversations — and slowly, one story of the people who have gathered around the Cube table.
          </p>
        </div>

        <div className="archive">
          {all.map((d, i) => {
            const isMine = mineIds.has(d.id);
            return (
              <figure key={d.id} className={`plate plate--${(i % 5) + 1}${isMine ? " plate--mine" : ""}`} data-reveal>
                <TablePhoto dinner={d} />
                <figcaption>
                  <span className="plate__no">No. {roman(d.number)}</span>
                  <span className="plate__date">{formatDate(d.date)}</span>
                  {isMine && <span className="plate__you">Your table</span>}
                  <span className="plate__line">{d.line}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* III — THE DINNER ENDS */}
      <section className="ch ch--dark ch--interlude" aria-labelledby="ch3h">
        <p className="chapter" data-reveal>III</p>
        <h2 id="ch3h" className="interlude">
          <span data-reveal>The dinner ends.</span>
          <em data-reveal>The conversation doesn’t have to.</em>
        </h2>
        <div className="interlude__body" data-reveal>
          <p>Not every conversation at the table needs to become business. Sometimes it is a new perspective. A recommendation. An idea you keep returning to. Someone you would simply like to see again.</p>
          <p>What began over dinner can carry on — quietly, at its own pace.</p>
        </div>
      </section>

      {/* IV — KEEP THE CONVERSATION GOING */}
      {state !== "sent" && (
        <section ref={formRef} className={`ch ch--paper ch--form${revisit ? " is-revisit" : ""}`} aria-labelledby="ch4h">
          <div className="intro">
            <p className="chapter" data-reveal>IV</p>
            <h2 id="ch4h" className="title" data-reveal>
              Keep the
              <br />
              <em>conversation going.</em>
            </h2>
            <div className="letter" data-reveal>
              <p>
                {guest.firstName}, I would love to know where you are now — what you are working on, what you are curious about, who you would like to cross paths with.
              </p>
              <p>
                There is no list of matches on the other side of this page. I will simply keep it in mind, and when the right moment and the right person come along, I will make the introduction myself.
              </p>
              <p className="sign">Michał</p>
            </div>
          </div>

          <form className="talk" onSubmit={onSubmit} noValidate>
            <p className="talk__aside" data-reveal>Answer as much or as little as you like. A sentence is plenty.</p>
            {QUESTIONS.map(({ key, q, hint }, i) => (
              <label key={key} className="talk__q" data-reveal>
                <span className="talk__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="talk__label">{q}</span>
                <AutoGrow
                  name={key}
                  value={answers[key]}
                  placeholder={hint}
                  maxLength={1200}
                  onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
                />
              </label>
            ))}

            <fieldset className="talk__share" data-reveal>
              <legend>How may Michał use what you’ve shared?</legend>
              <label>
                <input
                  type="radio"
                  name="sharing"
                  checked={answers.sharing === "private"}
                  onChange={() => setAnswers((a) => ({ ...a, sharing: "private" }))}
                />
                <span>Keep it between us — just for Michał’s own understanding.</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sharing"
                  checked={answers.sharing === "introductions"}
                  onChange={() => setAnswers((a) => ({ ...a, sharing: "introductions" }))}
                />
                <span>Michał may mention it to someone when suggesting an introduction.</span>
              </label>
            </fieldset>

            <div className="talk__send" data-reveal>
              <button type="submit" disabled={!hasAnswer || state === "sending"}>
                {state === "sending" ? "Sending…" : "Send to Michał"}
              </button>
              {state === "error" && <p className="talk__err">Something went wrong. Please try again in a moment.</p>}
              <p className="talk__fine">Read only by Michał. Never shown to other guests. You can change it whenever you like.</p>
            </div>
          </form>
        </section>
      )}

      {/* V — A QUIET ENDING */}
      {state === "sent" && (
        <section ref={endingRef} className="ch ch--dark ch--ending" aria-labelledby="ch5h">
          <p className="chapter is-in">V</p>
          <h2 id="ch5h" className="display display--ending">
            The conversation
            <br />
            <em>continues.</em>
          </h2>
          <p className="lede">
            Thank you, {guest.firstName}. I’ll read this myself
            <br />
            and keep it close for the right moment.
          </p>
          <p className="sign sign--light">Michał</p>
          <button type="button" className="quiet-link" onClick={() => {
              setRevisit(true);
              setState("idle");
            }}>
            Change what you shared
          </button>
        </section>
      )}

      <footer className="foot">
        <span>CUBE Supper Club</span>
        <span>This page was made for you. Please keep the link to yourself.</span>
      </footer>
    </main>
  );
}
