"""Quickstart for the repository CSV. Requires pandas.

    pip install pandas
    python examples/python.py

The file path is resolved relative to this script, so the example also works
when launched from another working directory.
"""
from pathlib import Path

import pandas as pd

csv_path = Path(__file__).resolve().parents[1] / "data" / "companies.csv"
df = pd.read_csv(csv_path, keep_default_na=False)
verified = df.loc[df["verified"]]
recorded_hosts = df.loc[df["apply_host"].ne("")]

print(f"Loaded {len(df)} rows in the selected employer sample.")
print(f"Marked verified: {len(verified)}; published apply host: {len(recorded_hosts)}.")
print("These subsets differ; inspect evidence methods and per-row dates.")

# Counts and shares are within the selected rows marked verified.
distribution = verified["ats_system"].value_counts()
share = (distribution / len(verified) * 100).round(2).rename("sample_pct")
print("\nATS attributions within the selected sample marked verified:")
print(pd.concat([distribution.rename("rows"), share], axis=1).head(8).to_string())

apple = df.loc[df["slug"].eq("apple")].iloc[0]
print(f"\nRecorded Apple attribution: {apple['ats_system']}")
print(f"Host: {apple['apply_host'] or 'not published'}; date: {apple['checked_at'] or 'not published'}")

workday = verified.loc[verified["ats_system"].eq("Workday")]
print(f"\nRows marked verified with a Workday attribution: {len(workday)}.")
print("Examples:", ", ".join(workday["name"].head(8).tolist()))
