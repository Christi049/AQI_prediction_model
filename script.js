let chart;

Promise.all([
    fetch("historical.json").then(res => res.json()),
    fetch("forecast.json").then(res => res.json())
]).then(([historicalData, forecastData]) => {

    const citySelect = document.getElementById("citySelect");
    const adviceEl = document.getElementById("adviceText");

    // Populate city dropdown
    const cities = [...new Set(historicalData.map(d => d.City))];
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    function updateUIForCity(selectedCity) {
        const hist = historicalData.filter(d => d.City === selectedCity);
        const fore = forecastData.filter(d => d.City === selectedCity);

        const dates = [...hist.map(d => d.Date), ...fore.map(d => d.Date)];
        const formattedDates = dates.map(d => {
            const date = new Date(d);
            return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        });

        const historicalValues = hist.map(d => d.AQI);
        const forecastValues = fore.map(d => d.Predicted_AQI);

        // Update chart
        updateChart(formattedDates, historicalValues, forecastValues);

        // Update advisory
        checkAQIPrecautions(historicalValues, forecastValues);
    }

    // Listener for city change
    citySelect.addEventListener("change", function() {
        const selectedCity = this.value;
        if (!selectedCity) {
            adviceEl.textContent = "Please select a city.";
            return;
        }
        updateUIForCity(selectedCity);
    });

    // Trigger initial selection (first city)
    if (cities.length > 0) {
        citySelect.value = cities[0];
        updateUIForCity(cities[0]);
    } else {
        adviceEl.textContent = "No city data available.";
    }

}).catch(err => {
    console.error("Failed to fetch data:", err);
    document.getElementById("adviceText").textContent = "Failed to fetch data.";
});

// Chart update function
function updateChart(dates, historical, forecasted) {
    const ctx = document.getElementById("aqiChart").getContext("2d");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                { label: "Historical AQI", data: historical, borderColor: "blue", fill: false, tension: 0.3 },
                { label: "Forecasted AQI", data: [...Array(historical.length).fill(null), ...forecasted], borderColor: "red", borderDash:[5,5], fill:false, tension:0.3 }
            ]
        },
        options: { responsive:true, interaction:{mode:'index', intersect:false} }
    });
}

// Advisory function
// Advisory function
function checkAQIPrecautions(historical, forecasted) {
    const adviceEl = document.getElementById("adviceText");

    if (!forecasted || forecasted.length === 0) {
        adviceEl.innerHTML = "<b>No forecast data available for this city.</b>";
        return;
    }

    const latestAQI = forecasted[forecasted.length - 1];
    let category = "";
    if(latestAQI <= 50) category = "Good";
    else if(latestAQI <= 100) category = "Moderate";
    else if(latestAQI <= 150) category = "Unhealthy";
    else if(latestAQI <= 200) category = "Severe";
    else if(latestAQI <= 300) category = "Poor";
    else category = "Hazardous";

    const prompt = `The current AQI is ${latestAQI}, which falls under "${category}" category. What precautions should the public take? Include vulnerable populations. Limit each subtopic to 3 points.`;

    adviceEl.innerHTML = `<b>Fetching AQI precautions for ${category}...</b>`;

    getLLMAdvice(prompt).then(advice => {
        const adviceEl = document.getElementById("adviceText");
        adviceEl.innerHTML = marked.parse(advice); // converts markdown → HTML
    });
}

// Backend fetch
async function getLLMAdvice(prompt) {
    try {
        const response = await fetch("http://localhost:3000/ask-aqi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // Check if backend returned answer
        if (data?.answer && data.answer.trim() !== "") {
            return data.answer;
        } else {
            console.warn("No answer from backend. Using fallback.");
            return fallbackAdvice(prompt);
        }

    } catch (err) {
        console.error("Backend fetch error:", err);
        return fallbackAdvice(prompt);
    }
}

// Fallback advice based on category
function fallbackAdvice(category) {
    const advices = {
        "Good": [
            "Air quality is good. Safe for everyone."
        ],
        "Moderate": [
            "Air quality is moderate.",
            "Unusually sensitive people should limit prolonged outdoor exertion."
        ],
        "Unhealthy": [
            "Air quality is unhealthy.",
            "Sensitive groups should reduce outdoor activity.",
            "Others may experience minor health effects."
        ],
        "Severe": [
            "Air quality is severe.",
            "Everyone should reduce outdoor exposure.",
            "Sensitive groups should stay indoors."
        ],
        "Poor": [
            "Air quality is poor.",
            "Everyone should minimize outdoor activity.",
            "Use air purifiers if available."
        ],
        "Hazardous": [
            "Air quality is hazardous.",
            "Stay indoors, avoid all outdoor activity.",
            "Use air purifiers and wear N95 masks if you go outside."
        ]
    };

    return (advices[category] || ["Air quality advisory: take general precautions."]).join("\n");
}