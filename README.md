# 🌫️ AQI Forecast Dashboard

> Visualize air quality trends and get AI-powered precautionary guidance based on predicted AQI values.

---

## 📌 Project Description

The AQI Forecast Dashboard combines historical air quality data with machine learning forecasts and LLM-generated health advisories in one clean interface.

**Workflow:**

1. **Historical Data** — Uses AQI data from 2015–2020
2. **SARIMA Forecast** — A SARIMA model trained on this dataset predicts AQI values for 2021
3. **Visualization** — Historical and forecasted AQI values are displayed in a line chart using Chart.js
4. **Precaution Advisory** — The latest predicted AQI value is sent to an LLM to generate formatted advice:
   - Recommended precautions for the public
   - Identification of vulnerable populations
   - AQI categorization (Good / Moderate / Unhealthy / Poor / Severe / Hazardous)
5. **Fallback Mechanism** — If the LLM is unavailable, predefined category-based advice is shown instead

> ⚠️ **Current Limitation:** The system visualizes a precomputed 2021 forecast rather than generating live predictions from user input.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML, CSS, JavaScript, Chart.js, Marked.js |
| **Backend** | Node.js, Express.js |
| **Machine Learning** | Python, SARIMA (trained in Google Colab) |
| **LLM Integration** | OpenRouter API |
| **Data** | Historical AQI (2015–2020), Forecasted AQI (2021) | Dataset Link : [link text](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india)|

---

## ✨ Features

- **City-based AQI Visualization** — Select a city to view historical + forecasted AQI in a line chart
- **AI Precautionary Advisory** — LLM generates real-time advice based on the latest predicted AQI
- **Vulnerable Populations Highlight** — Identifies at-risk groups during high AQI conditions
- **Fallback Advisory System** — Provides default guidance when the LLM API is unavailable
- **Clean Advice Display** — Markdown-rendered advice shown in a readable, well-formatted layout

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/aqi-forecast-dashboard.git
cd aqi-forecast-dashboard
```

### 2. Install commands

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3000
```

### 4. (Optional) Install Python Dependencies

Only required if you want to retrain the SARIMA model:

```bash
pip install -r requirements.txt
```

---

## ▶️ Run commands

### Start the Backend Server

```bash
node server.js
```

### Open the Frontend

Open `index.html` directly in your browser.

> ⚠️ Make sure the backend is running on the same port as your fetch requests (default: `localhost:3000`).

---

## 📸 Screenshots

![Dashboard Overview](https://github.com/user-attachments/assets/94c99c79-3597-4f85-bac2-cfc3fb9b580b)

![City AQI Chart](https://github.com/user-attachments/assets/5e1b43a8-32ac-4326-90df-263c90b73bc4)

![Advisory Panel](https://github.com/user-attachments/assets/415f6611-5466-497e-a169-b55e4f88bea3)

![Vulnerable Populations](https://github.com/user-attachments/assets/cbcc529c-be15-4d86-89f7-0bcfe663f70a)

## 📸 Demo video link

[link text](https://drive.google.com/file/d/1q3EMMqzP04QaIBtViu1fFMO7YglSW3Xc/view?usp=drive_link)

## 🏗️ Architecture

```
[ Historical AQI Data (2015–2020) ]
              │
              ▼
        [ SARIMA Model ]
              │
              ▼
 [ Forecasted AQI 2021 (CSV File) ]
              │
              ▼
        [ Frontend UI ]
  (HTML / CSS / Chart.js / JS Logic)
              │
              ▼
 [ Latest Forecasted AQI ] ──────► [ LLM API (OpenRouter) ]
                                              │
                                              ▼
                               [ Advisory + Vulnerable Populations ]
```

---

## 📡 API Reference

### `POST /ask-aqi`

Sends an AQI prompt to the LLM and returns health advisory text.

**Request Body:**

```json
{
  "prompt": "The current AQI is 120, which falls under the Unhealthy category. What precautions should the public take?"
}
```

**Response:**

```json
{
  "answer": "AQI is unhealthy. Sensitive groups should reduce outdoor activity. Everyone else may experience minor health effects.",
  "raw": { }
}
```

---

## 🔗 Live Demo

[**Prediction model →**](https://colab.research.google.com/drive/1STjMNUOPjy_yUS8MbgJh_Ut1iPpw53QB?usp=sharing)
[**View Live Demo →**](https://aqipredict2.netlify.app/)
