"""
Quickstart for the State of ATS 2026 dataset in Python.

Requires: pandas. Run:
    pip install pandas
    python examples/python.py
"""
import pandas as pd

# The CSV ships with five `# ...` provenance lines before the header row.
df = pd.read_csv("data/companies.csv", comment="#")

print(f"Loaded {len(df)} companies.\n")

# ATS market share
dist = df["ats_system"].value_counts()
share = (dist / len(df) * 100).round(2)
print("ATS share of large employers (2026):")
print(pd.concat([dist, share.rename("pct")], axis=1).head(8).to_string())

# Lookup
apple = df[df["slug"] == "apple"].iloc[0]
print(f"\nApple's ATS: {apple['ats_system']}  ({apple['industry']})")

# Workday-only slice
workday = df[df["ats_system"] == "Workday"]
print(f"\nWorkday powers {len(workday)} employers in the dataset.")
print("Sample:", ", ".join(workday["name"].head(8).tolist()))
