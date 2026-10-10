/**
 * Type definitions for the State of ATS 2026 dataset.
 *
 * The dataset covers 738 large employers (Fortune 500, Global 2000, and a
 * curated set of late-stage private companies) and the Applicant Tracking
 * System attributed to each one's public careers portal in this snapshot.
 */

/**
 * The named ATS systems observed in the dataset.
 *
 * `"Internal ATS"` is an umbrella for proprietary systems we could not
 * attribute to a named vendor. Re-verified examples on 2026-10-09 include
 * Amazon and Apple.
 */
export type ATSSystem =
  | "Workday"
  | "Greenhouse"
  | "Taleo"
  | "Lever"
  | "USAJobs"
  | "Oracle Cloud HCM"
  | "Oracle HCM (Taleo)"
  | "SuccessFactors"
  | "iCIMS"
  | "Eightfold"
  | "Avature"
  | "SmartRecruiters"
  | "Ashby"
  | "Jobvite"
  | "Internal ATS"
  | "Internal (Google proprietary)"
  | "Internal (Microsoft Careers)"
  | (string & {}); // allow any additional vendors in future data

/** Coarse hiring-volume tier used for cross-tabs in the report. */
export type HiringVolumeTier = "mega" | "high" | "mid";

/** One row of the dataset. */
export interface Company {
  /** Human-readable company name (e.g. "Apple"). */
  name: string;
  /** URL-safe slug (e.g. "apple"). Maps to /ats-checker/[slug] on withresumeai.com. */
  slug: string;
  /** Industry label (e.g. "Technology", "Investment Banking"). */
  industry: string;
  /** ATS vendor attributed to this company's public careers portal. */
  atsSystem: ATSSystem;
  /**
   * `true` when this row was re-verified with live evidence on 2026-10-09.
   * `false` means the row is labeled not re-verified in Oct 2026: the recorded
   * vendor, host, method, and date stay as historical attribution. That flag
   * is not a judgment that the recorded vendor was wrong.
   */
  verified: boolean;
  /** Recorded apply host, when the source publishes one. */
  applyHost?: string;
  /** Method used to collect the published evidence, when available. */
  evidenceMethod?: string;
  /** Per-row observation date (YYYY-MM-DD), when published; not release time. */
  checkedAt?: string;
  /** Headquarters country label, when available. */
  hqCountry?: string;
  /** Headquarters country code, when available. */
  hqCountryCode?: string;
  /** Headquarters region label, when available. */
  hqRegion?: string;
  /** mega = 100k+ employees; high = Fortune 500 / major hirer; mid = mid-cap. */
  hiringVolumeTier?: HiringVolumeTier;
  /** Up to 3 dominant hiring roles (slug form, e.g. "software-engineer"). */
  topRoles?: string[];
  /** Canonical /ats-checker source URL on withresumeai.com. */
  sourceUrl: string;
}

/** Lightweight lookup result returned by `getATSForCompany`. */
export interface ATSInfo {
  company: string;
  slug: string;
  atsSystem: ATSSystem;
  industry: string;
  sourceUrl: string;
}
