# SmartShield AI

An AI-powered fraud detection and transaction monitoring platform built using Python, Machine Learning, Node.js, Express.js, MongoDB, and Chart.js.

## Overview

SmartShield AI analyzes transactions in real time and calculates fraud risk using a hybrid risk engine that combines Machine Learning predictions with business rules such as transaction amount, location risk, device trust, transaction velocity, and time-based anomalies.

The system stores transactions in MongoDB and visualizes fraud intelligence through a live monitoring dashboard.

---

## Features

### Fraud Detection Engine

* Machine Learning based fraud prediction
* Amount risk analysis
* Location risk analysis
* Device risk analysis
* Transaction velocity analysis
* Time-based anomaly detection

### Risk Classification

* LOW RISK
* MEDIUM RISK
* HIGH RISK
* CRITICAL RISK

### Automated Actions

* APPROVE
* REQUIRE OTP
* FLAG
* BLOCK

### Dashboard Analytics

* Total Transactions
* Fraud Alerts
* Average Confidence
* Transaction History
* Fraud Analytics Charts
* Fraud Intelligence Panel

### Fraud Intelligence

* Top Risky Locations
* Most Common Risk Factors
* Highest Risk Transaction

### Transaction Simulator

* Generate bulk synthetic transactions
* Real-time dashboard updates
* Stress testing environment

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* Chart.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Machine Learning

* Python
* Scikit-Learn
* Pandas
* Joblib

---

## System Architecture

Transaction Input
↓
Fraud Detection Engine
↓
Risk Aggregator
↓
MongoDB Storage
↓
Dashboard Analytics
↓
Fraud Intelligence Layer

---

## Installation

### Clone Repository

git clone <repository-url>

### Install Backend Dependencies

npm install

### Start MongoDB

Make sure MongoDB is running locally.

### Start Backend Server

npm start

### Open Frontend

Open:

* index.html
* dashboard.html

in your browser.

---

## Screenshots

* Dashboard
* Fraud Intelligence
* Analytics Charts
* Transaction Simulator

---

## Future Improvements

* Kafka Event Streaming
* Real Device Fingerprinting
* Real Geo-Location Risk Scoring
* Real Payment Gateway Integration
* Cloud Deployment
* Real-Time Notification Service

---

## Author

Krish Kritikar

Computer Engineering Student

Pune, India
