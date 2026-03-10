# Ballistics Recognition Tool



An ML-powered forensic analysis system designed to automate the identification and comparison of ballistic evidence such as bullet and cartridge case markings.



---



## Overview



The **Ballistics Recognition Tool (BRT)** is a machine learning–driven system that assists forensic investigators in analyzing ballistic evidence. The system extracts unique microscopic features from bullet or cartridge images and classifies them using computer vision and machine learning techniques.



The goal of this project is to demonstrate how modern ML techniques can support forensic investigations by improving speed, consistency, and accuracy in ballistic identification.



---



## Key Features



\- Automated feature extraction from ballistic images

\- Computer vision pipeline using \*\*SIFT descriptors\*\*

\- \*\*Bag of Visual Words (BoVW)\*\* representation for image encoding

\- Machine learning classification using \*\*Support Vector Machines (SVM)\*\*

\- \*\*Flask API\*\* for backend model inference

\- \*\*React frontend\*\* for interactive user interface

\- \*\*Streamlit interface\*\* for rapid experimentation and visualization

\- Modular architecture for easy expansion and experimentation



---



## System Architecture



The system follows a modular architecture consisting of:



### 1. Image Processing Layer

Extracts **SIFT keypoints and descriptors** from ballistic images.



### 2. Feature Encoding Layer

Uses **Bag of Visual Words (BoVW)** to convert local descriptors into fixed-length feature vectors.



### 3. Classification Layer

Uses a **Support Vector Machine (SVM)** classifier to predict ballistic categories.



### 4. Backend API

A \*\*Flask API\*\* handles model inference requests from the frontend.



### 5. Frontend Interface

A \*\*React application\*\* provides a user-friendly interface for uploading and analyzing ballistic images.



### 6. Experimental Interface

A \*\*Streamlit application\*\* allows rapid testing and visualization of the ML model.



---



## Tech Stack



### Machine Learning \& Computer Vision

\- Python

\- OpenCV

\- Scikit-learn

\- NumPy

\- SIFT Feature Extraction

\- Bag of Visual Words



### Backend

\- Flask API



### Frontend

\- React.js



### Visualization / Testing

\- Streamlit



### Version Control

\- Git

\- GitHub



---



## Project Structure



```

Ballistics-Recognition-Tool

│

├── backend

│   ├── app.py

│   ├── model

│   └── utils

│

├── frontend

│   └── react-app

│

├── ml\_model

│   ├── training

│   ├── feature\_extraction

│   └── classifier

│

├── streamlit\_app

│   └── app.py

│

├── dataset

│

├── requirements.txt

└── README.md

```



---



## Machine Learning Pipeline



1\. Image Input  

2\. Image Preprocessing  

3\. SIFT Feature Extraction  

4\. Descriptor Clustering (K-Means)  

5\. Bag of Visual Words Encoding  

6\. Feature Vector Creation  

7\. SVM Classification  

8\. Prediction Output  



---



## Installation



### Clone the Repository



```bash

git clone https://github.com/YOUR\_USERNAME/Ballistics-Recognition-Tool.git

cd Ballistics-Recognition-Tool

```



### Install Dependencies



```bash

pip install -r requirements.txt

```



---



## Running the Project



### Run Flask API



```bash

cd backend

python app.py

```



### Run Streamlit App



```bash

cd streamlit\_app

streamlit run app.py

```



### Run React Frontend



```bash

cd frontend

npm install

npm start

```



---



## Example Workflow



1\. Upload a bullet or cartridge image  

2\. System extracts SIFT features  

3\. Features are encoded using Bag of Visual Words  

4\. SVM classifier predicts the ballistic class  

5\. Results are displayed in the UI  



---



## Applications



\- Forensic Ballistics Analysis  

\- Criminal Investigations  

\- Firearm Identification Research  

\- Academic Research in Computer Vision  



---



## Future Improvements



\- Deep learning based feature extraction (CNN)

\- Larger and higher-quality ballistic dataset

\- Real-time comparison across ballistic databases

\- Cloud deployment

\- Explainable AI for forensic transparency



---



## Author



**Gajanana Phanindra**  

B.Tech – CSE (Artificial Intelligence & Machine Learning)  

Aspiring Machine Learning Engineer



---



## License



This project is open-source and available under the **MIT License**.
