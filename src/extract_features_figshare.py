# src/extract_features_figshare.py
import os
import cv2
import numpy as np
import csv
from tqdm import tqdm
from pathlib import Path

DATA_ROOT = r"D:\PROJECTS\Ballistics Recognition Tool\data\figshare_ballistics_processed"
OUT_DIR = r"D:\PROJECTS\Ballistics Recognition Tool\data\features_figshare"

os.makedirs(OUT_DIR, exist_ok=True)

# Try SIFT, fallback ORB
try:
    sift = cv2.SIFT_create()
    desc_dim = 128
    print("[INFO] Using SIFT")
except Exception as e:
    print("[WARN] SIFT not available, falling back to ORB. Error:", e)
    sift = cv2.ORB_create(nfeatures=1500)
    desc_dim = 32
    print("[INFO] Using ORB")

manifest = []
supported_exts = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".JPG", ".JPEG", ".PNG", ".BMP", ".TIF", ".TIFF"}

def find_images_recursive(folder):
    files = []
    for root, _, filenames in os.walk(folder):
        for f in filenames:
            if Path(f).suffix.lower() in {ext.lower() for ext in supported_exts}:
                files.append(os.path.join(root, f))
    return files

total_found = 0
for split in ["train", "valid", "test"]:
    split_path = os.path.join(DATA_ROOT, split)
    if not os.path.isdir(split_path):
        print(f"[INFO] Split folder not found (skipping): {split_path}")
        continue

    print(f"\n[INFO] Processing split: {split}")
    classes = [d for d in os.listdir(split_path) if os.path.isdir(os.path.join(split_path, d))]
    if not classes:
        print(f"[WARN] No class subfolders found in {split_path} (check dataset).")

    for cls in classes:
        cls_path = os.path.join(split_path, cls)
        print(f"   [CLASS] {cls}  (searching recursively...)")
        images = find_images_recursive(cls_path)
        print(f"      Found {len(images)} images for class '{cls}' (showing up to 5):")
        for p in images[:5]:
            print("         ", p)
        total_found += len(images)

        for img_path in tqdm(images, desc=f"{split}/{cls}", unit="imgs"):
            # read gray
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                print("[WARN] Could not read image:", img_path)
                continue

            keypoints, descriptors = sift.detectAndCompute(img, None)
            if descriptors is None:
                descriptors = np.empty((0, desc_dim), dtype=np.float32)

            out_file = os.path.join(OUT_DIR, f"{split}__{cls}__{Path(img_path).stem}.npy")
            np.save(out_file, descriptors)
            manifest.append([out_file, split, cls, img_path])

print(f"\n[INFO] Total images found: {total_found}")
# Save manifest.csv
manifest_path = os.path.join(OUT_DIR, "manifest.csv")
with open(manifest_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["descriptor_file", "split", "class", "image_path"])
    writer.writerows(manifest)

print("\n[INFO] Feature extraction complete.")
print("[INFO] Manifest saved at:", manifest_path)
