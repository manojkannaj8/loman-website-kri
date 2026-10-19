# Build Studio — website

Single-page site for Build Studio, a construction, project management and quantity surveying practice in Co. Meath.

- `reference-analysis.md` — content and requirements extracted from the reference video
- `updates.md` — status, architecture, decisions, known issues, next steps

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` to have the enquiry form send email.

All copy lives in `src/lib/content.ts`.
