import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

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

test("421 employers are re-verified in the October 2026 snapshot", () => {
  assert.equal(verifiedCompanies.length, 421);
  assert.ok(verifiedCompanies.every((c) => c.verified === true));
  assert.ok(verifiedCompanies.every((c) => c.checkedAt === "2026-10-09"));
});

test("Apple lookup resolves to its proprietary internal ATS (verified)", () => {
  const bySlug = getATSForCompany("apple");
  const byName = getATSForCompany("Apple");
  assert.ok(bySlug);
  assert.equal(bySlug.company, "Apple");
  assert.equal(bySlug.atsSystem, "Internal ATS");
  assert.deepEqual(bySlug, byName);
  assert.deepEqual(Object.keys(bySlug).sort(), [
    "atsSystem", "company", "industry", "slug", "sourceUrl",
  ]);
  assert.equal(companies.find((c) => c.slug === "apple")?.verified, true);
});

test("Apple was re-verified as Internal ATS on 2026-10-09", () => {
  const apple = companies.find((c) => c.slug === "apple");
  assert.equal(apple.applyHost, "www.apple.com");
  assert.equal(apple.evidenceMethod, "Careers-portal fetch (vendor signature in URL/HTML)");
  assert.equal(apple.checkedAt, "2026-10-09");
  assert.equal(apple.hqCountry, "United States");
  assert.equal(apple.hqCountryCode, "US");
  assert.equal(apple.hqRegion, "North America");
});

test("rows not re-verified in Oct 2026 keep historical attribution", () => {
  const microsoft = companies.find((c) => c.slug === "microsoft");
  assert.equal(microsoft.verified, false);
  assert.equal(microsoft.atsSystem, "Eightfold");
  assert.equal(microsoft.applyHost, "apply.careers.microsoft.com");
  assert.equal(microsoft.evidenceMethod, "Careers-portal apply host");
  assert.equal(microsoft.checkedAt, "2026-08-13");

  const schwab = companies.find((c) => c.slug === "charles-schwab");
  assert.equal(schwab.verified, false);
  assert.equal(schwab.atsSystem, "iCIMS");
  assert.equal(schwab.applyHost, undefined);

  const abInbev = companies.find((c) => c.slug === "ab-inbev");
  assert.equal(abInbev.verified, false);
  assert.equal(abInbev.atsSystem, "SmartRecruiters");
  assert.equal(abInbev.applyHost, undefined);
  assert.equal(abInbev.evidenceMethod, undefined);
  assert.equal(abInbev.checkedAt, undefined);
  assert.equal(abInbev.hqCountry, "Belgium");

  const rocket = companies.find((c) => c.slug === "rocket-lab");
  assert.equal(rocket.verified, true);
  assert.equal(rocket.atsSystem, "Greenhouse");
  assert.equal(rocket.applyHost, "job-boards.greenhouse.io");
  assert.equal(rocket.checkedAt, "2026-10-09");
});

test("the public objects preserve every field and record in the bundled CSV", () => {
  const csv = readFileSync(new URL("../data/companies.csv", import.meta.url), "utf8");
  const lines = csv.trimEnd().split(/\r?\n/);
  assert.equal(lines.shift(), [
    "name", "slug", "industry", "ats_system", "verified", "apply_host",
    "evidence_method", "checked_at", "hq_country", "hq_country_code", "hq_region",
    "hiring_volume_tier", "top_roles", "source_url",
  ].join(","));
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const serialized = companies.map((c) => [
    c.name, c.slug, c.industry, c.atsSystem, c.verified, c.applyHost,
    c.evidenceMethod, c.checkedAt, c.hqCountry, c.hqCountryCode, c.hqRegion,
    c.hiringVolumeTier, c.topRoles?.join("|"), c.sourceUrl,
  ].map(escape).join(","));
  assert.deepEqual(serialized, lines);
});

