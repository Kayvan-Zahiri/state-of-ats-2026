/**
 * Type definitions for the State of ATS 2026 dataset.
 *
 * The dataset covers 738 large employers (Fortune 500, Global 2000, and a
 * curated set of late-stage private companies) and the Applicant Tracking
 * System each one uses on their public careers portal.
 */

/**
 * The named ATS systems observed in the dataset.
 *
 * `"Internal ATS"` is an umbrella for proprietary systems we could not
 * attribute to a named vendor (e.g. Amazon, Meta).
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
  /** ATS vendor used on this company's public careers portal as of 2026. */
  atsSystem: ATSSystem;
  /**
   * True when `atsSystem` was confirmed by inspecting the company's LIVE
   * careers-portal apply-URL host in the June 2026 verification audit. When
   * false, the attribution is an unconfirmed prior estimate — treat it as a
   * lead, not a fact, and prefer filtering to `verified === true` for analysis.
   */
  verified: boolean;
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
