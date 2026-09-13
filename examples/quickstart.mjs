// Quickstart for the built repository package.
// Run after `npm install && npm run build`:
//     node examples/quickstart.mjs

import {
  companies,
  verifiedCompanies,
  getATSForCompany,
  getCompaniesByATS,
  atsDistribution,
  atsShare,
} from "../dist/index.js";

const recordedHosts = companies.filter((company) => company.applyHost);
console.log(`Loaded ${companies.length} rows in the selected employer sample.`);
console.log(`Marked verified: ${verifiedCompanies.length}; published apply host: ${recordedHosts.length}.`);
console.log("These subsets differ; inspect evidence methods and per-row dates.");

console.log("\nRecorded Apple attribution:", getATSForCompany("apple"));
const apple = companies.find((company) => company.slug === "apple");
console.log("Published evidence:", {
  applyHost: apple?.applyHost,
  evidenceMethod: apple?.evidenceMethod,
  checkedAt: apple?.checkedAt,
});

const workday = getCompaniesByATS("Workday").filter((company) => company.verified);
console.log(`\nRows marked verified with a Workday attribution: ${workday.length}.`);
console.log("Examples:", workday.slice(0, 5).map((company) => company.name));

console.log("\nATS attributions within the selected sample marked verified (top 5):");
const distribution = atsDistribution();
const share = atsShare();
for (const [ats, count] of Object.entries(distribution).slice(0, 5)) {
  console.log(`  ${ats.padEnd(28)} ${String(count).padStart(4)}  (${share[ats]}% of this subset)`);
}
