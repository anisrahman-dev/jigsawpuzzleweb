#!/usr/bin/env python3
"""Fetch a jigsaw-optimized image set for ONE category from Pixabay.

Shared, deterministic fetcher used by the 5 curation agents. It enforces the
"good jigsaw" rules so quality is uniform regardless of which agent calls it:
  - no humans (tag-filtered)
  - large + complex (>= 1280px wide, landscape)
  - permanent cdn.pixabay.com URLs (derived from previewURL, never the
    temporary /get/ links)
  - de-duplicated by image id across all query variants

Usage:
  fetch_catalog.py --key KEY --cat dogs --out public/catalog \
      --target 420 --plan plan.json

plan.json = {"pixabay_category": "animals" | null, "queries": ["dog","puppy"]}
Prints one line: "<cat> <count>".
"""
import argparse, json, re, sys, time, urllib.parse, urllib.request

HUMAN = re.compile(
    r"\b(people|person|persons|man|men|woman|women|girl|girls|boy|boys|child|"
    r"children|kid|kids|baby|babies|toddler|portrait|model|face|faces|human|"
    r"humans|crowd|wedding|bride|groom|family|families|couple|lady|ladies|male|"
    r"female|teenager|teen|adult|selfie|hands|hand|fingers|smiling|smile)\b",
    re.I,
)
PREVIEW = re.compile(r"^(https://cdn\.pixabay\.com/photo/.+?)_150\.(jpg|png)$")
ENDPOINT = "https://pixabay.com/api/"


def get_json(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:  # noqa: BLE001 - retry on any transient error
            code = getattr(e, "code", None)
            if code in (400, 401):
                sys.stderr.write(f"  fatal {code}: {e}\n")
                return None
            time.sleep(1.5 * (i + 1))  # backoff (handles 429 / network)
    return None


def fetch_query(key, q, pix_cat, seen, out):
    """Page through one query (Pixabay caps accessible results at 500)."""
    for page in range(1, 4):  # 3 * 200 = 600 -> capped at 500 by API
        params = {
            "key": key, "q": q, "image_type": "photo", "safesearch": "true",
            "per_page": "200", "page": str(page), "orientation": "horizontal",
            "order": "popular",
        }
        if pix_cat:
            params["category"] = pix_cat
        data = get_json(ENDPOINT + "?" + urllib.parse.urlencode(params))
        time.sleep(0.5)  # be polite to the shared rate limit
        if not data:
            return
        hits = data.get("hits", [])
        if not hits:
            return
        for h in hits:
            hid = h["id"]
            if hid in seen:
                continue
            if h.get("imageWidth", 0) < 1280 or h.get("imageHeight", 0) < 720:
                continue
            tags = h.get("tags", "")
            if HUMAN.search(tags):
                continue
            m = PREVIEW.match(h.get("previewURL", ""))
            if not m:
                continue
            base, ext = m.group(1), m.group(2)
            seen.add(hid)
            out.append({
                "id": str(hid),
                "url": f"{base}_1280.{ext}",
                "thumb": f"{base}_640.{ext}",
                "w": h["imageWidth"], "h": h["imageHeight"],
                "tags": tags,
                "author": h.get("user", "Pixabay"),
            })
        if len(hits) < 200:
            return


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True)
    ap.add_argument("--cat", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--target", type=int, default=420)
    ap.add_argument("--plan", required=True)
    a = ap.parse_args()

    plan = json.load(open(a.plan))
    pix_cat = plan.get("pixabay_category") or None
    queries = plan.get("queries", [])

    seen, out = set(), []
    for q in queries:
        if len(out) >= a.target:
            break
        fetch_query(a.key, q, pix_cat, seen, out)

    out = out[: a.target]
    import os
    os.makedirs(a.out, exist_ok=True)
    json.dump(
        {"key": a.cat, "count": len(out), "images": out},
        open(f"{a.out}/{a.cat}.json", "w"),
        separators=(",", ":"),
    )
    print(f"{a.cat} {len(out)}")


if __name__ == "__main__":
    main()
