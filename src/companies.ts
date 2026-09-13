/**
 * Loads the company dataset from the bundled CSV at data/companies.csv.
 *
 * The CSV is the canonical source of truth. We parse it once at module
 * import time and cache the result so consumers pay the cost only once.
 *
 * We deliberately avoid pulling in a CSV-parser dependency. The bundled
 * file has one record per line, with double-quoted fields and escaped
 * inner quotes where needed.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Company, ATSSystem, HiringVolumeTier } from "./types.js";

/** Parses a single-line CSV record from the bundled dataset. */
function parseCsvRow(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}

function isTier(v: string): v is HiringVolumeTier {
  return v === "mega" || v === "high" || v === "mid";
}

let cached: Company[] | null = null;

/** Loads + parses the CSV once. */
export function loadCompanies(): Company[] {
  if (cached) return cached;

  // tsup supplies __dirname from import.meta.url in the ESM build.
  // Anchor to this module so a consumer's working directory cannot select data.
  const raw = readFileSync(resolve(__dirname, "../data/companies.csv"), "utf8");
  const lines = raw.split(/\r?\n/);

  // Skip leading "# ..." metadata comments + blank lines.
  let headerIdx = 0;
  while (
    headerIdx < lines.length &&
    (lines[headerIdx].startsWith("#") || lines[headerIdx].trim() === "")
  ) {
    headerIdx++;
  }

  const header = parseCsvRow(lines[headerIdx]);
  const col = (name: string) => header.indexOf(name);

  const iName = col("name");
  const iSlug = col("slug");
  const iIndustry = col("industry");
  const iAts = col("ats_system");
  const iTier = col("hiring_volume_tier");
  const iRoles = col("top_roles");
  const iSrc = col("source_url");
  const iVerified = col("verified");
  const iApplyHost = col("apply_host");
  const iEvidenceMethod = col("evidence_method");
  const iCheckedAt = col("checked_at");
  const iHqCountry = col("hq_country");
  const iHqCountryCode = col("hq_country_code");
  const iHqRegion = col("hq_region");

  const rows: Company[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === "") continue;
    const cells = parseCsvRow(line);
    if (cells.length < header.length) continue;

    const tier = cells[iTier];
    const rolesRaw = cells[iRoles];

    rows.push({
      name: cells[iName],
      slug: cells[iSlug],
      industry: cells[iIndustry],
      atsSystem: cells[iAts] as ATSSystem,
      // verified column added 2026-06-15. Default older/missing values to false
      // so a consumer never mistakes an unconfirmed row for a verified one.
      verified: iVerified >= 0 ? cells[iVerified] === "true" : false,
      applyHost: cells[iApplyHost] || undefined,
      evidenceMethod: cells[iEvidenceMethod] || undefined,
      checkedAt: cells[iCheckedAt] || undefined,
      hqCountry: cells[iHqCountry] || undefined,
      hqCountryCode: cells[iHqCountryCode] || undefined,
      hqRegion: cells[iHqRegion] || undefined,
      hiringVolumeTier: isTier(tier) ? tier : undefined,
      topRoles: rolesRaw ? rolesRaw.split("|").filter(Boolean) : [],
      sourceUrl: cells[iSrc],
    });
  }

  cached = rows;
  return rows;
}
