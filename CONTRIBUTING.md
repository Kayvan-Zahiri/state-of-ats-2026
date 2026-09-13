# Contributing

Corrections, documented additions, and improvements to the package are welcome. Keep changes focused and explain the evidence behind each changed attribution.

## Dataset changes

Edit `data/companies.csv` using its 14-column header and order below. The header must be the first record: do not add prose/comment rows. Use standard CSV quoting for commas and quotes. The current package reader requires one physical line per record; embedded newlines are not supported. Keep `slug` unique and check for existing names or historical aliases before adding an employer.

For every attribution correction or addition, include the employer's official careers/apply URL, the observed host or vendor evidence, the collection method, and the observation date in the PR description. A ResumeAI company-guide `source_url` is not independent evidence. Label automated probes and manually recorded observations accurately. Do not infer a private screening setup from a public host or set `verified=true` merely because a prior row used that flag.

Leave evidence fields blank when the corresponding detail is unavailable. Do not fill missing dates with the PR or release date, fabricate hosts, or regenerate attributions in bulk without per-row sourcing. Check the [methodology and limitations](https://withresumeai.com/reports/state-of-ats-2026#methodology) before changing verification status.

## Schema

| CSV column, in order | Format | Notes |
| --- | --- | --- |
| `name` | string | Employer name. |
| `slug` | string | Unique URL-safe company-guide identifier. |
| `industry` | string | Assigned industry label. |
| `ats_system` | string | Recorded ATS attribution. |
| `verified` | `true` or `false` | Dataset verification status; does not guarantee a published host. |
| `apply_host` | string or blank | Recorded careers/apply host. |
| `evidence_method` | string or blank | Method used to collect the published evidence. |
| `checked_at` | `YYYY-MM-DD` or blank | Date of that row's evidence, not the release date. |
| `hq_country` | string or blank | Assigned headquarters country name. |
| `hq_country_code` | string or blank | Assigned headquarters country code. |
| `hq_region` | string or blank | Assigned headquarters region. |
| `hiring_volume_tier` | `mega`, `high`, `mid`, or blank | Editorial tier; not a vacancy count. |
| `top_roles` | pipe-separated slugs or blank | Role labels; blank values parse to an empty JavaScript array. |
| `source_url` | URL | ResumeAI company guide at `/ats-checker/{slug}`. |

The JavaScript `Company` mapping is documented in [README.md](./README.md). Discuss column additions, removals, renames, or reordering in an issue before implementation: downstream CSV readers may depend on the exact schema. Document removals and changed slugs so consumers can migrate.

## Package and documentation changes

Keep the published package free of runtime dependencies. Helpers should remain small and typed, with documentation and tests for meaningful behavior. Preserve loading of the package's bundled CSV in both ESM and CommonJS from any working directory. Do not add a caller-local CSV override.

Statistics in the README are generated from the bundled CSV. Edit neither the values inside the dataset-stats marker block nor the source data just to make an expected statistic pass.

## Workflow

1. Fork the repository and create a feature branch.
2. Make the change and document its evidence or consumer impact.
3. Run `npm install`, `npm run stats`, `npm run stats:check`, `npm run build`, and `npm test`.
4. Run `node examples/quickstart.mjs`. For Python example changes, install pandas and run `python examples/python.py`.
5. Open a PR with the change and validation results. CI currently covers Node.js 18, 20, and 22.

Be kind and keep disagreements focused on evidence. Contributions are distributed under the repository's [MIT License](./LICENSE).
