# src/api_predict.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, cv2, numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

MODEL_BUNDLE = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_bovw_svm_streamlined.pkl"
ENCODER_FILE = r"D:\PROJECTS\Ballistics Recognition Tool\models\figshare_label_encoder_streamlined.pkl"

# load model bundle and encoder (will raise if missing)
bundle = joblib.load(MODEL_BUNDLE)
svm = bundle["svm"]
scaler = bundle["scaler"]
kmeans = bundle["kmeans"]
le = joblib.load(ENCODER_FILE)

# SIFT (preferred) or ORB fallback
try:
    sift = cv2.SIFT_create()
except:
    sift = cv2.ORB_create(nfeatures=1500)

def process_image_bytes(data):
    img = Image.open(io.BytesIO(data)).convert("RGB")
    arr = np.array(img)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

    kp, desc = sift.detectAndCompute(gray, None)

    if desc is None or desc.size == 0:
        hist = np.zeros(kmeans.n_clusters, dtype=np.float32).reshape(1, -1)
    else:
        words = kmeans.predict(desc.astype(np.float32))
        hist = np.bincount(words, minlength=kmeans.n_clusters).astype(np.float32)
        hist /= (hist.sum() + 1e-9)
        hist = hist.reshape(1, -1)

    hist_scaled = scaler.transform(hist)
    pred_idx = svm.predict(hist_scaled)[0]
    probs = svm.predict_proba(hist_scaled)[0]

    pred = le.inverse_transform([pred_idx])[0]
    conf = float(np.max(probs)) * 100

    return {"prediction": pred, "confidence": conf}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file_bytes = request.files["file"].read()
    result = process_image_bytes(file_bytes)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
