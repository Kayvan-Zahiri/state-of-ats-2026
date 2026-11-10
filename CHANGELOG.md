# Changelog

## 2.2.0 (2026-11-09)

Re-verification of all 738 employers with live HTTP probes on 2026-11-09, from one machine, at about one request per second per vendor host, with a custom user agent identifying ResumeAI. The evidence rules are the October 2026 rules plus one recovery method: for rows still unresolved, the employer's careers page was found on its own domain and a vendor tenant linked from that page was proven with the vendor's job API (live postings) or a tenant page load. `verified=true` requires live hard evidence on 2026-11-09. Rows that missed that bar are labeled **not re-verified in Nov 2026**. Their recorded vendor, apply host, evidence method, and `checked_at` stay as historical attribution. They were not relabeled as wrong, and they are excluded from headline percentages. Review-flag rows are under review: not counted and not changed. Shares below describe the re-verified subset only. That subset over-represents vendors with public job APIs (Workday, Greenhouse, Oracle, and iCIMS tenant hosts) and under-represents SuccessFactors, Avature, and BrassRing, which mostly sit on shared hosts.

Headline base: **421** rows marked `verified=true` after the 2026-10-09 pass, **436** after this pass (434 confirmed, 2 changed, 302 not re-verified in Nov 2026). 22 rows that were not re-verified in October were proven live, and 7 October-verified rows could not be re-proven: 421 + 22 − 7 = 436. Per-row evidence URLs are in `data/verification-2026-11.csv`; the October audit stays in `data/verification-2026-10.csv`.

### Changed vendors

