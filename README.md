# State of ATS 2026 — Dataset

[![npm version](https://img.shields.io/npm/v/@withresumeai/ats-data.svg)](https://www.npmjs.com/package/@withresumeai/ats-data)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Kayvan-Zahiri/state-of-ats-2026?style=social)](https://github.com/Kayvan-Zahiri/state-of-ats-2026)
[![CI](https://github.com/Kayvan-Zahiri/state-of-ats-2026/actions/workflows/test.yml/badge.svg)](https://github.com/Kayvan-Zahiri/state-of-ats-2026/actions/workflows/test.yml)
[![Maintained by ResumeAI](https://img.shields.io/badge/maintained%20by-ResumeAI-blue)](https://withresumeai.com)

The 738-employer Applicant Tracking System dataset from the
[**State of ATS 2026** report](https://withresumeai.com/reports/state-of-ats-2026).
Across the **704 employers verified against their live careers portals**,
Workday leads at **37.9%** — common, but well short of a majority — and the
market is far more fragmented than usually claimed: Greenhouse 12.5%, SAP
SuccessFactors 9.7%, Oracle Cloud HCM 7.0%, then a long tail of iCIMS,
Avature, Eightfold, SmartRecruiters, Taleo, and Ashby. The top three vendors together
cover 60.1% — not the "triopoly" often claimed — and 36 distinct platforms are in
active use. Published as a CSV + typed TypeScript wrapper so you can drop it into
a notebook, a SQL warehouse, or your job board without any scraping.

> ### ⚠️ Accuracy notice (June 2026)
> An earlier version of this dataset reported Workday at 75.4% with a
> "hand-verified" methodology. That was wrong: the original ATS attributions
> were **compiled with AI from public information and were not individually
> verified**. A portal-verification audit found them only ~52% accurate (the
> model defaulted to "Workday" when unsure). We have since re-checked **704 of
> the 738** employers against their live careers-portal apply-URL hosts. Those
> rows now carry **`verified: true`** and the numbers above reflect ONLY that
> verified subset. The remaining ~30 rows are `verified: false` — unconfirmed
> prior estimates; treat them as leads, not facts. **For analysis, filter to
> `verified === true`.**

---

## Headline numbers

Share of the **704 portal-verified employers** (`verified === true`):

| ATS vendor        | Companies | Share (verified) |
| ----------------- | --------: | ---------------: |
| Workday           |       267 |        **37.9%** |
| Greenhouse        |        88 |        **12.5%** |
| SAP SuccessFactors|        68 |             9.7% |
| Oracle Cloud HCM  |        49 |             7.0% |
| iCIMS             |        39 |             5.5% |
| Internal / proprietary|        30 |             4.3% |
| Avature           |        26 |             3.7% |
| Eightfold         |        24 |             3.4% |
| SmartRecruiters   |        19 |             2.7% |
| Taleo             |        17 |             2.4% |
| Ashby             |        15 |             2.1% |
| USAJobs           |        10 |             1.4% |

> **The top 3 vendors (Workday + Greenhouse + SuccessFactors) cover ~60%** of
> verified employers — not the "triopoly" often claimed. 36 distinct ATS
> vendors appear across the verified set, plus proprietary internal systems
> (Amazon, Meta, Google, Microsoft run their own).

> **Job seeker?** The practical takeaway: the same resume is parsed
> differently by each ATS, so it scores differently in Workday vs Greenhouse
> vs Lever. The free [ResumeAI ATS checker](https://withresumeai.com/ats-checker)
> scores yours against the specific parser your target employer uses.

---

## Install

```bash
npm install @withresumeai/ats-data
```

```ts
import {
  companies,
  verifiedCompanies,
  getATSForCompany,
  getCompaniesByATS,
  getCompaniesByIndustry,
  atsDistribution,
  atsShare,
} from "@withresumeai/ats-data";

console.log(companies.length);          // 738 (all rows)
console.log(verifiedCompanies.length);  // 704 (verified === true)

getATSForCompany("apple");
// → { company: "Apple", slug: "apple", atsSystem: "Internal ATS", industry: "Technology", sourceUrl: "..." }

// Each row carries a `verified` flag — filter to it before trusting an attribution:
companies.find((c) => c.slug === "apple")?.verified; // true

// atsDistribution()/atsShare() count the VERIFIED subset by default:
atsDistribution();
// → { Workday: 267, Greenhouse: 88, SuccessFactors: 68, "Oracle Cloud HCM": 49, iCIMS: 39, "Internal ATS": 30, ... }

atsShare();
// → { Workday: 37.93, Greenhouse: 12.5, SuccessFactors: 9.66, ... }

atsShare({ all: true }); // include unconfirmed rows (not recommended for analysis)
```

Works the same in CommonJS:

```js
const { getATSForCompany } = require("@withresumeai/ats-data");
```

### Python (pandas)

The CSV is shipped inside the npm tarball, but you can also grab it
directly from this repo or from the live API:

```python
import pandas as pd

# Option A: install the npm package, then load from node_modules
df = pd.read_csv("node_modules/@withresumeai/ats-data/data/companies.csv", comment="#")

# Option B: download the canonical CSV from the published report
df = pd.read_csv(
    "https://withresumeai.com/api/reports/state-of-ats-2026/csv",
    comment="#",
)

df[df["verified"]]["ats_system"].value_counts().head(12)  # verified rows only
```

### Raw CSV download

- **GitHub:** [`data/companies.csv`](./data/companies.csv)
- **Canonical URL:** <https://withresumeai.com/api/reports/state-of-ats-2026/csv>
- **Schema:** `name, slug, industry, ats_system, hiring_volume_tier, top_roles, source_url, verified`

---

## What's in the dataset

Each row is one employer with seven fields:

| Column                | Example                                  |
| --------------------- | ---------------------------------------- |
| `name`                | `Apple`                                  |
| `slug`                | `apple`                                  |
| `industry`            | `Technology`                             |
| `ats_system`          | `Workday`                                |
| `hiring_volume_tier`  | `mega` &middot; `high` &middot; `mid`    |
| `top_roles`           | `software-engineer\|product-manager\|data-analyst` |
| `source_url`          | `https://withresumeai.com/ats-checker/apple` |
| `verified`            | `true` (confirmed vs live portal) · `false` (unconfirmed) |

738 rows in total — **704 with `verified=true`** and 34 with `verified=false`
(unconfirmed, flagged as such). Of the verified rows, 548 publish a recorded
apply host you can open in a browser; the remaining 156 rest on the June 2026
audit with no per-company artifact published, which is the weakest part of the
set and worth knowing before you lean on it. Coverage spans the Fortune 500, the Global
2000, and a curated set of high-growth private companies (Series C and later,
$1B+ valuation).

---

## Methodology

The dataset covers 738 large employers selected to maximize coverage of
where U.S. and global job seekers actually apply — by hiring volume rather
than headline market cap.

**Two-stage provenance (read this).** The company list and an initial ATS
guess for each were **compiled with AI from public information** — fast, but
not individually checked. That first pass was wrong often enough to matter (a
later audit measured ~52% accuracy; it over-assigned "Workday" whenever the
model was unsure). So in June 2026 we re-checked the roster against live portals, and in July 2026 a review of the 485 rows without an automated weekly probe corrected 115 of them for drift (acquisitions, renames, silent vendor migrations), bringing it to the current **704 verified of 738**. Automated apply-host sweeps have run since, roughly a pass a week; the last one reconfirmed 309 of the 462 employers whose vendor exposes a probeable endpoint
the right way:

- Open the employer's official careers/apply page and read the **apply-URL
  host** — the ground truth. `*.myworkdayjobs.com` → Workday,
  `boards.greenhouse.io` → Greenhouse, `jobs.lever.co` → Lever,
  `*.icims.com` → iCIMS, `*.oraclecloud.com/hcmUI` → Oracle, `*.successfactors.*`
  → SuccessFactors, `*.avature.net` → Avature, `jobs.ashbyhq.com` → Ashby,
  proprietary host (e.g. `jobs.apple.com`) → Internal.

Rows that passed that check have **`verified: true`**; the rest keep their
unconfirmed first-pass estimate with **`verified: false`**. Every market-share
number in this README and in `atsShare()` is computed over the verified subset
only.

Each company is also tagged with **industry**, a **hiring volume tier** (mega:
100k+ employees; high: Fortune 500 / major hirer; mid: mid-cap / growth-stage),
and **top hiring roles** (1–3 role slugs that map to the dominant openings).

**Limitations.** (1) 704 of 738 rows are flagged verified, but only 548 of
those publish a recorded apply host. The other 156 carry no per-company
artifact, so `verified` is doing more work on those rows than the evidence
shows. Filter on the evidence host, not just the flag, for anything
load-bearing. Provenance is mixed and stated per row: most apply hosts came
from automated portal and vendor probes, 47 were recorded by a person.
(2) Point-in-time snapshot — mid-market employers change ATSes often, and some
will have migrated since June 2026. (3) "Internal ATS" is an umbrella for
proprietary systems with no third-party vendor host (e.g. Amazon, Meta, Apple,
Google, Microsoft).

The full methodology, vendor-by-vendor commentary, and cross-tabs by
industry and seniority are in the
[**State of ATS 2026** report](https://withresumeai.com/reports/state-of-ats-2026).

---

## Citation

If you use the dataset in journalism, research, or a downstream product,
please cite as:

> Zahiri, K. (2026). *State of ATS 2026: Applicant Tracking Systems used
> by 738 large employers.* ResumeAI.
> <https://withresumeai.com/reports/state-of-ats-2026>

BibTeX:

```bibtex
@misc{zahiri2026stateofats,
  author       = {Zahiri, Kayvan},
  title        = {State of ATS 2026: Applicant Tracking Systems used by 738 large employers},
  year         = {2026},
  publisher    = {ResumeAI},
  howpublished = {\url{https://withresumeai.com/reports/state-of-ats-2026}},
  note         = {Dataset available at \url{https://github.com/Kayvan-Zahiri/state-of-ats-2026}}
}
```

---

## Contributing

PRs welcome — additions, corrections, ATS migrations. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the schema, the review process,
and what we will / won't merge.

---

## Related

- **State of ATS 2026** full report &mdash; <https://withresumeai.com/reports/state-of-ats-2026>
- **ATS checker** (per-company pages backed by this dataset) &mdash; <https://withresumeai.com/ats-checker>
- **ResumeAI** &mdash; the resume builder this dataset powers &mdash; <https://withresumeai.com>

## License

MIT. See [LICENSE](./LICENSE).

Built and maintained by [Kayvan Zahiri](https://github.com/Kayvan-Zahiri) /
[ResumeAI](https://withresumeai.com).
