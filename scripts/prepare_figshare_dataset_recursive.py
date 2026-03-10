# scripts/prepare_figshare_dataset_recursive.py
import os
import shutil
import random
from pathlib import Path

SOURCE = r"D:\PROJECTS\Ballistics Recognition Tool\data\figshare_ballistics\data"
DEST = r"D:\PROJECTS\Ballistics Recognition Tool\data\figshare_ballistics_processed"

TRAIN_SPLIT = 0.7
VALID_SPLIT = 0.15
TEST_SPLIT  = 0.15

os.makedirs(DEST, exist_ok=True)

def clean_name(name):
    return name.lower().replace(" ", "_").replace("-", "_")

def find_images_recursive(folder):
    exts = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}
    images = []
    for root, _, files in os.walk(folder):
        for f in files:
            if Path(f).suffix.lower() in exts:
                images.append(os.path.join(root, f))
    return images

firearms = [d for d in os.listdir(SOURCE) if os.path.isdir(os.path.join(SOURCE, d))]
print("Found firearm folders:", firearms)

for firearm in firearms:
    cls_name = clean_name(firearm)
    cls_source = os.path.join(SOURCE, firearm)
    print(f"\nProcessing raw class: {firearm} -> cleaned name: {cls_name}")

    images = find_images_recursive(cls_source)
    print(f"  Found {len(images)} image files (recursive). Sample (up to 5):")
    for p in images[:5]:
        print("    ", p)

    if len(images) == 0:
        print(f"  [WARN] No images found for {firearm}, skipping.")
        continue

    random.shuffle(images)
    n = len(images)
    n_train = int(n * TRAIN_SPLIT)
    n_valid = int(n * VALID_SPLIT)

    splits = {
        "train": images[:n_train],
        "valid": images[n_train:n_train+n_valid],
        "test":  images[n_train+n_valid:]
    }

    for split, imgs in splits.items():
        out_dir = os.path.join(DEST, split, cls_name)
        os.makedirs(out_dir, exist_ok=True)
        for src_path in imgs:
            dst_name = os.path.basename(src_path)
            dst_path = os.path.join(out_dir, dst_name) #avoid overwriting same-named file s
            # avoid overwriting same-named files by prefixing with folder name if needed
            if os.path.exists(dst_path):
                stem = Path(dst_name).stem
                suff = Path(dst_name).suffix
                dst_path = os.path.join(out_dir, f"{stem}_{random.randint(1000,9999)}{suff}")
            shutil.copy2(src_path, dst_path)
    print(f"  Copied -> train:{len(splits['train'])}, valid:{len(splits['valid'])}, test:{len(splits['test'])}")

print("\nDataset preparation (recursive) finished.")
print("Processed dataset saved at:", DEST)
