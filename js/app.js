window.addEventListener("load", function () {
  displayHistory();
});
function saveReading() {
  const temp = document.getElementById("temp").value;
  const pH = document.getElementById("pH").value;
  const ammonia = document.getElementById("ammonia").value;
  const nitrate = document.getElementById("nitrate").value;

  let warnings = [];

  // Temperature check (tropical fish: 76-82°F)
  if (temp < 76 || temp > 82) {
    warnings.push(`⚠️ Temperature ${temp}°F is out of range!`);
  }

  // pH check (most fish: 7.8-8.5)
  if (pH < 7.8 || pH > 8.5) {
    warnings.push(`⚠️ pH ${pH} is dangerous!`);
  }

  // Ammonia MUST be 0
  if (ammonia > 0) {
    warnings.push(`🚨 CRITICAL: Ammonia detected (${ammonia} ppm)!`);
  }

  // Nitrate check
  if (nitrate > 20) {
    warnings.push(`⚠️ High nitrates (${nitrate} ppm)!`);
  }

  const warningsDiv = document.getElementById("warnings");
  if (warnings.length > 0) {
    warningsDiv.innerHTML = warnings.join("<br>");
    warningsDiv.style.color = "red";
  } else {
    warningsDiv.innerHTML = "✅ All parameters safe";
    warningsDiv.style.color = "green";
  }

  const reading = {
    date: new Date().toLocaleString(),
    temp: temp,
    oH: pH,
    ammonia: ammonia,
    nitrate: nitrate,
  };

  let history = JSON.parse(localStorage.getItem("tankHistory")) || [];
  history.push(reading);
  localStorage.setItem("tankHistory", JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("tankHistory")) || [];
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "<h3> Recent Readings </h3>";

  const recentReadings = history.slice(-5);

  if (recentReadings.length == 0) {
    historyDiv.innerHTML = "<p> No readings yet</p>";
    return;
  }

  recentReadings.forEach((reading) => {
    historyDiv.innerHTML += `<div class="history-item">
    <strong>${reading.date}</strong><br>
    Temp: ${reading.temp}F | 
    pH: ${reading.pH} | 
    NH3: ${reading.ammonia} |
    NO3: ${reading.nitrate}
    </div}`;
  });

  let clearBtn = document.createElement("button");
  clearBtn.innerHTML = "Clear History";
  clearBtn.onclick = function () {
    localStorage.removeItem("tankHistory");
    displayHistory();
  };
  historyDiv.appendChild(clearBtn);
}
