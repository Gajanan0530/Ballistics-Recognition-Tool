# app/app.py
import streamlit as st
import cv2
import numpy as np
import joblib
from PIL import Image
import os
import pandas as pd
from pathlib import Path

# -------- CONFIG --------
st.set_page_config(page_title="Ballistics Recognition Tool", page_icon="🎯", layout="centered")
st.title("🎯 Ballistics Recognition Tool — Figshare Model")

MODEL_BUNDLE = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_bovw_svm_streamlined.pkl"
LABEL_ENCODER = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_label_encoder_streamlined.pkl"
MANIFEST_CSV = r"D:\PROJECTS\Ballistics Recognition Tool\data\features_figshare\manifest.csv"

# UI helper
st.markdown("Upload an image of a toolmark (firing-pin / breech-face). The model predicts firearm class and shows top matching references.")

# -------- Load model bundle & manifest --------
@st.cache_resource
def load_model_and_manifest():
    bundle = joblib.load(MODEL_BUNDLE)
    svm = bundle['svm']
    scaler = bundle['scaler']
    kmeans = bundle['kmeans']
    le = joblib.load(LABEL_ENCODER)

    # manifest: descriptor_file, split, class, image_path
    manifest = None
    if os.path.exists(MANIFEST_CSV):
        manifest = pd.read_csv(MANIFEST_CSV)
    else:
        manifest = pd.DataFrame(columns=['descriptor_file','split','class','image_path'])

    return svm, scaler, kmeans, le, manifest

svm, scaler, kmeans, label_enc, manifest = load_model_and_manifest()

# Prepare SIFT (with fallback ORB)
try:
    sift = cv2.SIFT_create()
    DESC_DIM = 128
except Exception:
    sift = cv2.ORB_create(nfeatures=1500)
    DESC_DIM = 32

# -------- helper funcs --------
def read_image_to_gray(img_pil):
    arr = np.array(img_pil)
    if len(arr.shape) == 3 and arr.shape[2] == 4:
        # remove alpha
        arr = cv2.cvtColor(arr, cv2.COLOR_RGBA2RGB)
    if len(arr.shape) == 3:
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    else:
        gray = arr
    return gray

def extract_descriptors_from_pil(img_pil):
    gray = read_image_to_gray(img_pil)
    kp, desc = sift.detectAndCompute(gray, None)
    if desc is None:
        return np.empty((0, DESC_DIM), dtype=np.float32)
    return desc.astype(np.float32)

def desc_to_hist(desc, kmeans_obj):
    hist = np.zeros(kmeans_obj.n_clusters, dtype=np.float32)
    if desc.size:
        words = kmeans_obj.predict(desc)
        for w in words:
            hist[w] += 1
    s = hist.sum()
    if s > 0:
        hist = hist / s
    return hist.reshape(1, -1)

def top_k_matches(query_hist, manifest_df, k=3):
    # compute L2 distance with training histograms
    distances = []
    for _, row in manifest_df.iterrows():
        if row['split'] != 'train':
            continue
        desc_file = row['descriptor_file']
        if not os.path.exists(desc_file):
            continue
        desc = np.load(desc_file, allow_pickle=True)
        if desc.size == 0:
            ref_hist = np.zeros(kmeans.n_clusters, dtype=np.float32)
        else:
            ref_hist = np.zeros(kmeans.n_clusters, dtype=np.float32)
            words = kmeans.predict(desc)
            for w in words:
                ref_hist[w] += 1
            s = ref_hist.sum()
            if s > 0:
                ref_hist = ref_hist / s
        d = np.linalg.norm(query_hist.flatten() - ref_hist.flatten())
        distances.append((d, row['image_path'], row['class']))
    distances.sort(key=lambda x: x[0])
    return distances[:k]

# -------- File upload UI --------
uploaded_file = st.file_uploader("Upload an image (.jpg/.png/.bmp/.tif)", type=["jpg","jpeg","png","bmp","tif","tiff"])
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

    st.info("Extracting descriptors...")
    desc = extract_descriptors_from_pil(image)

    st.info("Computing BoVW histogram and predicting...")
    hist = desc_to_hist(desc, kmeans)
    hist_scaled = scaler.transform(hist)
    pred_idx = svm.predict(hist_scaled)[0]
    pred_name = label_enc.inverse_transform([pred_idx])[0]
    probs = svm.predict_proba(hist_scaled)[0]
    confidence = float(np.max(probs)) * 100

    st.success(f"**Predicted Class:** {pred_name}")
    st.info(f"**Confidence:** {confidence:.2f}%")

    # show top matches
    st.write("---")
    st.markdown("#### Top matching reference images (train set)")
    matches = top_k_matches(hist, manifest, k=3)
    cols = st.columns(len(matches))
    for (col, (dist, img_path, cls)) in zip(cols, matches):
        if os.path.exists(img_path):
            col.image(Image.open(img_path), use_column_width=True, caption=f"{Path(img_path).name}\nClass: {cls}\nL2: {dist:.3f}")
        else:
            col.write(f"Missing image: {img_path}")
