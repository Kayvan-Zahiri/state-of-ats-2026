# State of ATS 2026 — Dataset

[![npm version](https://img.shields.io/npm/v/@withresumeai/ats-data.svg)](https://www.npmjs.com/package/@withresumeai/ats-data)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

A selected employer dataset of ATS attributions and published careers-portal evidence, with a CSV and a typed, dependency-free Node.js API. Published by [ResumeAI](https://withresumeai.com) alongside the [State of ATS 2026 report](https://withresumeai.com/reports/state-of-ats-2026).

<!-- dataset-stats:start -->
This snapshot contains **738 employers**, with **704 rows marked `verified=true`** and **551 rows containing a recorded `apply_host`**. These are different measures. The latest nonempty per-row `checked_at` is **2026-08-13**; a package release does not re-verify the employers.

The table counts only rows marked `verified=true` in this selected snapshot. It is not an estimate of industry-wide market share or current employer configurations.

| ATS vendor | Records | Share of flagged subset |
| --- | ---: | ---: |
| Workday | 267 | 37.9% |
| Greenhouse | 88 | 12.5% |
| SAP SuccessFactors | 68 | 9.7% |
| Oracle Cloud HCM | 49 | 7.0% |
| iCIMS | 39 | 5.5% |
| Internal / proprietary | 30 | 4.3% |
| Avature | 26 | 3.7% |
| Eightfold | 24 | 3.4% |
| SmartRecruiters | 19 | 2.7% |
| Taleo | 17 | 2.4% |
| Ashby | 15 | 2.1% |
| USAJobs | 10 | 1.4% |
<!-- dataset-stats:end -->

Version **2.0.0** copies the canonical export for the September 2026 release. A package release or copy date is not a revalidation date: the latest nonempty `checked_at` in this snapshot is **2026-08-13**, and individual rows may have earlier dates or no date. The verification flag and a published evidence host are different measures.

## Install and use

Requires Node.js 18 or later. Pin the package version for reproducible work:

```sh
npm install --save-exact @withresumeai/ats-data@2.0.0
```

ES modules (`.mjs`, or a project with `"type": "module"`):

```js
import { companies, verifiedCompanies, getATSForCompany } from "@withresumeai/ats-data";

console.log(companies.length, verifiedCompanies.length);
console.log(getATSForCompany("apple")); // Snapshot attribution; null if absent.
const recordedHostRows = companies.filter((company) => company.applyHost);
console.log(recordedHostRows.length);
```

CommonJS (`.cjs`):

```js
const { companies, getATSForCompany } = require("@withresumeai/ats-data");
console.log(companies.length, getATSForCompany("apple"));
```

Both module formats load the package's own bundled CSV, regardless of the caller's working directory. A caller's `data/companies.csv` does not override it.

`companies` contains all rows; `verifiedCompanies` filters the dataset's `verified` flag. `getATSForCompany(nameOrSlug)` performs a case-insensitive lookup and returns only `{ company, slug, atsSystem, industry, sourceUrl }`, or `null`. Find a row in `companies` when you need its verification or evidence fields. `getCompaniesByATS(name)` and `getCompaniesByIndustry(name)` return matching rows, including unconfirmed ones.

`atsDistribution()` returns counts and `atsShare()` returns percentages within the rows marked verified. Both accept `{ all: true }` to include unconfirmed rows. Their results describe this selected sample, not industry-wide market share. For an evidence-host subset, filter `companies` by `applyHost` before computing your own counts.

### Python / pandas

After installing the npm package and pandas (`pip install pandas`), run this from the directory containing `node_modules`:

```python
import pandas as pd

df = pd.read_csv(
    "node_modules/@withresumeai/ats-data/data/companies.csv",
    keep_default_na=False,
)
verified = df.loc[df["verified"]]
recorded_host_rows = df.loc[df["apply_host"].ne("")]
print(df.shape)
print(verified["ats_system"].value_counts().head(5))
```

The CSV starts with its header; no `comment="#"` option is needed. `keep_default_na=False` preserves empty CSV fields as empty strings. Download the [repository CSV](https://github.com/Kayvan-Zahiri/state-of-ats-2026/blob/main/data/companies.csv) or [canonical export](https://withresumeai.com/api/reports/state-of-ats-2026/csv) separately if preferred; those URLs may change independently of an installed package version.

Runnable repository examples are in [`examples/quickstart.mjs`](https://github.com/Kayvan-Zahiri/state-of-ats-2026/blob/main/examples/quickstart.mjs) and [`examples/python.py`](https://github.com/Kayvan-Zahiri/state-of-ats-2026/blob/main/examples/python.py).

## CSV and TypeScript schema

The CSV has 14 columns in the order below. Blank evidence and geography strings become `undefined` in the JavaScript API. An empty `top_roles` value becomes an empty array.

| CSV column | `Company` property | Meaning / JavaScript type |
| --- | --- | --- |
| `name` | `name` | Employer name; `string`. |
| `slug` | `slug` | Company-guide identifier; `string`. |
| `industry` | `industry` | Assigned industry label; `string`. |
| `ats_system` | `atsSystem` | Recorded ATS attribution; `ATSSystem`. |
| `verified` | `verified` | Dataset verification flag; `boolean`. |
| `apply_host` | `applyHost` | Published careers/apply host; optional `string`. |
| `evidence_method` | `evidenceMethod` | Published evidence method; optional `string`. |
| `checked_at` | `checkedAt` | Per-row evidence date (`YYYY-MM-DD`); optional `string`. |
| `hq_country` | `hqCountry` | Assigned headquarters country; optional `string`. |
| `hq_country_code` | `hqCountryCode` | Assigned headquarters country code; optional `string`. |
| `hq_region` | `hqRegion` | Assigned headquarters region; optional `string`. |
| `hiring_volume_tier` | `hiringVolumeTier` | Editorial tier: `mega`, `high`, or `mid`; optional `HiringVolumeTier`. |
| `top_roles` | `topRoles` | Pipe-separated role slugs in CSV; optional `string[]` in JavaScript. |
| `source_url` | `sourceUrl` | ResumeAI company-guide URL; `string`. |

`source_url` points to `https://withresumeai.com/ats-checker/{slug}`, not an independent employer evidence page. Hiring tiers and role labels are descriptive metadata, not measured current vacancy counts or live job listings. Types `Company`, `ATSInfo`, `ATSSystem`, and `HiringVolumeTier` are exported.

## Upgrading from 1.3.0

**Version 2 is a breaking CSV schema update:** the published npm 1.3.0 snapshot had 743 rows and 8 columns; this release has 738 rows and 14 columns. The six evidence/headquarters columns were added, `verified` moved to fifth, and `source_url` is now last. The prose preamble was removed. Update positional readers, skipped-line settings, row-count assertions, and schema checks; prefer named columns.

The JavaScript helpers retain their signatures and the narrow `getATSForCompany` result. Full `Company` rows now expose the six optional evidence/headquarters properties above. Dataset contents and lookup availability have changed between snapshots.

Five former duplicate record slugs are absent: `anthem`, `ge`, `k12`, `smurfit-kappa`, and `square`. In the [recorded deduplication](https://github.com/Kayvan-Zahiri/state-of-ats-2026/commit/6f667a20d3e488d9a37a127ae5be90e77e35eec9), their retained counterparts are `elevance-health`, `ge-aerospace`, `stride`, `westrock`, and `block`, respectively. These are historical record aliases, not automatic lookup redirects or claims about current corporate relationships.

Keep the old package snapshot when a migration is not yet possible:

```sh
npm install --save-exact @withresumeai/ats-data@1.3.0
```

## Provenance and limits

Initial ATS attributions were compiled with AI from public information and were not individually checked. Subsequent evidence combines automated portal/vendor probes with manually recorded portal URLs. Read the [report methodology](https://withresumeai.com/reports/state-of-ats-2026#methodology) and the per-row fields before interpreting a count.

- `verified=true` alone may rest on the original June 2026 audit. Filter for a nonempty `apply_host` when you require recorded host evidence, then examine its method and date. Neither the flag nor that filter establishes current use.
- Blank host, method, or date fields mean the corresponding evidence detail is not published here. Rows marked `verified=false` remain unconfirmed attributions. Missing evidence does not establish that an employer has no ATS.
- A careers host does not reveal private screening rules, resume parser behavior, or every configuration across jobs, regions, and subsidiaries.
- The employer list is a selected sample, not a representative survey. Attributions can change after their recorded checks; this release makes no guarantee of a recurring refresh schedule.

## Contributing, citation, and license

See [CONTRIBUTING.md](https://github.com/Kayvan-Zahiri/state-of-ats-2026/blob/main/CONTRIBUTING.md) for evidence and schema requirements. Citation is appreciated: Kayvan Zahiri / ResumeAI (2026), *State of ATS 2026*. Include the package version or repository revision used. Machine-readable metadata is in [CITATION.cff](./CITATION.cff).

MIT; see [LICENSE](./LICENSE). Retain its copyright and permission notices when distributing copies or substantial portions. A scholarly or journalistic citation is optional; [NOTICE.md](./NOTICE.md) explains that distinction.
