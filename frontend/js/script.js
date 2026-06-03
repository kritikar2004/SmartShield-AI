

/* =========================
   GLOBAL CHART VARIABLES
========================= */

let transactionChartInstance;

let riskChartInstance;

/* =========================
   FRAUD DETECTION FUNCTION
========================= */

async function analyzeTransaction() {

  const transactionId =
    document.getElementById("transactionId").value;

  const amount =
    document.getElementById("amount").value;

  const location =
    document.getElementById("location").value;

  const resultText =
    document.getElementById("resultText");

  /* Validation */

  /* Validation */

if (
  transactionId === "" ||
  amount === "" ||
  location === ""
) {

  resultText.innerHTML =
    "Please fill all transaction details.";

  resultText.style.color =
    "orange";

  return;

}

  try {

    /* Send Data To Backend */

    const response =
      await fetch(
        "http://localhost:5000/analyze",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            transactionId,
            amount: Number(amount),
            location

          })

        }
      );

    const data =
      await response.json();


    /* Display Result */

resultText.innerHTML = `

<div class="result-card">

  <h2>
    ${data.status}
  </h2>

  <br>

  <strong>
    Risk Score:
  </strong>

  ${data.risk_score}

  <br><br>

  <strong>
    Confidence:
  </strong>

  ${data.confidence}%

  <br><br>

  <strong>
    Risk Level:
  </strong>

  <span class="risk-level ${

(data.risk_level || "LOW RISK")

.replace(/\s/g, '-')

.toLowerCase()

}">

  ${data.risk_level}

</span>

    ${data.risk_level}

  </span>

  <br><br>

  <strong>
    Recommended Action:
  </strong>

  ${data.recommended_action}

  <br><br>

Top Risk Factors:

<br>

• ${data.risk_factors.join("<br>• ")}

</div>

`;


resultText.style.color =
data.color;

  }

  catch(error) {

    console.log(error);
    resultText.innerHTML =
    "Server Error";

    resultText.style.color = "red";
  }
  }

/* =========================
   LOAD DYNAMIC CHARTS
========================= */

async function loadCharts() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/chart-data"
      );

    const data =
      await response.json();


    /* =========================
       BAR CHART
    ========================= */

    const transactionChart =
      document.getElementById(
        "transactionChart"
      );

    if (transactionChart) {

      /* Destroy old chart */

if (transactionChartInstance) {

  transactionChartInstance.destroy();

}

/* Create new chart */

transactionChartInstance =
new Chart(transactionChart, {

        type: "bar",

        data: {

          labels: [

  "LOW",

  "MEDIUM",

  "HIGH",

  "CRITICAL"

],

          datasets: [{

            label: "Transactions",

            data: [

  data.lowRiskCount,

  data.mediumRiskCount,

  data.highRiskCount,

  data.criticalRiskCount

],

            backgroundColor: [
              "cyan",
              "#00bfff",
              "#7c3aed",
              "#06b6d4",
              "#3b82f6",
              "#8b5cf6",
              "#22d3ee"
            ]

          }]

        }

      });

    }

    /* =========================
       PIE CHART
    ========================= */

    const riskChart =
      document.getElementById(
        "riskChart"
      );

    if (riskChart) {

      /* Destroy old chart */

if (riskChartInstance) {

  riskChartInstance.destroy();

}

/* Create new chart */

riskChartInstance =
new Chart(riskChart, {

        type: "pie",

        data: {

          labels: [

  "LOW RISK",

  "MEDIUM RISK",

  "HIGH RISK",

  "CRITICAL RISK"

],

          datasets: [{

            data: [

  data.lowRiskCount,

  data.mediumRiskCount,

  data.highRiskCount,

  data.criticalRiskCount

],

            backgroundColor: [

  "#22c55e",

  "#facc15",

  "#f97316",

  "#ef4444"

]

          }]

        }

      });

    }

  }

  catch (error) {

    console.log(error);

  }

}

/* Run Charts */

loadCharts();

/* =========================
   FETCH TRANSACTION HISTORY
========================= */

