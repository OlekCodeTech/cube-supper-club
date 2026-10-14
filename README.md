# Cube Supper Club — returning guests

Personal page for returning guests: `/t/<token>/` (five chapters: Your Table → One table became many → The dinner ends → Keep the conversation going → The conversation continues).

- Data: `src/data/dinners.ts` (dinners + guests; `photo`: path | "pending" | null)
- Photos: `public/photos/`
- Form endpoint: `NEXT_PUBLIC_FORM_ENDPOINT` (without it the submit is simulated)
- Proposal (PL): `docs/propozycja.html`

```
npm run dev
npm run build   # static export to out/
```