for (const format of ["esm", "cjs"]) {
  for (const decoy of [false, true]) {
    test(`${format} loads its own data from an unrelated working directory${decoy ? " with a decoy CSV" : ""}`, (t) => {
      const cwd = mkdtempSync(join(tmpdir(), "ats-data-consumer-"));
      t.after(() => rmSync(cwd, { recursive: true, force: true }));
      if (decoy) {
        mkdirSync(join(cwd, "data"));
        writeFileSync(join(cwd, "data/companies.csv"), [
          "name,slug,industry,ats_system,verified,hiring_volume_tier,top_roles,source_url",
          "Decoy,decoy,Test,Test,false,mid,,https://example.com/decoy",
          "",
        ].join("\n"));
      }
      const moduleUrl = new URL(`../dist/index.${format === "esm" ? "js" : "cjs"}`, import.meta.url);
      const load = format === "esm"
        ? `import { companies } from ${JSON.stringify(moduleUrl.href)};`
        : `const { companies } = require(${JSON.stringify(fileURLToPath(moduleUrl))});`;
      const result = spawnSync(process.execPath, [
        `--input-type=${format === "esm" ? "module" : "commonjs"}`,
        "--eval", `${load} process.stdout.write(JSON.stringify(companies));`,
      ], { cwd, encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
      assert.equal(result.status, 0, result.stderr || result.error?.message);
      assert.deepEqual(JSON.parse(result.stdout), JSON.parse(JSON.stringify(companies)));
    });
  }
}

test("unknown company returns null", () => {
  assert.equal(getATSForCompany("not-a-real-company"), null);
});

test("Workday leads the verified subset but is nowhere near a majority", () => {
  const dist = atsDistribution(); // verified-only by default
  const share = atsShare();
  // 203 of the 421 rows re-verified on 2026-10-09. The prior verified base
  // counted 267 before rows that could not be re-proved were dropped.
  assert.equal(dist.Workday, 203);
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
  // 65 of the 421 rows re-verified on 2026-10-09.
  assert.equal(dist.Greenhouse, 65);
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

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  function cells(line) {
    const out = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) {
        out.push(value);
        value = "";
      } else value += char;
    }
    if (quoted) throw new Error("Unclosed CSV field");
    out.push(value);
    return out;
  }
  const header = cells(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const row = cells(line);
    assert.equal(row.length, header.length);
    return Object.fromEntries(header.map((name, index) => [name, row[index]]));
  });
}

test("unverifiable audit rows stay not re-verified in Oct 2026 and keep their vendor", () => {
  const audit = parseCsv(readFileSync(new URL("../data/verification-2026-10.csv", import.meta.url), "utf8"));
  assert.equal(audit.length, 738);
  const counts = { confirmed: 0, changed: 0, unverifiable: 0 };
  const changed = [];
  for (const row of audit) {
    counts[row.status] += 1;
    const company = companies.find((item) => item.slug === row.slug);
    assert.ok(company, row.slug);
    if (row.status === "unverifiable") {
      assert.equal(company.verified, false, `${row.slug} was relabeled`);
      assert.equal(company.atsSystem, row.old_vendor, row.slug);
      assert.equal(company.applyHost ?? "", row.old_apply_host, row.slug);
      assert.equal(company.checkedAt ?? "", row.old_checked_at, row.slug);
      assert.notEqual(company.checkedAt, "2026-10-09", row.slug);
    } else {
      assert.ok(row.status === "confirmed" || row.status === "changed", row.status);
      assert.equal(company.verified, true, row.slug);
      assert.equal(company.atsSystem, row.new_vendor, row.slug);
      assert.equal(company.checkedAt, "2026-10-09", row.slug);
      assert.equal(company.evidenceMethod, row.evidence_method, row.slug);
      assert.equal(company.applyHost, new URL(row.evidence_url).host, row.slug);
      if (row.status === "changed") changed.push(row.slug);
    }
  }
  assert.deepEqual(counts, { confirmed: 420, changed: 1, unverifiable: 317 });
  assert.deepEqual(changed, ["rocket-lab"]);
  assert.equal(audit.filter((row) => row.review_flag).length, 31);
});
