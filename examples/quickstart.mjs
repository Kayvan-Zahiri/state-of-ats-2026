// Quickstart for @withresumeai/ats-data.
// Run after `npm install && npm run build`:
//     node examples/quickstart.mjs

import {
  companies,
  getATSForCompany,
  getCompaniesByATS,
  atsDistribution,
  atsShare,
} from "../dist/index.js";

console.log(`Loaded ${companies.length} companies.\n`);

const apple = getATSForCompany("apple");
console.log("Apple →", apple);

const wd = getCompaniesByATS("Workday");
console.log(`\nWorkday powers ${wd.length} of the ${companies.length} employers.`);
console.log("Sample Workday employers:", wd.slice(0, 5).map((c) => c.name));

console.log("\nATS distribution (top 5):");
const dist = atsDistribution();
const share = atsShare();
Object.entries(dist).slice(0, 5).forEach(([ats, n]) => {
  console.log(`  ${ats.padEnd(28)} ${String(n).padStart(4)}  (${share[ats]}%)`);
});
