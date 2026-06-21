#!/usr/bin/env python3
"""Run a whole expert's category plans through the shared jigsaw fetcher.

plans.json = {
  "dogs":   {"pixabay_category": "animals", "queries": ["dog","puppy"]},
  "cats":   {"pixabay_category": "animals", "queries": ["cat","kitten"]},
  ...
}

Usage: run_plans.py --key KEY --plans plans.json --out public/catalog --target 450
Prints "<cat> <count>" per category and a final "TOTAL <n>".
"""
import argparse, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_catalog import fetch_query  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True)
    ap.add_argument("--plans", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--target", type=int, default=450)
    a = ap.parse_args()

    plans = json.load(open(a.plans))
    os.makedirs(a.out, exist_ok=True)
    total = 0
    for cat, plan in plans.items():
        pix_cat = plan.get("pixabay_category") or None
        seen, out = set(), []
        for q in plan.get("queries", []):
            if len(out) >= a.target:
                break
            fetch_query(a.key, q, pix_cat, seen, out)
        out = out[: a.target]
        json.dump(
            {"key": cat, "count": len(out), "images": out},
            open(f"{a.out}/{cat}.json", "w"),
            separators=(",", ":"),
        )
        total += len(out)
        print(f"{cat} {len(out)}", flush=True)
    print(f"TOTAL {total}")


if __name__ == "__main__":
    main()