- Lockheed Martin: Kenexa BrassRing -> Eightfold (https://lockheedmartin.eightfold.ai/careers). The Eightfold tenant is linked from the employer careers page (https://www.lockheedmartin.com/en-us/careers/index.html) and loads with HTTP 200.
- Kayak: Greenhouse -> Ashby (https://jobs.ashbyhq.com/kayak). The Ashby posting API lists 48 jobs on the "KAYAK Jobs" board; no matching Greenhouse board was found.

### Newly re-verified (22)

Not re-verified in October, proven live on 2026-11-09.

- Microsoft (Eightfold): https://apply.careers.microsoft.com/careers — Careers-portal fetch (vendor signature in URL/HTML)
- Nike (Workday): https://nike.wd1.myworkdayjobs.com/nke2 — Careers-portal fetch (vendor tenant linked from employer careers page)
- Slack (Workday): https://salesforce.wd12.myworkdayjobs.com/Slack — Careers-portal fetch (vendor tenant linked from employer careers page)
- UnitedHealth Group (Taleo): https://uhg.taleo.net/smartorg/smartorg/common/toc.jsf?lang=en — Careers-portal fetch (vendor tenant linked from employer careers page)
- Lockheed Martin (Eightfold): https://lockheedmartin.eightfold.ai/careers — Careers-portal fetch (vendor tenant linked from employer careers page)
- Edward Jones (Kenexa BrassRing): https://careers.edwardjones.com/ — Careers-portal fetch (vendor signature in URL/HTML)
- Chubb (Oracle Cloud HCM): https://fa-ewgu-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2001 — Oracle Recruiting CE API (live jobs)
- Aflac (SuccessFactors): https://careers.aflac.com/ — Careers-portal fetch (vendor signature in URL/HTML)
- Lincoln Financial (SuccessFactors): https://jobs.lincolnfinancial.com/ — Careers-portal fetch (vendor signature in URL/HTML)
- Palo Alto Networks (Workday): https://paloaltonetworks.wd5.myworkdayjobs.com/panwexternalcareers — Careers-portal fetch (vendor tenant linked from employer careers page)
- MariaDB (Greenhouse): https://job-boards.greenhouse.io/mariadbplc — Greenhouse board API (name match, live jobs)
- PayPal (Eightfold): https://paypal.eightfold.ai/careers — Careers-portal fetch (vendor tenant linked from employer careers page)
- Walgreens (Kenexa BrassRing): https://sjobs.brassring.com/TGnewUI/Search/Home/Home?partnerid=26336&siteid=5014 — Careers-portal fetch (vendor tenant linked from employer careers page)
- Northwell Health (Oracle Cloud HCM): https://eppr.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2 — Oracle Recruiting CE API (live jobs)
- Boston Scientific (Eightfold): https://bostonscientific.eightfold.ai/careers — Careers-portal fetch (vendor tenant linked from employer careers page)
- Biogen (Workday): https://biibhr.wd3.myworkdayjobs.com/external — Careers-portal fetch (vendor tenant linked from employer careers page)
- Quest Diagnostics (Oracle Cloud HCM): https://hdox.fa.us6.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1 — Oracle Recruiting CE API (live jobs)
- L.E.K. Consulting (Oleeo): https://www.lek.com/careers — Careers-portal fetch (vendor signature in URL/HTML)
- Wipro (SuccessFactors): https://careers.wipro.com/ — Careers-portal fetch (vendor signature in URL/HTML)
- eBay (Workday): https://ebay.wd5.myworkdayjobs.com/TCGPlayer_External_Career — Careers-portal fetch
- John Deere (Eightfold): https://careers.deere.com/careers — Careers-portal fetch (vendor signature in URL/HTML)
- Deere & Company (Eightfold): https://careers.deere.com/careers — Careers-portal fetch (vendor signature in URL/HTML)

### Not re-proven on 2026-11-09 (7)

Verified in October. Now `verified=false` with the recorded vendor, host, method, and `checked_at` (2026-10-09) kept. These rows are not relabeled.

- Ally Financial (recorded Avature)
- Confluent (recorded Ashby)
- Infosys (recorded Internal ATS)
- BAE Systems (recorded Kenexa BrassRing)
- ConocoPhillips (recorded Workday)
- Opendoor (recorded Rippling)
- Whiting-Turner (recorded SilkRoad)

### Under review

Evidence was found and was not applied. The recorded vendor is unchanged, and the row is not in the verified base.

- LinkedIn (recorded Internal ATS): own-domain page is not a careers portal
- ByteDance (recorded Internal ATS): live SmartRecruiters board found (https://jobs.smartrecruiters.com/bytedance)
- Charles Schwab (recorded iCIMS): live Greenhouse board found (https://job-boards.greenhouse.io/charles)
- BNY (recorded Oracle Cloud HCM): weak signature (1 HTML hit)
- Snowflake AI (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/snowflake)
- Hugging Face (recorded Workable): shared vendor root host, no employer tenant
- Glean (recorded Greenhouse): live SmartRecruiters board found (https://jobs.smartrecruiters.com/glean)
- Klarna (recorded Deel): shared vendor root host, no employer tenant
- Johns Hopkins (recorded SuccessFactors): weak signature (1 HTML hit)
- Sutter Health (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/sutterhealth)
- Cencora (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/cencora)
- Oliver Wyman (recorded Workday): live Greenhouse board found (https://job-boards.greenhouse.io/oliver)
- Wayfair (recorded Greenhouse): live SmartRecruiters board found (https://jobs.smartrecruiters.com/wayfair)
- Alibaba (recorded Internal ATS): own-domain page is not a careers portal
- AB InBev (recorded SmartRecruiters): live Greenhouse board found (https://job-boards.greenhouse.io/abinbev)
- Parker Hannifin (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/parker)
- Hearst (recorded Oracle Cloud HCM): live Greenhouse board found (https://job-boards.greenhouse.io/hearst)
- Universal Music Group (recorded Workday): live Greenhouse board found (https://job-boards.greenhouse.io/universal)
- Norwegian Cruise Line (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/norwegiancruiseline)
- Olive Garden (recorded Paradox): weak signature (1 HTML hit)
- Lufthansa (recorded BeeSite): weak signature (1 HTML hit)
- Air France-KLM (recorded Cegid Talentsoft): weak signature (1 HTML hit)
- Turner Construction (recorded Cornerstone OnDemand): live SmartRecruiters board found (https://jobs.smartrecruiters.com/turnerconstruction)
- Whiting-Turner (recorded SilkRoad): weak signature (1 HTML hit)
- WME Group (recorded Workday): weak signature (1 HTML hit)
- TikTok (recorded Internal ATS): own-domain page is not a careers portal
- Charles River Laboratories (recorded SuccessFactors): live Greenhouse board found (https://job-boards.greenhouse.io/charles)
- Applied Materials (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/applied)
- LG Electronics (recorded Workday): live Greenhouse board found (https://job-boards.greenhouse.io/lgelectronics)
- Pure Storage (recorded Greenhouse): live Ashby board found (https://jobs.ashbyhq.com/pure)

### Not re-verified in Nov 2026, by reason

- 158: no recorded careers host; vendor not provable by API/tenant probes
- 40: no name-matched vendor board found
- 34: portal loaded but no vendor signature
- 31: shared vendor host (e.g. careerN.successfactors.com, sjobs.brassring.com) without employer tenant id
- 10: portal redirected to an employee login/SSO page
- 10: Workday tenant exposed no public career site
- 5: HTTP 4xx / bot challenge
- 5: old Workday tenant unreachable
- 5: Workday tenant live but 0 public postings
- 2: HTTP 202 bot challenge
- 2: fetch error/timeout

### Vendor share, Oct 2026 vs Nov 2026 (re-verified subsets)

| Vendor | Oct n | Oct share | Nov n | Nov share |
| --- | ---: | ---: | ---: | ---: |
| Workday | 203 | 48.2% | 207 | 47.5% |
| Greenhouse | 65 | 15.4% | 65 | 14.9% |
| Oracle Cloud HCM | 30 | 7.1% | 33 | 7.6% |
| iCIMS | 30 | 7.1% | 30 | 6.9% |
| Eightfold | 17 | 4.0% | 23 | 5.3% |
| Ashby | 14 | 3.3% | 14 | 3.2% |
| Avature | 14 | 3.3% | 13 | 3.0% |
| SmartRecruiters | 11 | 2.6% | 11 | 2.5% |
| Taleo | 8 | 1.9% | 9 | 2.1% |
| SuccessFactors | 6 | 1.4% | 9 | 2.1% |
| USAJobs | 6 | 1.4% | 6 | 1.4% |
| Internal ATS | 6 | 1.4% | 5 | 1.1% |
| Lever | 3 | 0.7% | 3 | 0.7% |
| Phenom People | 2 | 0.5% | 2 | 0.5% |
| Kenexa BrassRing | 1 | 0.2% | 2 | 0.5% |
| Jobvite | 1 | 0.2% | 1 | 0.2% |
| Paradox | 1 | 0.2% | 1 | 0.2% |
| BeeSite | 1 | 0.2% | 1 | 0.2% |
| Oleeo | 0 | 0.0% | 1 | 0.2% |
| SilkRoad | 1 | 0.2% | 0 | 0.0% |
| Rippling | 1 | 0.2% | 0 | 0.0% |

Canonical CSV SHA-256: `ca7ff9860d09ea40419986ddfd1fa95776fc124846be917b26d099f0641a9c30`.

## 2.1.0 (2026-10-09)

Re-verification of all 738 employers with live HTTP probes on 2026-10-09, from one machine, at about one request per second per vendor host, with a custom user agent identifying ResumeAI. Version 2.0.0 copied the prior export. This release checks employers again. `verified=true` requires live hard evidence on that date: a tenant job API with live postings (Workday CXS, Greenhouse board, Lever or Ashby postings, SmartRecruiters postings, or Oracle Recruiting CE), a recorded careers host that loads with the vendor in the redirect chain or at least two HTML references, or an employer-run careers page with no third-party ATS signature for Internal ATS. Rows that missed that bar are labeled **not re-verified in Oct 2026**. Their recorded vendor, apply host, evidence method, and `checked_at` stay as historical attribution. They were not relabeled as wrong, and they are excluded from headline percentages. Review-flag rows are under review: not counted and not changed. Shares below describe the re-verified subset only. That subset over-represents vendors with public job APIs (Workday, Greenhouse, Oracle, and iCIMS tenant hosts) and under-represents SuccessFactors, Avature, and BrassRing, which mostly sit on shared hosts.

Headline base: **704** rows marked `verified=true` before this pass, **421** after (420 confirmed, 1 changed, 317 not re-verified in Oct 2026). The verified count moved because 284 previously verified rows did not meet the evidence rules and one previously unverified row (Orange) was confirmed: 704 − 284 + 1 = 421. The 317 rows labeled not re-verified in Oct 2026 are those 284 plus 33 rows that were already unverified. Per-row evidence URLs are in `data/verification-2026-10.csv`.

### Changed vendors

- Rocket Lab: Workday -> Greenhouse (https://job-boards.greenhouse.io/rocketlab). The old Workday tenant returns 401. The Greenhouse board "Rocket Lab Corporation" lists 575 jobs.

### Under review

Evidence was found and was not applied. The recorded vendor is unchanged, and the row is not in the verified base.

- Microsoft (recorded Eightfold): weak signature (1 HTML hit)
- LinkedIn (recorded Internal ATS): own-domain page is not a careers portal
- ByteDance (recorded Internal ATS): live SmartRecruiters board found (https://jobs.smartrecruiters.com/bytedance)
- Charles Schwab (recorded iCIMS): live Greenhouse board found (https://job-boards.greenhouse.io/charles)
- BNY (recorded Oracle Cloud HCM): weak signature (1 HTML hit)
- Snowflake AI (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/snowflake)
- Hugging Face (recorded Workable): shared vendor root host, no employer tenant
- Glean (recorded Greenhouse): live SmartRecruiters board found (https://jobs.smartrecruiters.com/glean)
- Klarna (recorded Deel): shared vendor root host, no employer tenant
- Sutter Health (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/sutterhealth)
- Cencora (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/cencora)
- Oliver Wyman (recorded Workday): live Lever board found (https://jobs.lever.co/oliverwyman)
- Wayfair (recorded Greenhouse): live SmartRecruiters board found (https://jobs.smartrecruiters.com/wayfair)
- Alibaba (recorded Internal ATS): own-domain page is not a careers portal
- AB InBev (recorded SmartRecruiters): live Greenhouse board found (https://job-boards.greenhouse.io/abinbev)
- John Deere (recorded Eightfold): weak signature (1 HTML hit)
- Deere & Company (recorded Eightfold): weak signature (1 HTML hit)
- Parker Hannifin (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/parker)
- Hearst (recorded Oracle Cloud HCM): live Greenhouse board found (https://job-boards.greenhouse.io/hearst)
- Universal Music Group (recorded Workday): live Greenhouse board found (https://job-boards.greenhouse.io/universal)
- Norwegian Cruise Line (recorded Workday): live SmartRecruiters board found (https://jobs.smartrecruiters.com/norwegiancruiseline)
- Olive Garden (recorded Paradox): weak signature (1 HTML hit)
- Lufthansa (recorded BeeSite): weak signature (1 HTML hit)
- Air France-KLM (recorded Cegid Talentsoft): weak signature (1 HTML hit)
- Turner Construction (recorded Cornerstone OnDemand): live SmartRecruiters board found (https://jobs.smartrecruiters.com/turnerconstruction)
- WME Group (recorded Workday): weak signature (1 HTML hit)
- TikTok (recorded Internal ATS): own-domain page is not a careers portal
- Charles River Laboratories (recorded SuccessFactors): live Greenhouse board found (https://job-boards.greenhouse.io/charles)
- Applied Materials (recorded Workday): live Ashby board found (https://jobs.ashbyhq.com/applied)
- LG Electronics (recorded Workday): live Greenhouse board found (https://job-boards.greenhouse.io/lgelectronics)
- Pure Storage (recorded Greenhouse): live Ashby board found (https://jobs.ashbyhq.com/pure)

### Not re-verified in Oct 2026, by reason

- 166: no recorded careers host; vendor not provable by API or tenant probes
- 40: no name-matched vendor board found
- 37: shared vendor host (for example `careerN.successfactors.com` or `sjobs.brassring.com`) without an employer tenant id
- 34: portal loaded but no vendor signature
- 12: Workday tenant exposed no public career site
- 11: portal redirected to an employee login or SSO page
- 5: old Workday tenant unreachable
- 5: Workday tenant live but 0 public postings
- 3: HTTP 4xx or bot challenge
- 2: HTTP 202 bot challenge
- 2: fetch error or timeout

### Vendor share, previous verified base vs re-verified subset

| Vendor | Old n | Old share | New n | New share |
| --- | ---: | ---: | ---: | ---: |
| Workday | 267 | 37.9% | 203 | 48.2% |
| Greenhouse | 88 | 12.5% | 65 | 15.4% |
| Oracle Cloud HCM | 49 | 7.0% | 30 | 7.1% |
| iCIMS | 39 | 5.5% | 30 | 7.1% |
| Eightfold | 24 | 3.4% | 17 | 4.0% |
| Avature | 26 | 3.7% | 14 | 3.3% |
| Ashby | 15 | 2.1% | 14 | 3.3% |
| SmartRecruiters | 19 | 2.7% | 11 | 2.6% |
| Taleo | 17 | 2.4% | 8 | 1.9% |
| SuccessFactors | 68 | 9.7% | 6 | 1.4% |
| Internal ATS | 30 | 4.3% | 6 | 1.4% |
| USAJobs | 10 | 1.4% | 6 | 1.4% |
| Lever | 5 | 0.7% | 3 | 0.7% |
| Phenom People | 5 | 0.7% | 2 | 0.5% |
| Kenexa BrassRing | 8 | 1.1% | 1 | 0.2% |
| Jobvite | 5 | 0.7% | 1 | 0.2% |
| BeeSite | 3 | 0.4% | 1 | 0.2% |
| Paradox | 3 | 0.4% | 1 | 0.2% |
| SilkRoad | 1 | 0.1% | 1 | 0.2% |
| Rippling | 1 | 0.1% | 1 | 0.2% |
| Cornerstone OnDemand | 4 | 0.6% | 0 | 0.0% |
| Oleeo | 2 | 0.3% | 0 | 0.0% |
| UKG Pro | 2 | 0.3% | 0 | 0.0% |
| Deel | 1 | 0.1% | 0 | 0.0% |
| Herp | 1 | 0.1% | 0 | 0.0% |
| gr8people | 1 | 0.1% | 0 | 0.0% |
| Dayforce | 1 | 0.1% | 0 | 0.0% |
| Cegid Talentsoft | 1 | 0.1% | 0 | 0.0% |
| Gupy | 1 | 0.1% | 0 | 0.0% |
| ADP | 1 | 0.1% | 0 | 0.0% |
| PeopleFluent | 1 | 0.1% | 0 | 0.0% |
| eArcu | 1 | 0.1% | 0 | 0.0% |
| Workable | 1 | 0.1% | 0 | 0.0% |
| Harri | 1 | 0.1% | 0 | 0.0% |
| Lumesse TalentLink | 1 | 0.1% | 0 | 0.0% |
| Teamwork Online | 1 | 0.1% | 0 | 0.0% |

Canonical CSV SHA-256: `cdee1d94c87aef496ade6ebc8adb8909a2774a572713daa0f73d6b25ce3752aa`.

## 2.0.0

This release aligns the npm package with the existing canonical 738-employer evidence snapshot. Publication is a distribution update, not a new verification of employer systems. The latest nonempty row observation date is 2026-08-13.

- **CSV compatibility:** the exported `data/companies.csv` changes from eight columns in npm 1.3.0 to 14. It adds `apply_host`, `evidence_method`, `checked_at`, `hq_country`, `hq_country_code`, and `hq_region`. `verified` moves to fifth position and `source_url` to last. Read columns by name and update expected schema and row counts. Pin `@withresumeai/ats-data@1.3.0` if the previous 743-row snapshot is required.
- Company objects expose the six evidence/geography fields as optional camelCase properties. Empty CSV fields remain unavailable; no evidence or observation date is inferred.
- ESM and CommonJS load this package's own bundled CSV independently of the process working directory. An unrelated `data/companies.csv` in a consumer project is never used as an override.
- Existing lookup function names and the narrow `getATSForCompany` result remain unchanged.
- README, examples, type comments and citation metadata describe the selected snapshot, mixed provenance and missing evidence. Generated README counts are checked before publishing.

Canonical CSV SHA-256: `acd8e98a1639e55b9123b48eb3eb48ed3aa70ead1921a7c6bcf916786e45d0e1`.