async function loadTransactions() {

  const tableBody =
    document.getElementById(
      "transactionTableBody"
    );

  /* Prevent errors on other pages */

  if (!tableBody) return;

  try {

    const response =
      await fetch(
        "http://localhost:5000/transactions"
      );

    const transactions =
      await response.json();


    tableBody.innerHTML = "";

    transactions.forEach((transaction) => {

      let riskClass = "";

      if (
        transaction.status === "High Risk"
      ) {

        riskClass = "high-risk";

      }

      else {

        riskClass = "low-risk";

      }

      tableBody.innerHTML += `

        <tr>

  <td>
    ${transaction.transactionId || "N/A"}
  </td>

  <td>
    $${transaction.amount || 0}
  </td>

  <td>
    ${transaction.status || "Unknown"}
  </td>

  <td>
    ${transaction.risk_score ?? 0}
  </td>

  <td>
    ${transaction.confidence ?? 0}%
  </td>

  <td>

    <span class="risk-level ${

      (transaction.risk_level || "LOW RISK")

      .replace(/\s/g, '-')

      .toLowerCase()

    }">

      ${transaction.risk_level || "LOW RISK"}

    </span>

  </td>

  <td>
    ${transaction.recommended_action || "APPROVE"}
  </td>

</tr>

      `;

    });

  }

  catch (error) {

    console.log(error);

  }

}

/* Run Function */

loadTransactions();

/* =========================
   LOAD FRAUD ALERTS
========================= */

async function loadAlerts() {

  const alertsContainer =
    document.getElementById(
      "alertsContainer"
    );

  /* Prevent errors on other pages */

  if (!alertsContainer) return;

  try {

    const response =
      await fetch(
        "http://localhost:5000/alerts"
      );

    const alerts =
      await response.json();

    alertsContainer.innerHTML = "";

    /* No alerts */

    if (alerts.length === 0) {

      alertsContainer.innerHTML = `

        <div class="alert-box">

          No fraud alerts detected.

        </div>

      `;

      return;

    }

    /* Display alerts */

    alerts.forEach((alert) => {

  let alertIcon = "⚠️";

  if (
    alert.risk_level ===
    "CRITICAL RISK"
  ) {

    alertIcon = "🚨";

  }

  alertsContainer.innerHTML += `

    <div class="
  alert-box
  ${
    alert.risk_level ===
    "CRITICAL RISK"

    ? "critical-risk-alert"

    : "high-risk-alert"
  }
">

      <h3>
        ${alertIcon}
        ${alert.risk_level}
      </h3>

      <p>
        Amount:
        <strong>
          ₹${alert.amount}
        </strong>
      </p>

      <p>
        Location:
        <strong>
          ${alert.location}
        </strong>
      </p>

      <p>
        Risk Score:
        <strong>
          ${alert.risk_score}
        </strong>
      </p>

      <p>
        Action:
        <strong>
          ${alert.recommended_action}
        </strong>
      </p>

    </div>

  `;

});
  }

  catch (error) {

    console.log(error);

  }

}

/* Run Alerts Function */

loadAlerts();

/* =========================
   LOAD DASHBOARD STATS
========================= */

async function loadDashboardStats() {

  const totalTransactions =
    document.getElementById(
      "totalTransactions"
    );

  const fraudAlerts =
    document.getElementById(
      "fraudAlerts"
    );

  const accuracyRate =
    document.getElementById(
      "accuracyRate"
    );

  /* Prevent errors on other pages */

  if (
    !totalTransactions ||
    !fraudAlerts ||
    !accuracyRate
  ) return;

  try {

    const response =
      await fetch(
        "http://localhost:5000/dashboard-stats"
      );

    const stats =
      await response.json();

    /* Update Cards */

    totalTransactions.innerHTML =
      stats.totalTransactions;

    fraudAlerts.innerHTML =
      stats.fraudAlerts;

    accuracyRate.innerHTML =
      stats.accuracyRate + "%";

  }

  catch (error) {

    console.log(error);

  }

}

/* Run Dashboard Stats */

loadDashboardStats();

