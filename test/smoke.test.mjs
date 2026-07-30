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

test("loads 743 companies", () => {
  assert.equal(companies.length, 743);
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

test("707 employers are portal-verified", () => {
  assert.equal(verifiedCompanies.length, 707);
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

test("Workday is the #1 ATS in the verified subset (~39%, not a majority)", () => {
  const dist = atsDistribution(); // verified-only by default
  const share = atsShare();
  assert.equal(dist.Workday, 269);
  assert.ok(
    share.Workday > 38 && share.Workday < 44,
    `unexpected Workday share ${share.Workday}`
  );
  // Sanity: the verified market is fragmented, not a triopoly.
  const top3 = Object.values(dist).slice(0, 3).reduce((a, b) => a + b, 0);
  assert.ok(top3 / verifiedCompanies.length < 0.75, "top-3 should be < 75%");
});

test("Greenhouse is the #2 ATS in the verified subset", () => {
  const dist = atsDistribution();
  assert.equal(dist.Greenhouse, 89);
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
