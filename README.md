# Intelligent-Real-Estate-Advisor

A smart web application that predicts property prices, analyzes affordability, and recommends ideal locations using Machine Learning. Built with **Flask** and a dynamic frontend using **HTML/CSS/JS**.

---

## 🚀 Features

- 🔮 Predict property prices based on city, BHK, and location
- 💰 Calculate affordability score from annual salary
- 📍 Get location suggestions within your budget
- 📊 Visualize price predictions with charts
- 🧠 Uses ML model trained on Indian real estate data

---

## 🛠️ Tech Stack

| Layer       | Tech Used                         |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, JavaScript (ES6), Chart.js |
| Backend    | Python, Flask                     |
| ML Engine  | Custom models in `model/predictor.py` |
| Styling    | Custom CSS                        |

---

## 📂 Project Structure

```
intelligent-real-estate-advisor/
│
├── app.py                      # Flask backend
├── model/
│   └── predictor.py            # ML logic: predictions, affordability, suggestions
│
├── templates/
│   └── index.html              # Main user interface
│
├── static/
│   ├── style.css               # UI styles
│   └── main.js                 # Frontend logic
│
└── README.md                   # Project info
```

---

## 🧪 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/roytechub/Intelligent-Real-Estate-Advisor.git
cd Intelligent-Real-Estate-Advisor
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 3️⃣ Install Requirements

```bash
pip install flask
```

> Optionally create a `requirements.txt` with:
```bash
pip freeze > requirements.txt
```

### 4️⃣ Run the App

```bash
python app.py
```

Visit: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🧠 How It Works

### 🔍 Machine Learning Model

Trained on historical Indian real estate data. It considers:

- Location & BHK
- Market trends
- Area and amenities

### 💸 Affordability Analysis

We follow the **30% rule**: Your EMI should not exceed 30% of monthly salary. Max loan is calculated using:

- 7% interest rate
- 20-year loan term
- 20% down payment

### 📍 Location Suggestions

Based on:

- Budget
- Preferred location
- Distance, safety, future value

---

## 🤝 Contributing

Pull requests are welcome. Open issues for suggestions or bugs. 
**Support Us**
https://aniclothe.roytechub.com/

---

## ☺️ Happy Coading
