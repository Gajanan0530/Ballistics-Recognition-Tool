import os
import numpy as np
import joblib
import csv
from sklearn.cluster import MiniBatchKMeans
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report

FEATURE_DIR = r"D:\PROJECTS\Ballistics Recognition Tool\data\features_figshare"
MODEL_OUT = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_bovw_svm.pkl"
ENCODER_OUT = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_label_encoder.pkl"

K = 150   # Number of visual words (tune if needed)

# Read manifest
manifest_path = os.path.join(FEATURE_DIR, "manifest.csv")
manifest = []
with open(manifest_path) as f:
    reader = csv.DictReader(f)
    for row in reader:
        manifest.append(row)

# Collect descriptors from train only
train_desc = []

print("[INFO] Loading training descriptors...")
for m in manifest:
    if m["split"] == "train":
        desc = np.load(m["descriptor_file"], allow_pickle=True)
        if desc.size:
            train_desc.append(desc)

all_desc = np.vstack(train_desc)
print("[INFO] Descriptor matrix:", all_desc.shape)

print("\n[INFO] Running KMeans clustering...")
kmeans = MiniBatchKMeans(n_clusters=K, batch_size=2000)
kmeans.fit(all_desc)

joblib.dump(kmeans, r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_kmeans.pkl")

# Convert descriptors → histogram
def desc_to_hist(desc):
    hist = np.zeros(K)
    if desc.size:
        words = kmeans.predict(desc)
        for w in words:
            hist[w] += 1
    hist = hist / (hist.sum() + 1e-6)
    return hist

# Build dataset
X_train, y_train = [], []
X_valid, y_valid = [], []

print("\n[INFO] Building train/valid sets...")
for m in manifest:
    desc = np.load(m["descriptor_file"], allow_pickle=True)
    hist = desc_to_hist(desc)

    if m["split"] == "train":
        X_train.append(hist)
        y_train.append(m["class"])
    elif m["split"] == "valid":
        X_valid.append(hist)
        y_valid.append(m["class"])

X_train = np.array(X_train)
X_valid = np.array(X_valid)

# Label encode
le = LabelEncoder()
y_train_enc = le.fit_transform(y_train)
y_valid_enc = le.transform(y_valid)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_valid_scaled = scaler.transform(X_valid)

print("\n[INFO] Training SVM classifier...")
svm = SVC(kernel="linear", probability=True)
svm.fit(X_train_scaled, y_train_enc)

# Evaluate
y_pred = svm.predict(X_valid_scaled)
print("\nValidation Accuracy:", accuracy_score(y_valid_enc, y_pred))
print("\nClassification Report:")
print(classification_report(y_valid_enc, y_pred, target_names=le.classes_))

# Save model & encoder
joblib.dump({"svm": svm, "scaler": scaler, "kmeans": kmeans}, MODEL_OUT)
joblib.dump(le, ENCODER_OUT)

print("\n[INFO] Model saved successfully.")
