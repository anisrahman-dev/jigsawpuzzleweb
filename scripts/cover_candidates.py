#!/usr/bin/env python3
"""Print a small pool of jigsaw-friendly cover candidates for one event.

Reuses the shared fetcher rules (no humans, >=1280px landscape, permanent
cdn.pixabay.com URLs, deduped). Prints a compact JSON array to stdout so an
agent can pick the most colorful / complex / on-theme image as the banner.

Usage: cover_candidates.py --key KEY --n 15 "query one" "query two" ...
"""
import argparse, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_catalog import fetch_query  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True)
    ap.add_argument("--n", type=int, default=15)
    ap.add_argument("queries", nargs="+")
    a = ap.parse_args()

    seen, out = set(), []
    for q in a.queries:
        if len(out) >= a.n:
            break
        fetch_query(a.key, q, None, seen, out)
    # Compact candidate list (drop the thumb to keep it small).
    print(
        json.dumps(
            [
                {"url": im["url"], "w": im["w"], "h": im["h"], "tags": im["tags"][:140]}
                for im in out[: a.n]
            ]
        )
    )


if __name__ == "__main__":
    main()
