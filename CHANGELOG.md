# Changelog

## 2.0.0

This release aligns the npm package with the existing canonical 738-employer evidence snapshot. Publication is a distribution update, not a new verification of employer systems. The latest nonempty row observation date is 2026-08-13.

- **CSV compatibility:** the exported `data/companies.csv` changes from eight columns in npm 1.3.0 to 14. It adds `apply_host`, `evidence_method`, `checked_at`, `hq_country`, `hq_country_code`, and `hq_region`. `verified` moves to fifth position and `source_url` to last. Read columns by name and update expected schema and row counts. Pin `@withresumeai/ats-data@1.3.0` if the previous 743-row snapshot is required.
- Company objects expose the six evidence/geography fields as optional camelCase properties. Empty CSV fields remain unavailable; no evidence or observation date is inferred.
- ESM and CommonJS load this package's own bundled CSV independently of the process working directory. An unrelated `data/companies.csv` in a consumer project is never used as an override.
- Existing lookup function names and the narrow `getATSForCompany` result remain unchanged.
- README, examples, type comments and citation metadata describe the selected snapshot, mixed provenance and missing evidence. Generated README counts are checked before publishing.

Canonical CSV SHA-256: `acd8e98a1639e55b9123b48eb3eb48ed3aa70ead1921a7c6bcf916786e45d0e1`.
