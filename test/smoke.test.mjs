import { test } from "node:test";
import assert from "node:assert/strict";

import {
  companies,
  getATSForCompany,
  getCompaniesByATS,
  getCompaniesByIndustry,
  atsDistribution,
  atsShare,
} from "../dist/index.js";

test("loads 743 companies", () => {
  assert.equal(companies.length, 743);
});

test("every row has the required fields", () => {
  for (const c of companies) {
    assert.ok(c.name, `missing name on ${JSON.stringify(c)}`);
    assert.ok(c.slug, `missing slug on ${c.name}`);
    assert.ok(c.industry, `missing industry on ${c.name}`);
    assert.ok(c.atsSystem, `missing atsSystem on ${c.name}`);
    assert.ok(c.sourceUrl.startsWith("https://"), `bad sourceUrl on ${c.name}`);
  }
});

test("Apple lookup by slug and by name", () => {
  const bySlug = getATSForCompany("apple");
  const byName = getATSForCompany("Apple");
  assert.ok(bySlug);
  assert.equal(bySlug.company, "Apple");
  assert.equal(bySlug.atsSystem, "Workday");
  assert.deepEqual(bySlug, byName);
});

test("unknown company returns null", () => {
  assert.equal(getATSForCompany("not-a-real-company"), null);
});

test("Workday is the #1 ATS at ~75% share", () => {
  const dist = atsDistribution();
  const share = atsShare();
  assert.equal(dist.Workday, 560);
  assert.equal(getCompaniesByATS("Workday").length, 560);
  assert.ok(share.Workday > 74 && share.Workday < 76, `unexpected Workday share ${share.Workday}`);
});

test("Greenhouse is the #2 ATS", () => {
  const dist = atsDistribution();
  assert.equal(dist.Greenhouse, 124);
});

test("getCompaniesByIndustry returns matches", () => {
  const tech = getCompaniesByIndustry("Technology");
  assert.ok(tech.length > 10, `expected many Technology companies, got ${tech.length}`);
});
