# Contributing

Thanks for considering a contribution! This dataset is open-sourced so that
the resume / hiring / ATS community can keep it accurate over time.

## What we accept

- **Company additions** — append a row to `data/companies.csv` with the same
  schema. Please include a source link in the PR description that backs up
  the ATS attribution (a screenshot of the apply portal, the apply URL,
  etc.).
- **ATS corrections** — if a company migrated ATSes since June 2026, open a
  PR with the new attribution and a source link.
- **New helper functions** in `src/index.ts` — keep them small, typed,
  documented with a JSDoc block, and covered by a smoke test.
- **Doc fixes** — README typos, broken links, clarifications. Always
  welcome.

## What we won't merge

- New dependencies in the published package (we keep this dependency-free
  on purpose). Dev-deps are fine.
- Bulk regenerations of the dataset without per-row sourcing — quality of
  attribution is the whole product.
- Changes to the CSV schema (column rename/removal) without prior
  discussion in an issue — it would be a breaking change for downstream
  pandas / R / SQL consumers.

## Workflow

1. Fork the repo and create a feature branch.
2. Make your changes. If editing the CSV, double-check column order.
3. `npm install && npm run build && npm test` — must pass.
4. Open a PR. CI runs on Node 18 / 20 / 22.

## Schema reference

| Column                | Type     | Notes                                                |
| --------------------- | -------- | ---------------------------------------------------- |
| `name`                | string   | Human-readable company name.                         |
| `slug`                | string   | URL-safe. Maps to /ats-checker/[slug].               |
| `industry`            | string   | Free-form (e.g. "Technology", "Investment Banking"). |
| `ats_system`          | string   | Vendor name as it appears in the report.             |
| `hiring_volume_tier`  | enum     | `mega`, `high`, or `mid`. Optional.                  |
| `top_roles`           | string   | Pipe-delimited list of role slugs. Optional.         |
| `source_url`          | URL      | Canonical ResumeAI page for the company.             |

## Code of conduct

Be kind. Disagreements about data are fine; personal attacks are not.

— Maintained by [Kayvan Zahiri](https://github.com/Kayvan-Zahiri) for
[ResumeAI](https://withresumeai.com).
