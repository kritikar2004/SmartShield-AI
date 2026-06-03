import pandas as pd

from sklearn.model_selection import train_test_split

from sklearn.linear_model import LogisticRegression

from sklearn.metrics import accuracy_score

import joblib

print("Loading dataset...")

# =========================
# LOAD DATASET
# =========================

data = pd.read_csv(
    "dataset/creditcard.csv"
)

print("Dataset Loaded Successfully")

# =========================
# FEATURES & TARGET
# =========================

X = data.drop("Class", axis=1)

y = data["Class"]

# =========================
# SPLIT DATA
# =========================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.2,

    random_state=42
)

print("Training model...")

# =========================
# TRAIN MODEL
# =========================

model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)

print("Model Training Complete")

# =========================
# TEST MODEL
# =========================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Model Accuracy: {accuracy * 100:.2f}%"
)

# =========================
# SAVE MODEL
# =========================

joblib.dump(
    model,
    "fraud_model.pkl"
)

print("Model Saved Successfully")