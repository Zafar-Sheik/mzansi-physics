# Privacy & security

- **No accounts, no tracking, no analytics, no cookies.** Progress, flashcard boxes and preferences are stored only in the learner's browser (`localStorage`, under `physicsmzansi:` keys). Nothing is sent to a server – POPIA-friendly by design.
- Learners can **export** their progress to a file and **import** it on another device, or **reset** it.
- Typed answers are checked by a small parser in the browser – **no `eval`**, so nothing a learner types can run as code.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`. The site has no forms that submit data anywhere.
- The `/api/curriculum` endpoint is a static, read-only JSON description of the curriculum (no learner data).
