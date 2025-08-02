import requests
import time
import re
import os
import csv
import tempfile

# --- CONFIGURATION ---
google_sheet_csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUgbmLaIQcadhPZSGf2nUBoSOhvcqMMoU0DPWlRUKmRrYHYtXsvWxGgqhWRjqpakry4VBTB2CHtMen/pub?gid=1592321778&single=true&output=csv"
iconmap_path = os.path.join(os.path.dirname(__file__), "../IconMap.js")

# --- STEP 1: Download and parse texture IDs from Google Sheet column G ---
print("[*] Downloading Google Sheet CSV...")
response = requests.get(google_sheet_csv_url)
response.raise_for_status()

texture_ids = set()
with tempfile.NamedTemporaryFile(delete=False, mode='w+', newline='', encoding='utf-8') as tmpfile:
    tmpfile.write(response.text)
    tmpfile.flush()
    tmpfile.seek(0)
    reader = csv.reader(tmpfile)
    headers = next(reader)
    if len(headers) < 7:
        raise Exception("Expected at least 7 columns (G is column 6, index 6).")
    for row in reader:
        if len(row) > 6:
            val = row[6].strip()
            if val.isdigit():
                texture_ids.add(int(val))

texture_ids = sorted(texture_ids)
print(f"[*] Found {len(texture_ids)} unique texture IDs in sheet.")

# --- STEP 2: Load existing IconMap.js entries ---
existing_entries = {}
if os.path.exists(iconmap_path):
    with open(iconmap_path, "r", encoding="utf-8") as f:
        for line in f:
            match = re.search(r"(\d+):\s*\"([^\"]+)\"", line)
            if match:
                tid = int(match.group(1))
                icon_name = match.group(2)
                existing_entries[tid] = icon_name

print(f"[*] Loaded {len(existing_entries)} existing entries from IconMap.js")

# --- STEP 3: Lookup missing ones ---
new_entries = {}
for tid in texture_ids:
    if tid in existing_entries:
        continue
    try:
        url = f"https://www.wowhead.com/icon={tid}"
        resp = requests.get(url, allow_redirects=True)
        final_url = resp.url
        if "/icon=" in final_url and final_url.count("/") >= 2:
            icon_name = final_url.split("/")[-1].replace("-", "_")
            new_entries[tid] = icon_name
            print(f"[+] {tid} = \"{icon_name}\"")
        else:
            print(f"[!] {tid} → NOT_FOUND")
    except Exception as e:
        print(f"[!] {tid} → ERROR: {e}")
    time.sleep(0.2)

# --- STEP 4: Inject new entries into IconMap.js ---
if new_entries:
    with open(iconmap_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Find the last closing brace of the object
    closing_index = next((i for i in reversed(range(len(lines))) if "}" in lines[i]), len(lines))

    # Determine if last line before brace has a comma
    if closing_index > 0 and not lines[closing_index - 1].strip().endswith(','):
        lines[closing_index - 1] = lines[closing_index - 1].rstrip() + ',\n'

    new_lines = [f"  {tid}: \"{name}\",\n" for tid, name in sorted(new_entries.items())]
    updated_lines = lines[:closing_index] + new_lines + lines[closing_index:]

    # Write back
    with open(iconmap_path, "w", encoding="utf-8") as f:
        f.writelines(updated_lines)

    print(f"\n✅ Added {len(new_entries)} new entries to IconMap.js")
else:
    print("\n✅ No new entries needed — everything already exists.")
