# app/app.py

import streamlit as st
import cv2
import numpy as np
import joblib
from PIL import Image

# -----------------------------
# PAGE CONFIGURATION
# -----------------------------
st.set_page_config(
    page_title="Ballistics Recognition Tool",
    page_icon="🎯",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Custom CSS for style
st.markdown("""
    <style>
        body {
            background-color: #0e1117;
            color: #ffffff;
        }
        .main-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            background: -webkit-linear-gradient(90deg, #00C9FF, #92FE9D);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .sub-text {
            text-align: center;
            font-size: 1rem;
            color: #b3b3b3;
            margin-bottom: 25px;
        }
        .footer {
            text-align: center;
            font-size: 0.8rem;
            margin-top: 30px;
            color: #888;
        }
    </style>
""", unsafe_allow_html=True)

# -----------------------------
# TITLE SECTION
# -----------------------------
st.markdown("<h1 class='main-title'>🔍 Ballistics Recognition Tool</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-text'>A Machine Learning System for Surface Pattern Classification (Basic Version)</p>", unsafe_allow_html=True)

# -----------------------------
# LOAD MODEL
# -----------------------------
MODEL_PATH = r"D:\PROJECTS\Ballistics Recognition Tool\models\svm_basic_model.pkl"
ENCODER_PATH = r"D:\PROJECTS\Ballistics Recognition Tool\models\label_encoder.pkl"

svm_model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

orb = cv2.ORB_create(nfeatures=500)

# -----------------------------
# FEATURE EXTRACTION FUNCTION
# -----------------------------
def extract_feature_from_image(image):
    img_array = np.array(image)

    if len(img_array.shape) == 2:
        gray = img_array
    elif len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        st.error("Unsupported image format.")
        return np.zeros((1, 32))

    keypoints, descriptors = orb.detectAndCompute(gray, None)
    if descriptors is not None:
        return np.mean(descriptors, axis=0).reshape(1, -1)
    else:
        return np.zeros((1, 32))

# -----------------------------
# FILE UPLOAD SECTION
# -----------------------------
st.markdown("### 📂 Upload Image")
uploaded_file = st.file_uploader("Upload a .jpg, .png, or .bmp image", type=["jpg", "jpeg", "png", "bmp"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_container_width=True)

    st.markdown("### 🧠 Feature Extraction in Progress...")
    features = extract_feature_from_image(image)

    # Prediction
    prediction = svm_model.predict(features)[0]
    class_name = label_encoder.inverse_transform([prediction])[0]
    probs = svm_model.predict_proba(features)[0]
    confidence = np.max(probs) * 100

    # -----------------------------
    # OUTPUT SECTION
    # -----------------------------
    st.markdown("### 🎯 Model Prediction")
    st.success(f"**Predicted Class:** {class_name}")

    st.write("**Confidence Level:**")
    st.progress(int(confidence))
    st.info(f"Confidence: {confidence:.2f}%")

# -----------------------------
# ABOUT SECTION
# -----------------------------
st.write("---")
st.markdown("""
    ### ℹ️ About This Project
    This application demonstrates a basic version of a **Ballistics Recognition Tool** built using:
    - ORB feature extraction (OpenCV)
    - Support Vector Machine (Scikit-learn)
    - Streamlit web UI  

    **Dataset Used:** NEU Metal Surface Defects (for simulation)  
    **Mode:** Class Submission (Basic Version)
""")

st.markdown("<p class='footer'>© 2025 Ballistics Recognition Tool | Developed by Phani ⚙️</p>", unsafe_allow_html=True)
