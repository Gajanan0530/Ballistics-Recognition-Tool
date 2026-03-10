import cv2
import os
import numpy as np
from matplotlib import pyplot as plt

DATASET_PATH = r"D:\PROJECTS\Ballistics Recognition Tool\NEU Metal Surface Defects Data"

orb = cv2.ORB_create()

# Loop through train/test/valid folders
for split_folder in os.listdir(DATASET_PATH):
    split_path = os.path.join(DATASET_PATH, split_folder)
    if not os.path.isdir(split_path):
        continue

    print(f"\n[INFO] Processing split: {split_folder}")

    # Loop through each defect type (Crazing, Inclusion, etc.)
    
    for defect_class in os.listdir(split_path):
        defect_path = os.path.join(split_path, defect_class)
        if not os.path.isdir(defect_path):
            continue

        print(f"   [CLASS] {defect_class}")

        # Loop through each image inside the defect folder
        for image_name in os.listdir(defect_path):
            image_path = os.path.join(defect_path, image_name)

    # Skip non-image files (filters .jpg, .jpeg, .png, .bmp)
            if not any(image_name.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".bmp"]):
                continue

            if not os.path.isfile(image_path):
                continue  # Skip if it's not a file

            img = cv2.imread(image_path)
            if img is None:
                print(f"      [WARN] Could not read image: {image_path}")
                continue

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            keypoints, descriptors = orb.detectAndCompute(gray, None)

            print(f"      Processed: {image_name} | Keypoints: {len(keypoints)}")

            # visualize one sample
            img_keypoints = cv2.drawKeypoints(gray, keypoints, None, color=(0,255,0), flags=0)
            plt.imshow(img_keypoints, cmap='gray')
            plt.title(f"{split_folder} → {defect_class} → {image_name}")
            plt.show()
            break  # only show one sample for now

