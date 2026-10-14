"use client";

import { useEffect, useMemo, useState } from "react";
import { dinners, formatDate, roman } from "@/data/dinners";
import {
  TODAY,
  hostGuests as SAMPLE_GUESTS,
  intros as SAMPLE_INTROS,
  suggestions as SAMPLE_SUGGESTIONS,
  type Answers,
  type Consent,
  type HostGuest,
  type Intro,
  type IntroStage,
  type Suggestion,
} from "@/data/host-sample";

type View = "today" | "guests" | "intros" | "tables";
type Store = { guests: HostGuest[]; intros: Intro[]; suggestions: Suggestion[] };

const STORAGE = "cube:host:v1";
const SAMPLE: Store = { guests: SAMPLE_GUESTS, intros: SAMPLE_INTROS, suggestions: SAMPLE_SUGGESTIONS };

const QUESTION_LABEL: Record<keyof Answers, string> = {
  workingOn: "Working on",
  curiousAbout: "Curious about",
  lookingFor: "Looking for",
  wouldMeet: "Would like to meet",
  canOffer: "Can offer",
};

const STAGES: { key: IntroStage; label: string }[] = [
  { key: "idea", label: "Idea" },
  { key: "asking", label: "Asking both" },
  { key: "introduced", label: "Introduced" },
  { key: "met", label: "Met" },
  { key: "declined", label: "Not now" },
];

const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const short = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const guestLink = (token: string) =>
  (typeof window !== "undefined" ? window.location.origin : "") + `${base}/t/${token}/`;

function latest(g: HostGuest) {
  return g.answers[g.answers.length - 1];
}

function status(g: HostGuest): { key: string; label: string } {
  const l = latest(g);
  if (!g.linkSentAt) return { key: "not-sent", label: "Link not sent" };
  if (!l) return { key: "waiting", label: "No answer yet" };
  if (!l.read) return { key: "new", label: "New answer" };
  if (daysBetween(l.date, TODAY) > 180) return { key: "stale", label: "Due for a catch-up" };
  return { key: "answered", label: "Answered" };
}

function copy(text: string) {
  try {
    navigator.clipboard?.writeText(text).catch(() => {});
  } catch {}
}

