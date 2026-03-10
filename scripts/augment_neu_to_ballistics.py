# scripts/augment_neu_to_ballistics.py
import os, cv2, numpy as np, random
from pathlib import Path
from tqdm import tqdm

SRC_ROOT = r"D:\PROJECTS\Ballistics Recognition Tool\NEU Metal Surface Defects Data"
OUT_ROOT = r"D:\PROJECTS\Ballistics Recognition Tool\data\nbtrd_sim"
os.makedirs(OUT_ROOT, exist_ok=True)

AUG_PER_IMAGE = 6
IMG_SIZE = (400, 400)
TRAIN_SPLIT = 0.7
VALID_SPLIT = 0.15
TEST_SPLIT = 0.15

def gabor_kernel(ksize=31, sigma=4.0, theta=0, lambd=10.0, gamma=0.5, psi=0):
    return cv2.getGaborKernel((ksize, ksize), sigma, theta, lambd, gamma, psi, ktype=cv2.CV_32F)

def apply_gabor(img, num_orients=4):
    output = np.zeros_like(img, dtype=np.float32)
    for i in range(num_orients):
        theta = i * np.pi / num_orients + random.uniform(-0.25, 0.25)
        kern = gabor_kernel(ksize=31, sigma=4.0, theta=theta, lambd=12.0, gamma=0.5)
        filtered = cv2.filter2D(img.astype(np.float32), cv2.CV_32F, kern)
        output += filtered
    out = cv2.normalize(output, None, 0, 255, cv2.NORM_MINMAX)
    return out.astype(np.uint8)

def add_scratches(img, num_lines=5):
    h, w = img.shape
    overlay = img.copy().astype(np.float32)
    for _ in range(num_lines):
        x1 = random.randint(0, w-1)
        y1 = random.randint(0, h-1)
        length = random.randint(int(0.2*w), int(0.9*w))
        angle = random.uniform(-np.pi, np.pi)
        x2 = int(x1 + length * np.cos(angle))
        y2 = int(y1 + length * np.sin(angle))
        thickness = random.randint(1, 3)
        cv2.line(overlay, (x1,y1), (max(0,min(w-1,x2)), max(0,min(h-1,y2))), (255,), thickness)
    blended = cv2.addWeighted(img.astype(np.float32), 0.9, overlay, 0.1, 0)
    return blended.astype(np.uint8)

def random_contrast(img):
    alpha = random.uniform(0.7, 1.4)
    beta = random.randint(-20, 20)
    out = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)
    return out

def augment_image(img_path, out_dir, base_name):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return
    img = cv2.resize(img, IMG_SIZE)
    for i in range(AUG_PER_IMAGE):
        img_gabor = apply_gabor(img, num_orients=random.choice([3,4,5]))
        scratched = add_scratches(img_gabor, num_lines=random.randint(3,8))
        contrasted = random_contrast(scratched)
        angle = random.uniform(-15,15)
        M = cv2.getRotationMatrix2D((IMG_SIZE[0]//2, IMG_SIZE[1]//2), angle, 1.0)
        rotated = cv2.warpAffine(contrasted, M, IMG_SIZE, borderMode=cv2.BORDER_REFLECT)
        noise = np.random.normal(0, random.uniform(2,8), IMG_SIZE).astype(np.float32)
        noisy = rotated.astype(np.float32) + noise
        noisy = np.clip(noisy, 0, 255).astype(np.uint8)
        out_name = f"{base_name}_aug{i}.png"
        cv2.imwrite(os.path.join(out_dir, out_name), noisy)

def build_dataset():
    neu_train_root = os.path.join(SRC_ROOT, "train")
    classes = [d for d in os.listdir(neu_train_root) if os.path.isdir(os.path.join(neu_train_root,d))]
    print("Classes found:", classes)
    for cls in classes:
        src_cls_dir = os.path.join(neu_train_root, cls)
        images = [f for f in os.listdir(src_cls_dir) if f.lower().endswith(('.bmp','.png','.jpg','.jpeg'))]
        random.shuffle(images)
        n = len(images)
        n_train = int(n * TRAIN_SPLIT)
        n_valid = int(n * VALID_SPLIT)
        for split, imgs in [("train", images[:n_train]), ("valid", images[n_train:n_train+n_valid]), ("test", images[n_train+n_valid:])]:
            out_dir = os.path.join(OUT_ROOT, split, cls)
            os.makedirs(out_dir, exist_ok=True)
            for img_name in tqdm(imgs, desc=f"Augmenting {cls}/{split}"):
                img_path = os.path.join(src_cls_dir, img_name)
                base_name = Path(img_name).stem
                augment_image(img_path, out_dir, base_name)
    print("Augmentation complete. Check:", OUT_ROOT)

if __name__ == "__main__":
    build_dataset()