async function loadFraudIntelligence() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/fraud-intelligence"
      );

    const data =
      await response.json();

    /* =====================
       TOP LOCATIONS
    ===================== */

    const topLocations =
      document.getElementById(
        "topLocations"
      );

    if (topLocations) {

      topLocations.innerHTML =
        data.topLocations
          .map(

            (item) =>

              `<p>
                ${item[0]}
                (${item[1]})
              </p>`

          )
          .join("");

    }

    /* =====================
       TOP RISK FACTORS
    ===================== */

    const topRiskFactors =
      document.getElementById(
        "topRiskFactors"
      );

    if (topRiskFactors) {

      topRiskFactors.innerHTML =
        data.topRiskFactors
          .map(

            (item) =>

              `<p>
                ${item[0]}
                (${item[1]})
              </p>`

          )
          .join("");

    }

    /* =====================
       HIGHEST RISK TXN
    ===================== */

    const highestRiskTransaction =
      document.getElementById(
        "highestRiskTransaction"
      );

    if (
      highestRiskTransaction &&
      data.highestRiskTransaction
    ) {

      highestRiskTransaction.innerHTML = `

        <p>
          ID:
          ${data.highestRiskTransaction.transactionId}
        </p>

        <p>
          Risk Score:
          ${data.highestRiskTransaction.risk_score}
        </p>

        <p>
          Action:
          ${data.highestRiskTransaction.recommended_action}
        </p>

      `;

    }

  }

  catch (error) {

    console.error(
  "Fraud Intelligence Error:",
  error
);

  }

}



loadFraudIntelligence();

async function generateTransactions() {

  let normalCount = 0;

  let suspiciousCount = 0;
  let fraudulentCount = 0;

  const normalLocations = [

    "India",
    "India",
    "India",
    "USA",
    "UK"

  ];

  const riskyLocations = [

    "Russia",
    "Nigeria",
    "VPN"

  ];

  for (

    let i = 1;

    i <= 50;

    i++

  ) {

    const pattern =
      Math.random();

    let amount;

    let location;

    /* =====================
       NORMAL CUSTOMER
    ===================== */

    if (pattern < 0.70) {

      normalCount++;

      amount =

        Math.floor(
          Math.random() * 10000
        ) + 100;

      location =

        normalLocations[

          Math.floor(

            Math.random() *
            normalLocations.length

          )

        ];

    }

    /* =====================
       SUSPICIOUS CUSTOMER
    ===================== */

    else if (pattern < 0.90) {

      suspiciousCount++;

      amount =

        Math.floor(
          Math.random() * 40000
        ) + 10000;

      location =

        normalLocations[

          Math.floor(

            Math.random() *
            normalLocations.length

          )

        ];

    }

    /* =====================
       FRAUD BURST
    ===================== */

    else {

      fraudulentCount++;

      amount =

        Math.floor(
          Math.random() * 70000
        ) + 50000;

      location =

        riskyLocations[

          Math.floor(

            Math.random() *
            riskyLocations.length

          )

        ];

    }

    const transaction = {

      transactionId:

        "SIM" +
        Date.now() +
        i,

      amount,

      location

    };

    try {

      await fetch(

        "http://localhost:5000/analyze",

        {

          method: "POST",

          headers: {

            "Content-Type":
            "application/json"

          },

          body: JSON.stringify(
            transaction
          )

        }

      );

    }

    catch (error) {

      console.log(error);

    }

  }

  alert(

`Simulation Complete

Normal Transactions:
${normalCount}

Suspicious Transactions:
${suspiciousCount}

Fraudulent Transactions:
${fraudulentCount}`

);

}

/* =========================
   RESET DASHBOARD
========================= */

async function resetDashboard() {

  const confirmReset = confirm(

    "Delete all transactions?"

  );

  if (!confirmReset) {

    return;

  }

  try {

    const response =
      await fetch(

        "http://localhost:5000/reset-dashboard",

        {

          method: "DELETE"

        }

      );

    const data =
      await response.json();

    alert(data.message);

    loadTransactions();

    loadAlerts();

    loadDashboardStats();

    loadCharts();

    loadFraudIntelligence();

  }

  catch (error) {

    console.log(error);

  }

}

/* =========================
   LIVE DASHBOARD MONITORING
========================= */

setInterval(() => {



  /* Refresh Transactions */

  loadTransactions();

  /* Refresh Alerts */

  loadAlerts();

  /* Refresh Dashboard Stats */

  loadDashboardStats();
  loadCharts();
  loadFraudIntelligence();

}, 5000);