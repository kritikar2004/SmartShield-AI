import os
from datetime import datetime
import random
import sys

import joblib
import random
import pandas as pd

# =========================
# LOAD TRAINED MODEL
# =========================

current_dir = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    current_dir,
    "fraud_model.pkl"
)

model = joblib.load(
    model_path
)

# =========================
# GET AMOUNT FROM NODE.JS
# =========================

amount = float(sys.argv[1])
location = sys.argv[2]

# =========================
# CREATE INPUT DATA
# =========================

# =========================
# FRAUD SIMULATION ENGINE
# =========================

fraud_probability = 0

# =========================
# HIGH AMOUNT RISK
# =========================

if amount > 50000:

    fraud_probability += 0.95

elif amount > 20000:

    fraud_probability += 0.50

elif amount > 10000:

    fraud_probability += 0.25

# =========================
# RANDOM ANOMALY FACTOR
# =========================

fraud_probability += random.uniform(
    0,
    0.35
)

# =========================
# GENERATE SYNTHETIC FEATURES
# =========================

input_data = {

    "Time": [
        random.randint(0, 172000)
    ],

    "V1": [
        random.uniform(-5, 5)
    ],

    "V2": [
        random.uniform(-5, 5)
    ],

    "V3": [
        random.uniform(-5, 5)
    ],

    "V4": [
        random.uniform(-5, 5)
    ],

    "V5": [
        random.uniform(-5, 5)
    ],

    "V6": [
        random.uniform(-5, 5)
    ],

    "V7": [
        random.uniform(-5, 5)
    ],

    "V8": [
        random.uniform(-5, 5)
    ],

    "V9": [
        random.uniform(-5, 5)
    ],

    "V10": [
        random.uniform(-5, 5)
    ],

    "V11": [
        random.uniform(-5, 5)
    ],

    "V12": [
        random.uniform(-5, 5)
    ],

    "V13": [
        random.uniform(-5, 5)
    ],

    "V14": [
        random.uniform(-5, 5)
    ],

    "V15": [
        random.uniform(-5, 5)
    ],

    "V16": [
        random.uniform(-5, 5)
    ],

    "V17": [
        random.uniform(-5, 5)
    ],

    "V18": [
        random.uniform(-5, 5)
    ],

    "V19": [
        random.uniform(-5, 5)
    ],

    "V20": [
        random.uniform(-5, 5)
    ],

    "V21": [
        random.uniform(-5, 5)
    ],

    "V22": [
        random.uniform(-5, 5)
    ],

    "V23": [
        random.uniform(-5, 5)
    ],

    "V24": [
        random.uniform(-5, 5)
    ],

    "V25": [
        random.uniform(-5, 5)
    ],

    "V26": [
        random.uniform(-5, 5)
    ],

    "V27": [
        random.uniform(-5, 5)
    ],

    "V28": [
        random.uniform(-5, 5)
    ],

    "Amount": [amount]

}

# =========================
# CREATE DATAFRAME
# =========================

df = pd.DataFrame(input_data)

# =========================
# PREDICT
# =========================

prediction = model.predict(df)[0]

model_probability = model.predict_proba(df)[0][1]

# =========================
# HYBRID RISK SIGNALS
# =========================

ml_score = float(model_probability)

# =========================
# AMOUNT RISK
# =========================

if amount < 5000:

    amount_risk = 0.10

elif amount < 20000:

    amount_risk = 0.25

elif amount < 50000:

    amount_risk = 0.50

elif amount < 100000:

    amount_risk = 0.75

else:

    amount_risk = 0.90

# =========================
# LOCATION RISK
# =========================

high_risk_locations = [

    "Russia",
    "Nigeria",
    "Unknown",
    "VPN"

]

if location.strip().lower() in [
    "russia",
    "nigeria",
    "unknown",
    "vpn"
]:

    location_risk = 0.90

else:

    location_risk = 0.15

# =========================
# TIME RISK
# =========================

current_hour = datetime.now().hour

if current_hour >= 0 and current_hour < 5:

    time_risk = 0.80

elif current_hour >= 5 and current_hour < 8:

    time_risk = 0.50

elif current_hour >= 8 and current_hour < 22:

    time_risk = 0.10

else:

    time_risk = 0.40

# =========================
# DEVICE RISK
# =========================

known_device = random.choice(
    [True, False]
)

if known_device:

    device_risk = 0.10

else:

    device_risk = 0.75

# =========================
# VELOCITY RISK
# =========================

transaction_count_last_hour = random.randint(
    1,
    20
)

if transaction_count_last_hour <= 3:

    velocity_risk = 0.10

elif transaction_count_last_hour <= 8:

    velocity_risk = 0.35

elif transaction_count_last_hour <= 15:

    velocity_risk = 0.65

else:

    velocity_risk = 0.90

# =========================
# WEIGHTED RISK AGGREGATOR
# =========================

probability = (

    ml_score * 0.40

    +

    amount_risk * 0.20

    +

    location_risk * 0.15

    +

    velocity_risk * 0.10

    +

    time_risk * 0.10

    +

    device_risk * 0.05

)

probability = min(
    probability,
    0.99
)

# =========================
# DECISION ENGINE
# =========================

# =========================
# RISK LEVEL ENGINE
# =========================

if probability >= 0.50:

    risk_level = "CRITICAL RISK"

    prediction_label = "Fraudulent"

    recommended_action = "BLOCK"

elif probability >= 0.35:

    risk_level = "HIGH RISK"

    prediction_label = "Fraudulent"

    recommended_action = "FLAG"

elif probability >= 0.25:

    risk_level = "MEDIUM RISK"

    prediction_label = "Suspicious"

    recommended_action = "REQUIRE OTP"

else:

    risk_level = "LOW RISK"

    prediction_label = "Safe Transaction"

    recommended_action = "APPROVE"

#print(
 #   "Current Hour:",
 #   current_hour
#)

#print(
 #   "Transactions Last Hour:",
 #   transaction_count_last_hour
#)

#print(
  #  "Known Device:",
 #   known_device
#)

#print(
 #   "ML:", round(ml_score,2),
  #  "Amount:", round(amount_risk,2),
   # "Location:", round(location_risk,2),
    #"Velocity:", round(velocity_risk,2),
    #"Time:", round(time_risk,2),
    #"Device:", round(device_risk,2)
#)  

# =========================
# RISK FACTORS
# =========================

risk_factors = []

if amount_risk >= 0.50:

    risk_factors.append(
        "High Transaction Amount"
    )

if location_risk >= 0.75:

    risk_factors.append(
        "High Risk Location"
    )

if time_risk >= 0.50:

    risk_factors.append(
        "Night-Time Transaction"
    )

if velocity_risk >= 0.65:

    risk_factors.append(
        "High Transaction Velocity"
    )

if device_risk >= 0.75:

    risk_factors.append(
        "Unknown Device"
    )

if ml_score >= 0.50:

    risk_factors.append(
        "ML Fraud Pattern Detected"
    )

if len(risk_factors) == 0:

    risk_factors.append(
        "No Significant Risk Factors"
    )

# =========================
# FINAL RESULT
# =========================

#print(risk_factors)

result = {

    "prediction": prediction_label,

    "risk_score": float(
        round(probability, 2)
    ),

    "confidence": float(
        round(probability * 100, 2)
    ),

    "risk_level": risk_level,

    "risk_factors": risk_factors,

    "recommended_action": recommended_action

}

print(result)

sys.stdout.flush()