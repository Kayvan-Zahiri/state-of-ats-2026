/**
 * @withresumeai/ats-data
 *
 * 738 Fortune-500 / Global-2000 / late-stage-private employers and the
 * Applicant Tracking System (ATS) attributed to each one's public careers
 * portal in this snapshot.
 *
 * Published as part of the ResumeAI State of ATS 2026 report:
 *   https://withresumeai.com/reports/state-of-ats-2026
 */

import type { Company, ATSInfo } from "./types.js";
import { loadCompanies } from "./companies.js";

export type { Company, ATSInfo, ATSSystem, HiringVolumeTier } from "./types.js";

/** All 738 companies in the dataset (verified + unverified). */
export const companies: Company[] = loadCompanies();

/**
 * Rows marked verified in the source dataset (704 of 738). This flag does not
 * guarantee a published apply host or observation date; inspect each row's
 * optional evidence fields for provenance.
 */
export const verifiedCompanies: Company[] = companies.filter((c) => c.verified);

/** Case-insensitive lookup by slug OR name. Returns null if no match. */
export function getATSForCompany(slugOrName: string): ATSInfo | null {
  if (!slugOrName) return null;
  const needle = slugOrName.trim().toLowerCase();
  const hit = companies.find(
    (c) => c.slug.toLowerCase() === needle || c.name.toLowerCase() === needle
  );
  if (!hit) return null;
  return {
    company: hit.name,
    slug: hit.slug,
    atsSystem: hit.atsSystem,
    industry: hit.industry,
    sourceUrl: hit.sourceUrl,
  };
}

/** All companies whose `atsSystem` matches `atsSystem` (case-insensitive). */
export function getCompaniesByATS(atsSystem: string): Company[] {
  const needle = atsSystem.trim().toLowerCase();
  return companies.filter((c) => c.atsSystem.toLowerCase() === needle);
}

/** All companies whose `industry` matches `industry` (case-insensitive). */
export function getCompaniesByIndustry(industry: string): Company[] {
  const needle = industry.trim().toLowerCase();
  return companies.filter((c) => c.industry.toLowerCase() === needle);
}

/**
 * Returns the absolute count of companies per ATS vendor, sorted descending.
 *
 * Counts the rows marked verified by default.
 * Pass `{ all: true }` to count all 738 rows including unconfirmed estimates.
 */
export function atsDistribution(opts: { all?: boolean } = {}): Record<string, number> {
  const rows = opts.all ? companies : verifiedCompanies;
  const counts = new Map<string, number>();
  for (const c of rows) {
    counts.set(c.atsSystem, (counts.get(c.atsSystem) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const out: Record<string, number> = {};
  for (const [ats, n] of sorted) out[ats] = n;
  return out;
}

/**
 * Convenience: ATS share as a percentage, sorted descending. Computed over the
 * rows marked verified by default. Pass `{ all: true }` for all 738 rows.
 */
export function atsShare(opts: { all?: boolean } = {}): Record<string, number> {
  const dist = atsDistribution(opts);
  const total = (opts.all ? companies : verifiedCompanies).length;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(dist)) {
    out[k] = Math.round((v / total) * 10000) / 100;
  }
  return out;
}