export function HostApp() {
  const [store, setStore] = useState<Store>(SAMPLE);
  const [view, setView] = useState<View>("today");
  const [openGuest, setOpenGuest] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ guest: HostGuest; kind: "invite" | "catchup" } | null>(null);
  const [newIntro, setNewIntro] = useState<{ a: string; b: string; why: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE);
      if (s) setStore(JSON.parse(s));
    } catch {}
  }, []);

  function save(next: Store) {
    setStore(next);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
    } catch {}
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  const byId = useMemo(() => Object.fromEntries(store.guests.map((g) => [g.id, g])), [store.guests]);
  const name = (id: string) => (byId[id] ? `${byId[id].firstName} ${byId[id].lastName}` : "—");

  function updateGuest(id: string, fn: (g: HostGuest) => HostGuest) {
    save({ ...store, guests: store.guests.map((g) => (g.id === id ? fn(g) : g)) });
  }

  function updateIntro(id: string, fn: (i: Intro) => Intro) {
    save({ ...store, intros: store.intros.map((i) => (i.id === id ? fn(i) : i)) });
  }

  function setConsent(id: string, side: "consentA" | "consentB", value: Consent) {
    updateIntro(id, (i) => {
      const next = { ...i, [side]: value };
      if (next.consentA === "no" || next.consentB === "no") next.stage = "declined";
      else if (next.stage === "idea") next.stage = "asking";
      return next;
    });
  }

  function createIntro(a: string, b: string, why: string) {
    const intro: Intro = {
      id: "i" + Date.now(),
      a,
      b,
      why,
      created: TODAY,
      stage: "idea",
      consentA: "pending",
      consentB: "pending",
    };
    save({
      ...store,
      intros: [intro, ...store.intros],
      suggestions: store.suggestions.filter((s) => !(s.a === a && s.b === b)),
    });
    setNewIntro(null);
    setView("intros");
    flash("Introduction added as an idea");
  }

  const counts = {
    newAnswers: store.guests.filter((g) => status(g).key === "new").length,
    waiting: store.guests.filter((g) => status(g).key === "waiting").length,
    asking: store.intros.filter((i) => i.stage === "asking" || i.stage === "idea").length,
  };

  const guest = openGuest ? byId[openGuest] : null;

  return (
    <div className="h">
      <aside className="h-side">
        <div className="h-brand">
          <span className="h-brand__mark">CUBE</span>
          <span className="h-brand__sub">Host’s Book</span>
        </div>
        <nav className="h-nav" aria-label="Sections">
          {(
            [
              ["today", "Today", counts.newAnswers + counts.asking || null],
              ["guests", "Guests", store.guests.length],
              ["intros", "Introductions", store.intros.length],
              ["tables", "Tables", dinners.length],
            ] as [View, string, number | null][]
          ).map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              className={view === key ? "is-active" : ""}
              aria-current={view === key ? "page" : undefined}
              onClick={() => {
                setView(key);
                setOpenGuest(null);
              }}
            >
              <span>{label}</span>
              {n ? <span className="h-nav__n">{n}</span> : null}
            </button>
          ))}
        </nav>
        <div className="h-side__foot">
          <p>Only Michał can see this.</p>
          <button
            type="button"
            className="h-link"
            onClick={() => {
              save(SAMPLE);
              setOpenGuest(null);
              flash("Sample data restored");
            }}
          >
            Reset sample data
          </button>
        </div>
      </aside>

      <main className="h-main">
        <p className="h-proto">Prototype · fictional sample data · in production behind Michał’s login</p>

        {view === "today" && (
          <section>
            <header className="h-head">
              <h1>Good afternoon, Michał.</h1>
              <p>{formatDate(TODAY)}</p>
            </header>

            <div className="h-stats">
              <button type="button" onClick={() => setView("guests")}>
                <strong>{counts.newAnswers}</strong>
                <span>new answers to read</span>
              </button>
              <button type="button" onClick={() => setView("intros")}>
                <strong>{counts.asking}</strong>
                <span>introductions in progress</span>
              </button>
              <button type="button" onClick={() => setView("guests")}>
                <strong>{counts.waiting}</strong>
                <span>guests haven’t answered yet</span>
              </button>
            </div>

            <h2 className="h-h2">New answers</h2>
            <ul className="h-list">
              {store.guests
                .filter((g) => status(g).key === "new")
                .map((g) => (
                  <li key={g.id}>
                    <button type="button" className="h-row" onClick={() => { setView("guests"); setOpenGuest(g.id); }}>
                      <span className="h-row__main">
                        <strong>{g.firstName} {g.lastName}</strong>
                        <span className="h-muted">{g.field}</span>
                      </span>
                      <span className="h-row__quote">“{latest(g)!.answers.workingOn}”</span>
                      <span className="h-muted">{short(latest(g)!.date)}</span>
                    </button>
                  </li>
                ))}
              {counts.newAnswers === 0 && <li className="h-empty">All answers read.</li>}
            </ul>

            <h2 className="h-h2">
              Possible introductions <span className="h-badge">AI suggestions · only you see these</span>
            </h2>
            <ul className="h-sugg">
              {store.suggestions.map((s) => (
                <li key={s.a + s.b}>
                  <p className="h-sugg__pair">
                    {name(s.a)} <span>×</span> {name(s.b)}
                  </p>
                  <p className="h-sugg__why">{s.reason}</p>
                  <div className="h-actions">
                    <button type="button" className="h-btn" onClick={() => setNewIntro({ a: s.a, b: s.b, why: s.reason })}>
                      Plan this introduction
                    </button>
                    <button
                      type="button"
                      className="h-link"
                      onClick={() => save({ ...store, suggestions: store.suggestions.filter((x) => x !== s) })}
                    >
                      Not a fit
                    </button>
                  </div>
                </li>
              ))}
              {store.suggestions.length === 0 && <li className="h-empty">No new suggestions. They appear as guests share what they’re looking for.</li>}
            </ul>

            <h2 className="h-h2">Gentle reminders</h2>
            <ul className="h-list">
              {store.guests
                .filter((g) => ["waiting", "stale", "not-sent"].includes(status(g).key))
                .slice(0, 6)
                .map((g) => {
                  const st = status(g);
                  return (
                    <li key={g.id}>
                      <div className="h-row h-row--static">
                        <span className="h-row__main">
                          <strong>{g.firstName} {g.lastName}</strong>
                          <span className="h-muted">{st.label}{g.linkSentAt && st.key === "waiting" ? ` · link sent ${daysBetween(g.linkSentAt, TODAY)} days ago` : ""}</span>
                        </span>
                        <button
                          type="button"
                          className="h-btn h-btn--quiet"
                          onClick={() => setDraft({ guest: g, kind: st.key === "stale" ? "catchup" : "invite" })}
                        >
                          {st.key === "stale" ? "Draft “Has anything changed?”" : st.key === "not-sent" ? "Draft invitation" : "Draft a gentle nudge"}
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
        )}

        {view === "guests" && !guest && (
          <section>
            <header className="h-head">
              <h1>Guests</h1>
              <input
                className="h-search"
                type="search"
                id="guest-search"
                placeholder="Search by name, field or tag"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search guests"
              />
            </header>
            <div className="h-table-wrap">
              <table className="h-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Tables</th>
                    <th>Status</th>
                    <th>Sharing</th>
                  </tr>
                </thead>
                <tbody>
                  {store.guests
                    .filter((g) =>
                      (g.firstName + " " + g.lastName + " " + g.field + " " + g.company + " " + g.tags.join(" "))
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                    )
                    .map((g) => {
                      const st = status(g);
                      const l = latest(g);
                      return (
                        <tr key={g.id} onClick={() => setOpenGuest(g.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpenGuest(g.id)}>
                          <td>
                            <strong>{g.firstName} {g.lastName}</strong>
                            <span className="h-muted h-block">{g.field} · {g.company}</span>
                          </td>
                          <td className="h-num">{g.dinners.map((d) => roman(dinners.find((x) => x.id === d)!.number)).join(" · ")}</td>
                          <td><span className={`h-pill h-pill--${st.key}`}>{st.label}</span></td>
                          <td className="h-muted">{l ? (l.sharing === "introductions" ? "May mention" : "Private") : "—"}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "guests" && guest && (
          <GuestCard
            guest={guest}
            intros={store.intros.filter((i) => i.a === guest.id || i.b === guest.id)}
            name={name}
            onBack={() => setOpenGuest(null)}
            onRead={() =>
              updateGuest(guest.id, (g) => ({ ...g, answers: g.answers.map((a) => ({ ...a, read: true })) }))
            }
            onNote={(text) => updateGuest(guest.id, (g) => ({ ...g, notes: [...g.notes, { date: TODAY, text }] }))}
            onCopy={() => {
              copy(guestLink(guest.token));
              flash("Personal link copied");
            }}
            onDraft={(kind) => setDraft({ guest, kind })}
            onIntro={() => setNewIntro({ a: guest.id, b: "", why: "" })}
          />
        )}

        {view === "intros" && (
          <section>
            <header className="h-head">
              <h1>Introductions</h1>
              <button type="button" className="h-btn" onClick={() => setNewIntro({ a: "", b: "", why: "" })}>
                New introduction
              </button>
            </header>
            <p className="h-lede">Both people say yes before anyone is connected. You ask each of them yourself, separately.</p>
            {STAGES.map((stage) => {
              const items = store.intros.filter((i) => i.stage === stage.key);
              if (!items.length) return null;
              return (
                <div key={stage.key} className="h-stage">
                  <h2 className="h-h2">{stage.label} <span className="h-count">{items.length}</span></h2>
                  <ul className="h-intros">
                    {items.map((i) => (
                      <IntroCard
                        key={i.id}
                        intro={i}
                        a={byId[i.a]}
                        b={byId[i.b]}
                        onConsent={(side, v) => setConsent(i.id, side, v)}
                        onStage={(s) => updateIntro(i.id, (x) => ({ ...x, stage: s }))}
                        onOutcome={(t) => updateIntro(i.id, (x) => ({ ...x, outcome: t }))}
                        onOpen={(id) => { setView("guests"); setOpenGuest(id); }}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        )}

        {view === "tables" && (
          <section>
            <header className="h-head">
              <h1>Tables</h1>
            </header>
            <ul className="h-tables">
              {[...dinners].reverse().map((d) => {
                const at = store.guests.filter((g) => g.dinners.includes(d.id));
                const answered = at.filter((g) => g.answers.length).length;
                return (
                  <li key={d.id}>
                    <div className="h-tables__no">{roman(d.number)}</div>
                    <div className="h-tables__main">
                      <strong>{formatDate(d.date)}</strong>
                      <span className="h-muted h-block">{d.venue} · {d.photo === null ? "no group photo (typographic card)" : d.photo === "pending" ? "photo to upload" : "photo ready"}</span>
                      <div className="h-chips">
                        {at.map((g) => (
                          <button key={g.id} type="button" className="h-chip" onClick={() => { setView("guests"); setOpenGuest(g.id); }}>
                            {g.firstName} {g.lastName[0]}.
                          </button>
                        ))}
                        {at.length === 0 && <span className="h-muted">No guests in the sample</span>}
                      </div>
                    </div>
                    <div className="h-tables__stat">
                      <strong>{answered}/{at.length}</strong>
                      <span className="h-muted">answered</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>

      {draft && <DraftModal draft={draft} onClose={() => setDraft(null)} onCopied={() => flash("Email copied — paste into Gmail")} />}

      {newIntro && (
        <IntroModal
          value={newIntro}
          guests={store.guests}
          onChange={setNewIntro}
          onClose={() => setNewIntro(null)}
          onCreate={() => createIntro(newIntro.a, newIntro.b, newIntro.why)}
        />
      )}

      {toast && <div className="h-toast" role="status">{toast}</div>}
    </div>
  );
}

function GuestCard({
  guest,
  intros,
  name,
  onBack,
  onRead,
  onNote,
  onCopy,
  onDraft,
  onIntro,
}: {
  guest: HostGuest;
  intros: Intro[];
  name: (id: string) => string;
  onBack: () => void;
  onRead: () => void;
  onNote: (t: string) => void;
  onCopy: () => void;
  onDraft: (k: "invite" | "catchup") => void;
  onIntro: () => void;
}) {
  const [note, setNote] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const l = latest(guest);
  const st = status(guest);
  const older = guest.answers.slice(0, -1).reverse();

  return (
    <section className="h-guest">
      <button type="button" className="h-link h-back" onClick={onBack}>← All guests</button>
      <header className="h-guest__head">
        <div>
          <h1>{guest.firstName} {guest.lastName}</h1>
          <p className="h-muted">{guest.field} · {guest.company} · {guest.email}</p>
          <div className="h-chips">
            {guest.tags.map((t) => <span key={t} className="h-chip h-chip--tag">{t}</span>)}
          </div>
        </div>
        <div className="h-actions h-actions--col">
          <button type="button" className="h-btn" onClick={onIntro}>Plan an introduction</button>
          <button type="button" className="h-btn h-btn--quiet" onClick={onCopy}>Copy personal link</button>
          <button type="button" className="h-btn h-btn--quiet" onClick={() => onDraft(l ? "catchup" : "invite")}>
            {l ? "Draft “Has anything changed?”" : "Draft invitation"}
          </button>
        </div>
      </header>

      <div className="h-guest__grid">
        <div>
          <h2 className="h-h2">
            What {guest.firstName} shared
            {l && <span className={`h-pill h-pill--${st.key}`}>{st.label}</span>}
          </h2>
          {l ? (
            <div className="h-answers">
              <p className={`h-consent h-consent--${l.sharing}`}>
                {l.sharing === "introductions"
                  ? "You may mention this when suggesting an introduction."
                  : `Private — for your understanding only. Ask ${guest.firstName} before mentioning any of it.`}
              </p>
              <dl>
                {(Object.keys(QUESTION_LABEL) as (keyof Answers)[]).map((k) =>
                  l.answers[k] ? (
                    <div key={k}>
                      <dt>{QUESTION_LABEL[k]}</dt>
                      <dd>{l.answers[k]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              <p className="h-muted h-small">Shared {short(l.date)}</p>
              {!l.read && <button type="button" className="h-btn h-btn--quiet" onClick={onRead}>Mark as read</button>}
              {older.length > 0 && (
                <>
                  <button type="button" className="h-link" onClick={() => setShowHistory((v) => !v)}>
                    {showHistory ? "Hide" : "Show"} earlier answers ({older.length})
                  </button>
                  {showHistory &&
                    older.map((o) => (
                      <dl key={o.date} className="h-old">
                        <p className="h-muted h-small">{short(o.date)}</p>
                        {(Object.keys(QUESTION_LABEL) as (keyof Answers)[]).map((k) =>
                          o.answers[k] ? (
                            <div key={k}>
                              <dt>{QUESTION_LABEL[k]}</dt>
                              <dd>{o.answers[k]}</dd>
                            </div>
                          ) : null,
                        )}
                      </dl>
                    ))}
                </>
              )}
            </div>
          ) : (
            <p className="h-empty">{guest.linkSentAt ? `Link sent ${short(guest.linkSentAt)}. No answer yet.` : "The personal link hasn’t been sent yet."}</p>
          )}
        </div>

        <div>
          <h2 className="h-h2">Tables</h2>
          <ul className="h-mini">
            {guest.dinners.map((id) => {
              const d = dinners.find((x) => x.id === id)!;
              return <li key={id}><span className="h-num">No. {roman(d.number)}</span> {formatDate(d.date)}</li>;
            })}
          </ul>

          <h2 className="h-h2">Introductions</h2>
          <ul className="h-mini">
            {intros.map((i) => (
              <li key={i.id}>
                {name(i.a === guest.id ? i.b : i.a)} <span className="h-muted">· {STAGES.find((s) => s.key === i.stage)!.label}</span>
              </li>
            ))}
            {intros.length === 0 && <li className="h-muted">None yet</li>}
          </ul>

          <h2 className="h-h2">Your notes</h2>
          <ul className="h-notes">
            {guest.notes.map((n, idx) => (
              <li key={idx}><span className="h-muted h-small">{short(n.date)}</span>{n.text}</li>
            ))}
          </ul>
          <form
            className="h-note-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (note.trim()) {
                onNote(note.trim());
                setNote("");
              }
            }}
          >
            <textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Something to remember about ${guest.firstName}`} aria-label="New note" />
            <button type="submit" className="h-btn h-btn--quiet" disabled={!note.trim()}>Add note</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ConsentToggle({ label, value, onChange }: { label: string; value: Consent; onChange: (v: Consent) => void }) {
  return (
    <div className="h-consent-row">
      <span>{label}</span>
      <div className="h-seg" role="group" aria-label={`${label} consent`}>
        {(["pending", "yes", "no"] as Consent[]).map((v) => (
          <button key={v} type="button" aria-pressed={value === v} className={value === v ? `is-on is-${v}` : ""} onClick={() => onChange(v)}>
            {v === "pending" ? "Not asked" : v === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function IntroCard({
  intro,
  a,
  b,
  onConsent,
  onStage,
  onOutcome,
  onOpen,
}: {
  intro: Intro;
  a: HostGuest;
  b: HostGuest;
  onConsent: (side: "consentA" | "consentB", v: Consent) => void;
  onStage: (s: IntroStage) => void;
  onOutcome: (t: string) => void;
  onOpen: (id: string) => void;
}) {
  const [outcome, setOutcome] = useState(intro.outcome ?? "");
  const bothYes = intro.consentA === "yes" && intro.consentB === "yes";
  const privateSide = [a, b].find((g) => latest(g)?.sharing === "private");

  return (
    <li className="h-intro">
      <p className="h-intro__pair">
        <button type="button" className="h-link" onClick={() => onOpen(a.id)}>{a.firstName} {a.lastName}</button>
        <span>×</span>
        <button type="button" className="h-link" onClick={() => onOpen(b.id)}>{b.firstName} {b.lastName}</button>
      </p>
      <p className="h-intro__why">{intro.why}</p>
      {privateSide && (
        <p className="h-warn">{privateSide.firstName} keeps answers private. Ask without quoting what they shared.</p>
      )}

      {(intro.stage === "idea" || intro.stage === "asking") && (
        <>
          <ConsentToggle label={a.firstName} value={intro.consentA} onChange={(v) => onConsent("consentA", v)} />
          <ConsentToggle label={b.firstName} value={intro.consentB} onChange={(v) => onConsent("consentB", v)} />
          <div className="h-actions">
            <button type="button" className="h-btn" disabled={!bothYes} onClick={() => onStage("introduced")}>
              {bothYes ? "Mark as introduced" : "Waiting for both yeses"}
            </button>
          </div>
        </>
      )}

      {intro.stage === "introduced" && (
        <div className="h-actions">
          <button type="button" className="h-btn" onClick={() => onStage("met")}>They met</button>
          <button type="button" className="h-link" onClick={() => onStage("declined")}>Didn’t happen</button>
        </div>
      )}

      {(intro.stage === "met" || intro.stage === "declined") && (
        <form
          className="h-note-form"
          onSubmit={(e) => {
            e.preventDefault();
            onOutcome(outcome.trim());
          }}
        >
          <textarea id={`outcome-${intro.id}`} rows={2} value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="What came of it?" aria-label="Outcome" />
          {outcome.trim() !== (intro.outcome ?? "") && <button type="submit" className="h-btn h-btn--quiet">Save</button>}
        </form>
      )}
      <p className="h-muted h-small">Planned {short(intro.created)}</p>
    </li>
  );
}

function IntroModal({
  value,
  guests,
  onChange,
  onClose,
  onCreate,
}: {
  value: { a: string; b: string; why: string };
  guests: HostGuest[];
  onChange: (v: { a: string; b: string; why: string }) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  const ok = value.a && value.b && value.a !== value.b && value.why.trim();
  const sameTable =
    value.a && value.b &&
    guests.find((g) => g.id === value.a)?.dinners.some((d) => guests.find((g) => g.id === value.b)?.dinners.includes(d));
  return (
    <div className="h-modal" role="dialog" aria-modal="true" aria-labelledby="intro-title" onClick={onClose}>
      <form className="h-modal__box" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); if (ok) onCreate(); }}>
        <h2 id="intro-title">Plan an introduction</h2>
        <div className="h-field-row">
          {(["a", "b"] as const).map((side) => (
            <label key={side} className="h-field">
              <span>{side === "a" ? "Introduce" : "To"}</span>
              <select id={`intro-${side}`} value={value[side]} onChange={(e) => onChange({ ...value, [side]: e.target.value })}>
                <option value="">Choose a guest</option>
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>{g.firstName} {g.lastName} — {g.field}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {sameTable && <p className="h-warn">They have already sat at the same table.</p>}
        <label className="h-field">
          <span>Why they should meet</span>
          <textarea id="intro-why" rows={3} value={value.why} onChange={(e) => onChange({ ...value, why: e.target.value })} placeholder="One or two sentences you could say to each of them" />
        </label>
        <div className="h-actions">
          <button type="submit" className="h-btn" disabled={!ok}>Add as idea</button>
          <button type="button" className="h-link" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function DraftModal({
  draft,
  onClose,
  onCopied,
}: {
  draft: { guest: HostGuest; kind: "invite" | "catchup" };
  onClose: () => void;
  onCopied: () => void;
}) {
  const g = draft.guest;
  const link = guestLink(g.token);
  const text =
    draft.kind === "invite"
      ? `Subject: Your table, beyond dinner\n\nHi ${g.firstName},\n\nI’ve been thinking about the evening you joined us, and about the people around that table.\n\nI’ve made a small private page for you, a look back at your table and the others since. At the end I ask what you’re working on now and who you’d enjoy meeting. It takes a couple of minutes.\n\n${link}\n\nLooking forward,\nMichał`
      : `Subject: Has anything changed?\n\nHi ${g.firstName},\n\nIt’s been a while since you told me what you were working on. I’d love to hear where things are now.\n\nYour page is still here, with what you shared last time. Change as much or as little as you like.\n\n${link}\n\nWarmly,\nMichał`;
  return (
    <div className="h-modal" role="dialog" aria-modal="true" aria-labelledby="draft-title" onClick={onClose}>
      <div className="h-modal__box" onClick={(e) => e.stopPropagation()}>
        <h2 id="draft-title">Draft for {g.firstName}</h2>
        <p className="h-muted h-small">Sent from your own inbox. In production this becomes a Gmail draft, ready for you to edit and send.</p>
        <pre className="h-draft">{text}</pre>
        <div className="h-actions">
          <button type="button" className="h-btn" onClick={() => { copy(text); onCopied(); onClose(); }}>Copy email</button>
          <button type="button" className="h-link" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
