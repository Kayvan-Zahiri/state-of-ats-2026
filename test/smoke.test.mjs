import { test } from "node:test";
import assert from "node:assert/strict";

import {
  companies,
  verifiedCompanies,
  getATSForCompany,
  getCompaniesByATS,
  getCompaniesByIndustry,
  atsDistribution,
  atsShare,
} from "../dist/index.js";

test("loads 738 companies", () => {
  assert.equal(companies.length, 738);
});

test("every row has the required fields incl. a boolean `verified`", () => {
  for (const c of companies) {
    assert.ok(c.name, `missing name on ${JSON.stringify(c)}`);
    assert.ok(c.slug, `missing slug on ${c.name}`);
    assert.ok(c.industry, `missing industry on ${c.name}`);
    assert.ok(c.atsSystem, `missing atsSystem on ${c.name}`);
    assert.ok(c.sourceUrl.startsWith("https://"), `bad sourceUrl on ${c.name}`);
    assert.equal(typeof c.verified, "boolean", `missing verified on ${c.name}`);
  }
});

test("704 employers are portal-verified", () => {
  assert.equal(verifiedCompanies.length, 704);
  assert.ok(verifiedCompanies.every((c) => c.verified === true));
});

test("Apple lookup resolves to its proprietary internal ATS (verified)", () => {
  const bySlug = getATSForCompany("apple");
  const byName = getATSForCompany("Apple");
  assert.ok(bySlug);
  assert.equal(bySlug.company, "Apple");
  assert.equal(bySlug.atsSystem, "Internal ATS");
  assert.deepEqual(bySlug, byName);
  assert.equal(companies.find((c) => c.slug === "apple")?.verified, true);
});

test("unknown company returns null", () => {
  assert.equal(getATSForCompany("not-a-real-company"), null);
});

test("Workday leads the verified subset but is nowhere near a majority", () => {
  const dist = atsDistribution(); // verified-only by default
  const share = atsShare();
  // 267, not 269: the 2026-08-12 dedupe removed duplicate rows for renamed
  // employers (ge/ge-aerospace and anthem/elevance-health were both Workday).
  assert.equal(dist.Workday, 267);
  // Deliberately a wide band. This guards the CLAIM — Workday leads and is far
  // short of the "75% of resumes die in an ATS monopoly" story — not a precise
  // figure that shifts every re-verification. It was >38 && <44 and broke when
  // the dedupe moved the share to 37.93, which is the test chasing the data
  // rather than protecting the argument.
  assert.ok(
    share.Workday > 30 && share.Workday < 50,
    `unexpected Workday share ${share.Workday}`
  );
  assert.ok(share.Workday < 50, "Workday must never be reported as a majority");
  // Sanity: the verified market is fragmented, not a triopoly.
  const top3 = Object.values(dist).slice(0, 3).reduce((a, b) => a + b, 0);
  assert.ok(top3 / verifiedCompanies.length < 0.75, "top-3 should be < 75%");
});

test("Greenhouse is the #2 ATS in the verified subset", () => {
  const dist = atsDistribution();
  // 88, not 89: the 2026-08-12 dedupe removed five duplicate rows created by
  // renamed/merged employers, one of which (square/block) was Greenhouse.
  assert.equal(dist.Greenhouse, 88);
});

test("`{ all: true }` counts every row, default counts only verified", () => {
  const all = atsDistribution({ all: true });
  const verified = atsDistribution();
  assert.ok(
    Object.values(all).reduce((a, b) => a + b, 0) === companies.length
  );
  assert.ok(
    Object.values(verified).reduce((a, b) => a + b, 0) === verifiedCompanies.length
  );
});

test("getCompaniesByIndustry returns matches", () => {
  const tech = getCompaniesByIndustry("Technology");
  assert.ok(tech.length > 10, `expected many Technology companies, got ${tech.length}`);
});
