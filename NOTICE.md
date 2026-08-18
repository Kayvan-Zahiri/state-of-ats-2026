# Attribution

The LICENSE file is the unmodified MIT text, deliberately. It used to carry an
attribution paragraph and the word "Software" swapped for "Materials", which
read as friendlier but had a cost: GitHub's licence detector fell below its
match threshold and reported `NOASSERTION`, so every aggregator, dataset index
and model that reads the licence API saw "unknown licence" on a dataset whose
entire pitch is that it is MIT and free. The request below is what that
paragraph was for.

**The licence asks nothing of you.** Use, copy, modify, redistribute, sell —
including commercially, including without credit.

**What is appreciated, not required:** if you republish statistics from this
dataset in journalism or research, cite it as

> ResumeAI, *State of ATS 2026*. https://withresumeai.com/reports/state-of-ats-2026

Machine-readable citation metadata is in [`CITATION.cff`](CITATION.cff), and
GitHub renders it under "Cite this repository" in the sidebar.

**One thing worth knowing before you cite a number.** Provenance in this
dataset is mixed and stated per row in `evidence_method`. 551 of 738 rows
publish an `apply_host` you can open in a browser to check the row yourself;
187 carry no evidence artifact at all, and 156 of those are still flagged
`verified` on the strength of the June 2026 audit. That is the softest part of
the data. Filter on `apply_host` rather than on `verified` for anything
load-bearing.
