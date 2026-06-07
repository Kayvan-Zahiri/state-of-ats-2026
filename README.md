# State of ATS 2026 — Dataset

[![npm version](https://img.shields.io/npm/v/@withresumeai/ats-data.svg)](https://www.npmjs.com/package/@withresumeai/ats-data)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Kayvan-Zahiri/state-of-ats-2026?style=social)](https://github.com/Kayvan-Zahiri/state-of-ats-2026)
[![CI](https://github.com/Kayvan-Zahiri/state-of-ats-2026/actions/workflows/test.yml/badge.svg)](https://github.com/Kayvan-Zahiri/state-of-ats-2026/actions/workflows/test.yml)
[![Maintained by ResumeAI](https://img.shields.io/badge/maintained%20by-ResumeAI-blue)](https://withresumeai.com)

The 743-employer Applicant Tracking System dataset from the
[**State of ATS 2026** report](https://withresumeai.com/reports/state-of-ats-2026).
Workday now powers **75.4%** of Fortune-500 hiring. Greenhouse is the venture
default at **16.7%**. The top three vendors together cover **93.7%** of the
employers in the dataset. Published as a CSV + typed TypeScript wrapper so
you can drop it into a notebook, a SQL warehouse, or your job board without
any scraping.

---

## Headline numbers

| ATS vendor   | Companies | Share of dataset |
| ------------ | --------: | ---------------: |
| Workday      |       560 |        **75.4%** |
| Greenhouse   |       124 |        **16.7%** |
| Internal ATS |        15 |             2.0% |
| USAJobs      |        13 |             1.7% |
| Taleo        |        11 |             1.5% |
| Lever        |        10 |             1.3% |

> **Top 3 vendors (Workday + Greenhouse + Taleo) cover 93.7% of large
> employers.** The remainder is a long tail of niche vendors and proprietary
> internal systems (Amazon, Meta, Google, Microsoft).

---

## Install

```bash
npm install @withresumeai/ats-data
```

```ts
import {
  companies,
  getATSForCompany,
  getCompaniesByATS,
  getCompaniesByIndustry,
  atsDistribution,
  atsShare,
} from "@withresumeai/ats-data";

console.log(companies.length); // 743

getATSForCompany("apple");
// → { company: "Apple", slug: "apple", atsSystem: "Workday", industry: "Technology", sourceUrl: "..." }

getATSForCompany("Stripe");
// → { company: "Stripe", ... atsSystem: "Greenhouse", ... }

getCompaniesByATS("Workday").length; // 560

atsDistribution();
// → { Workday: 560, Greenhouse: 124, "Internal ATS": 15, USAJobs: 13, Taleo: 11, Lever: 10, ... }

atsShare();
// → { Workday: 75.37, Greenhouse: 16.69, ... }
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

df["ats_system"].value_counts().head(8)
```

### Raw CSV download

- **GitHub:** [`data/companies.csv`](./data/companies.csv)
- **Canonical URL:** <https://withresumeai.com/api/reports/state-of-ats-2026/csv>
- **Schema:** `name, slug, industry, ats_system, hiring_volume_tier, top_roles, source_url`

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

743 rows in total. Coverage spans the Fortune 500, the Global 2000, and a
curated set of high-growth private companies (Series C and later, $1B+
valuation).

---

## Methodology

The dataset covers 743 large employers selected to maximize coverage of
where U.S. and global job seekers actually apply — by hiring volume rather
than headline market cap.

For each employer, the ATS system was identified by **inspecting the
public careers portal between April and June 2026**. We used three
signals to attribute an ATS, in order:

1. The host or subdomain of the apply URL (e.g. `myworkdayjobs.com` for
   Workday, `boards.greenhouse.io` for Greenhouse, `jobs.lever.co` for
   Lever).
2. DOM fingerprints in the apply-form HTML.
3. The underlying form-submission endpoint observed via network inspection.

Each company is tagged with three additional attributes: **industry** (71
distinct industries, bucketed into 13 categories for cross-tabs),
**hiring volume tier** (mega: 100k+ employees; high: Fortune 500 / major
hirer; mid: mid-cap / growth-stage), and **top hiring roles** (1–3 role
slugs that map to the dominant openings on the portal).

**Limitations.** First, we only sampled public-facing careers portals —
companies that route hiring through staffing firms or executive search are
under-represented for those roles. Second, this is a point-in-time
snapshot; mid-market companies churn ATSes more frequently than enterprises
and a small share will have migrated since data collection. Third,
"Internal ATS" is an umbrella for proprietary systems we could not
attribute to a named vendor — most are custom builds on top of vendor
cores (e.g. Amazon, Meta, and several large insurance carriers).

The full methodology, vendor-by-vendor commentary, and cross-tabs by
industry and seniority are in the
[**State of ATS 2026** report](https://withresumeai.com/reports/state-of-ats-2026).

---

## Citation

If you use the dataset in journalism, research, or a downstream product,
please cite as:

> Zahiri, K. (2026). *State of ATS 2026: Applicant Tracking Systems used
> by 743 large employers.* ResumeAI.
> <https://withresumeai.com/reports/state-of-ats-2026>

BibTeX:

```bibtex
@misc{zahiri2026stateofats,
  author       = {Zahiri, Kayvan},
  title        = {State of ATS 2026: Applicant Tracking Systems used by 743 large employers},
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
