#!/usr/bin/env python3
"""Fix Facebook token + feed new content queue to social_poster.py
Run this ON THE UBUNTU MACHINE: /home/ubuntu/projects/metaphysics-landing/
It will:
  1. Exchange short-lived FB token for 60-day token
  2. Update config/meta_config.json
  3. Import new blog URLs into the posting queue
"""

import json, subprocess, sys, os
from urllib.request import urlopen, Request
from urllib.parse import urlencode

CONFIG_PATH = "config/meta_config.json"
QUEUE_FILE = "FB_IG_POST_QUEUE.txt"
APP_ID = "1167656975"
APP_SECRET = "b302e550c80168682b8"

# ── Step 1: Exchange token ──
print("=" * 40)
print("Step 1: Exchanging FB token for 60-day version...")
print()

try:
    with open(CONFIG_PATH) as f:
        config = json.load(f)
except FileNotFoundError:
    print(f"ERROR: {CONFIG_PATH} not found. Run this from metaphysics-landing/")
    sys.exit(1)

old_token = config.get("page_token") or config.get("access_token") or config.get("token")
if not old_token:
    print("ERROR: No token found in config keys (tried: page_token, access_token, token)")
    print("Current config:", json.dumps(config, indent=2))
    sys.exit(1)

print(f"Current token (first 20 chars): {old_token[:20]}...")

# Exchange for long-lived
url = f"https://graph.facebook.com/v25.0/oauth/access_token"
params = urlencode({
    "grant_type": "fb_exchange_token",
    "client_id": APP_ID,
    "client_secret": APP_SECRET,
    "fb_exchange_token": old_token,
})
full_url = f"{url}?{params}"

try:
    resp = urlopen(full_url, timeout=15)
    data = json.loads(resp.read())
    if "access_token" in data:
        new_token = data["access_token"]
        expires = data.get("expires_in", "unknown")
        print(f"SUCCESS: New token expires in {expires} seconds (~{int(expires)/86400:.0f} days)")
        print(f"New token (first 20 chars): {new_token[:20]}...")
    else:
        print(f"ERROR from Facebook:", json.dumps(data, indent=2))
        print("\nThe old token may have expired. You'll need to manually generate a new short-lived token at:")
        print("  https://developers.facebook.com/tools/explorer/")
        print("  Select app '1167656975', get a Page Token for page '1132956263238202'")
        print("  Then re-run this script.")
        sys.exit(1)
except Exception as e:
    print(f"HTTP error: {e}")
    sys.exit(1)

# Update config
for key in ["page_token", "access_token", "token"]:
    if key in config:
        config[key] = new_token
        break
else:
    config["page_token"] = new_token

with open(CONFIG_PATH, "w") as f:
    json.dump(config, f, indent=2)
print(f"\nUpdated {CONFIG_PATH} with new 60-day token.")

# ── Step 2: Feed new content queue ──
print()
print("=" * 40)
print("Step 2: Feeding new blog URLs to posting queue...")
print()

if not os.path.exists(QUEUE_FILE):
    print(f"WARNING: {QUEUE_FILE} not found. Transfer it from Mac first:")
    print(f"  scp ~/astrology/FB_IG_POST_QUEUE.txt ubuntu@this-server:{os.getcwd()}/")
    print("\nSkipping content feed. Token is fixed though!")
else:
    with open(QUEUE_FILE) as f:
        urls = [l.strip() for l in f if l.strip()]

    # Check which URLs have already been posted (simple check: see if they're in the poster's log)
    posted_log = "posted_urls.txt"
    already = set()
    if os.path.exists(posted_log):
        with open(posted_log) as f:
            already = {l.strip() for l in f if l.strip()}

    new_urls = [u for u in urls if u not in already]
    print(f"Total URLs: {len(urls)}")
    print(f"Already posted: {len(already)}")
    print(f"New to post: {len(new_urls)}")

    if new_urls:
        # Write new URLs to the queue file that social_poster.py reads
        queue_path = "post_queue.txt"
        existing = []
        if os.path.exists(queue_path):
            with open(queue_path) as f:
                existing = [l.strip() for l in f if l.strip()]

        all_queued = existing + new_urls
        # Dedup
        seen = set()
        unique = []
        for u in all_queued:
            if u not in seen:
                seen.add(u)
                unique.append(u)

        with open(queue_path, "w") as f:
            f.write("\n".join(unique) + "\n")
        print(f"Updated {queue_path}: {len(unique)} URLs queued ({len(new_urls)} new)")
    else:
        print("No new URLs to add — everything is already queued or posted.")

print()
print("=" * 40)
print("DONE. Token refreshed. Content queue updated.")
print()
print("Next steps:")
print("  - Restart cron jobs if needed")
print("  - FB will auto-post from queue every 6 hours")
