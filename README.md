# State of ATS 2026 — Dataset

[![npm version](https://img.shields.io/npm/v/@withresumeai/ats-data.svg)](https://www.npmjs.com/package/@withresumeai/ats-data)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

A selected employer dataset of ATS attributions and published careers-portal evidence, with a CSV and a typed, dependency-free Node.js API. Published by [ResumeAI](https://withresumeai.com) alongside the [State of ATS 2026 report](https://withresumeai.com/reports/state-of-ats-2026).

<!-- dataset-stats:start -->
This snapshot contains **738 employers**, with **421 rows marked `verified=true`** and **557 rows containing a recorded `apply_host`**. These are different measures. The latest nonempty per-row `checked_at` is **2026-10-09**.

The table counts only rows marked `verified=true` in this selected snapshot. It is not an estimate of industry-wide market share or current employer configurations.

| ATS vendor | Records | Share of flagged subset |
| --- | ---: | ---: |
| Workday | 203 | 48.2% |
| Greenhouse | 65 | 15.4% |
| Oracle Cloud HCM | 30 | 7.1% |
| iCIMS | 30 | 7.1% |
| Eightfold | 17 | 4.0% |
| Avature | 14 | 3.3% |
| Ashby | 14 | 3.3% |
| SmartRecruiters | 11 | 2.6% |
| Taleo | 8 | 1.9% |
| Internal / proprietary | 6 | 1.4% |
| SAP SuccessFactors | 6 | 1.4% |
| USAJobs | 6 | 1.4% |
<!-- dataset-stats:end -->

Version **2.1.0** is a re-verification of this snapshot on **2026-10-09**. Version 2.0.0 copied the September 2026 export and did not check employers again. The latest nonempty `checked_at` is **2026-10-09** on rows that cleared this pass. Other rows may still carry an earlier date.

**421 of 738** employers are marked `verified=true`: 420 confirmed on the recorded vendor, plus Rocket Lab, whose recorded vendor changed from Workday to Greenhouse. The previous headline base was **704** rows marked verified. This pass kept a row in that base only when a live probe on 2026-10-09 met the evidence rules below. **284** previously verified rows missed that bar, and one previously unverified row (Orange, Workday) was confirmed, so the verified base is 704 − 284 + 1 = **421**.

The other **317** rows are labeled **not re-verified in Oct 2026**. That set is the 284 rows whose verified flag was cleared, plus 33 rows that were already unverified. Their recorded `ats_system`, `apply_host`, `evidence_method`, and `checked_at` stay as historical attribution. `verified=false` on these rows means this pass could not re-prove them. It does not relabel the recorded vendor as wrong. They drop out of every headline percentage.

The share table above counts only the re-verified subset of this selected sample. It is not an estimate of industry-wide market share. The re-verified subset over-represents vendors with public job APIs (Workday, Greenhouse, Oracle, and iCIMS tenant hosts) and under-represents SuccessFactors, Avature, and BrassRing, which mostly sit on shared hosts. These shares describe the re-verified subset only, not the market.

Per-employer evidence URLs from the 2026-10-09 pass are in [`data/verification-2026-10.csv`](./data/verification-2026-10.csv).

## Install and use

Requires Node.js 18 or later. Pin the package version for reproducible work:

```sh
npm install --save-exact @withresumeai/ats-data@2.1.0
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

`atsDistribution()` returns counts and `atsShare()` returns percentages within the rows marked verified, which in this release is the 2026-10-09 re-verified subset. Both accept `{ all: true }` to include rows labeled not re-verified in Oct 2026. Their default results describe this selected sample, not industry-wide market share, and that subset over-represents vendors with public job APIs. For an evidence-host subset, filter `companies` by `applyHost` before computing your own counts.

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
| `verified` | `verified` | `true` when re-verified with live evidence on 2026-10-09; `false` when labeled not re-verified in Oct 2026, with historical attribution kept. `boolean`. |
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

## October 2026 evidence rules

The 2026-10-09 pass used live HTTP probes from one machine, about one request per second per vendor host, with a custom user agent identifying ResumeAI. A row is marked `verified=true` only when one of these held:

1. A vendor job API on the employer's own tenant returned live postings. Accepted APIs are the Workday CXS jobs endpoint (career sites read from that tenant's `robots.txt`), the Greenhouse board API (the board name matches the employer and lists at least one job), the Lever or Ashby posting APIs (title match), the SmartRecruiters postings API (company name match), and the Oracle Recruiting CE requisitions API (at least one job).
2. The employer's recorded careers host loaded a page other than a login or SSO wall, and the vendor's domain appeared in the redirect chain or the HTML contained at least two references to that vendor.
3. For Internal ATS, an employer-run careers or jobs page loaded and showed no third-party ATS signature.

A row that met none of these is labeled **not re-verified in Oct 2026** (`verified=false`). Typical causes are no recorded careers host, a shared vendor host with no employer tenant id (for example `careerN.successfactors.com` or `sjobs.brassring.com`), an SSO wall, a bot challenge, no public site, or a weak single-hit signature. This release does not infer a vendor for those rows and does not replace the recorded vendor. A review-flag lead, including a live board on a different vendor, stays under review in the changelog and is left unchanged.

`checked_at` on a re-verified row is 2026-10-09. On a row not re-verified in Oct 2026, `checked_at` remains the earlier observation date when one was published.

## Provenance and limits

Initial ATS attributions were compiled with AI from public information. Later passes added automated portal and vendor probes and manually recorded portal URLs. The October 2026 pass is a re-verification of the full 738-row file against the rules above. Read the [report methodology](https://withresumeai.com/reports/state-of-ats-2026#methodology) and the per-row fields before interpreting a count.

- `verified=true` in this snapshot means live evidence on 2026-10-09 under the rules above. Read `apply_host`, `evidence_method`, and `checked_at` on that row before citing the host.
- Rows labeled not re-verified in Oct 2026 keep their historical attribution. A blank host, method, or date means that detail was not published. The recorded vendor stays in place.
- A careers host does not reveal private screening rules, resume parser behavior, or every configuration across jobs, regions, and subsidiaries.
- The employer list is a selected sample, not a representative survey. Shares of the re-verified subset over-represent vendors with public job APIs. Attributions can change after their recorded checks. This release makes no guarantee of a recurring refresh schedule.

## Contributing, citation, and license

See [CONTRIBUTING.md](https://github.com/Kayvan-Zahiri/state-of-ats-2026/blob/main/CONTRIBUTING.md) for evidence and schema requirements. Citation is appreciated: Kayvan Zahiri / ResumeAI (2026), *State of ATS 2026*. Include the package version or repository revision used. Machine-readable metadata is in [CITATION.cff](./CITATION.cff).

MIT; see [LICENSE](./LICENSE). Retain its copyright and permission notices when distributing copies or substantial portions. A scholarly or journalistic citation is optional; [NOTICE.md](./NOTICE.md) explains that distinction.
