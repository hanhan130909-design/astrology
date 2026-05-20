import os

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"
count = 0
for d in os.listdir(base):
    meta_path = os.path.join(base, d, "metadata.ts")
    layout_path = os.path.join(base, d, "layout.tsx")
    if os.path.isfile(meta_path) and os.path.isfile(layout_path):
        os.remove(meta_path)
        count += 1
        print(f"Removed: {d}/metadata.ts")
print(f"\nTotal removed: {count}")