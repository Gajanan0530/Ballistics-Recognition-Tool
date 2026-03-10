# src/bovw_train_figshare_streamlined.py
import os
import numpy as np
import joblib
import csv
from sklearn.cluster import MiniBatchKMeans
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from tqdm import tqdm

FEATURE_DIR = r"D:\PROJECTS\Ballistics Recognition Tool\data\features_figshare"
MODEL_OUT = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_bovw_svm_streamlined.pkl"
ENCODER_OUT = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_label_encoder_streamlined.pkl"
KMEANS_OUT = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_kmeans_streamlined.pkl"

# --- CONFIG ---
K = 120                 # visual words (reduce to 80-100 if memory/time is limited)
BATCH_DESC = 100000     # number of descriptors to accumulate before partial_fit
SAMPLE_PER_IMAGE = 500  # max descriptors sampled per image (set None to use all)

RANDOM_STATE = 42

# Read manifest
manifest_path = os.path.join(FEATURE_DIR, "manifest.csv")
manifest = []
with open(manifest_path) as f:
    reader = csv.DictReader(f)
    for row in reader:
        manifest.append(row)

# Filter training entries
train_entries = [m for m in manifest if m['split'] == 'train']
if len(train_entries) == 0:
    raise SystemExit("No training entries found in manifest. Check feature extraction step.")

# --- Step 1: Incrementally fit MiniBatchKMeans ---
print("[STEP 1] Incremental KMeans (MiniBatchKMeans) training")
kmeans = MiniBatchKMeans(n_clusters=K, batch_size=20000, random_state=RANDOM_STATE)

buffer_descs = []
buffer_count = 0
total_descs_seen = 0

def maybe_partial_fit(km, buffer_descs):
    arr = np.vstack(buffer_descs).astype(np.float32)
    km.partial_fit(arr)
    return 0, []

# Iterate images, collect descriptor chunks
for m in tqdm(train_entries, desc="Scanning train descriptors for kmeans"):
    desc_path = m['descriptor_file']
    if not os.path.exists(desc_path):
        continue
    desc = np.load(desc_path, allow_pickle=True)
    if desc.size == 0:
        continue

    # optionally subsample descriptors per image to limit influence and memory
    if SAMPLE_PER_IMAGE is not None and desc.shape[0] > SAMPLE_PER_IMAGE:
        idx = np.random.choice(desc.shape[0], SAMPLE_PER_IMAGE, replace=False)
        desc = desc[idx]

    buffer_descs.append(desc.astype(np.float32))
    buffer_count += desc.shape[0]
    total_descs_seen += desc.shape[0]

    if buffer_count >= BATCH_DESC:
        print(f"  Partial-fitting on {buffer_count} descriptors (total seen: {total_descs_seen})")
        # stack and partial_fit
        chunk = np.vstack(buffer_descs).astype(np.float32)
        kmeans.partial_fit(chunk)
        # reset buffer
        buffer_descs = []
        buffer_count = 0

# final flush
if buffer_count > 0:
    print(f"  Final partial-fit on {buffer_count} descriptors (total seen: {total_descs_seen})")
    chunk = np.vstack(buffer_descs).astype(np.float32)
    kmeans.partial_fit(chunk)
    buffer_descs = []
    buffer_count = 0

print("[STEP 1] KMeans (incremental) finished. Total descriptors seen:", total_descs_seen)
joblib.dump(kmeans, KMEANS_OUT)
print(f"[INFO] Saved kmeans to {KMEANS_OUT}")

# --- Step 2: Build histograms per image (train + valid) without stacking all descriptors ---
print("\n[STEP 2] Building image histograms using trained kmeans")

def desc_to_hist(desc, kmeans_obj):
    hist = np.zeros(kmeans_obj.n_clusters, dtype=np.float32)
    if desc.size:
        words = kmeans_obj.predict(desc.astype(np.float32))
        for w in words:
            hist[w] += 1
    # L1 normalize
    s = hist.sum()
    if s > 0:
        hist = hist / s
    return hist

X_train = []; y_train = []
X_valid = []; y_valid = []

for m in tqdm(manifest, desc="Converting descriptors -> histograms"):
    desc = np.load(m['descriptor_file'], allow_pickle=True)
    if desc.size == 0:
        # produce zero-histogram (no keypoints)
        hist = np.zeros(kmeans.n_clusters, dtype=np.float32)
    else:
        # optionally subsample as above
        if SAMPLE_PER_IMAGE is not None and desc.shape[0] > SAMPLE_PER_IMAGE:
            idx = np.random.choice(desc.shape[0], SAMPLE_PER_IMAGE, replace=False)
            desc = desc[idx]
        hist = desc_to_hist(desc, kmeans)
    if m['split'] == 'train':
        X_train.append(hist)
        y_train.append(m['class'])
    elif m['split'] == 'valid':
        X_valid.append(hist)
        y_valid.append(m['class'])
    # we keep test aside for later

X_train = np.array(X_train)
X_valid = np.array(X_valid)
print("[INFO] Shapes:", X_train.shape, X_valid.shape)

# --- Step 3: Encode labels, scale, train SVM ---
print("\n[STEP 3] Encoding labels and training SVM")
le = LabelEncoder()
y_train_enc = le.fit_transform(y_train)
y_valid_enc = le.transform(y_valid)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_valid_scaled = scaler.transform(X_valid)

svm = SVC(kernel='linear', probability=True, random_state=RANDOM_STATE)
svm.fit(X_train_scaled, y_train_enc)

# Evaluate
y_pred = svm.predict(X_valid_scaled)
acc = accuracy_score(y_valid_enc, y_pred)
print(f"\nValidation Accuracy: {acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_valid_enc, y_pred, target_names=le.classes_))

# Save combined model
joblib.dump({'svm': svm, 'scaler': scaler, 'kmeans': kmeans}, MODEL_OUT)
joblib.dump(le, ENCODER_OUT)
print(f"\n[INFO] Saved model bundle to {MODEL_OUT} and label encoder to {ENCODER_OUT}")
