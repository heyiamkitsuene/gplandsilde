/* ========= PAGE SWITCH ========= */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "map" && !window.mapLoaded) {
    initMap();
  }

  if (id === "weather") {
    loadWeather();
  }
}

/* ========= THEME SWITCH ========= */
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem("theme", theme);
}

(function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);
})();

/* ========= AI IMAGE ANALYSIS (SIMULATED) ========= */
const imageInput = document.getElementById("imageInput");
const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");
const aiResult = document.getElementById("aiResult");
const riskTip = document.getElementById("riskTip");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImage.src = reader.result;
    previewBox.classList.remove("hidden");
    runFakeAI();
  };
  reader.readAsDataURL(file);
});

function runFakeAI() {
  const results = ["無風險", "準備發生", "正在發生"];
  const result = results[Math.floor(Math.random() * results.length)];
  aiResult.textContent = `AI 判斷：${result}`;

  if (result === "無風險") {
    riskTip.textContent = "✅ 目前坡體穩定，風險偏低。";
    riskTip.style.color = "green";
  } else if (result === "準備發生") {
    riskTip.textContent = "⚠️ 發現潛在不穩定跡象，請避免靠近。";
    riskTip.style.color = "orange";
  } else {
    riskTip.textContent = "🚨 高危險！立即遠離並聯絡緊急部門。";
    riskTip.style.color = "red";
  }
}

/* ========= MAP + HEAT ZONES ========= */
function initMap() {
  window.mapLoaded = true;
  const map = L.map("mapBox").setView([22.35, 114.15], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  const riskPoints = [
    [22.37, 114.12],
    [22.41, 114.22],
    [22.32, 114.18],
    [22.28, 114.24],
    [22.44, 114.10]
  ];

  riskPoints.forEach(p => {
    L.circle(p, {
      radius: 800,
      color: "red",
      fillColor: "#f87171",
      fillOpacity: 0.4
    }).addTo(map).bindPopup("⚠️ 高風險斜坡區域");
  });
}

/* ========= REAL WEATHER API ========= */
async function loadWeather() {
  try {
    // 香港座標
    const lat = 22.3193;
    const lon = 114.1694;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&timezone=Asia%2FHong_Kong`;
    const res = await fetch(url);
    const data = await res.json();

    const temp = data.current.temperature_2m;
    const rain = data.current.precipitation;

    document.getElementById("temp").textContent = `${temp} °C`;
    document.getElementById("rain").textContent = `${rain} mm`;

    let risk;
    if (rain > 50) risk = "🚨 極高山泥傾瀉風險";
    else if (rain > 25) risk = "⚠️ 中至高風險";
    else if (rain > 10) risk = "🟡 中等風險";
    else risk = "✅ 低風險";

    document.getElementById("weatherRisk").textContent = risk;

  } catch (err) {
    document.getElementById("weatherRisk").textContent = "⚠️ 無法取得天氣資料";
    console.error(err);
  }
}
