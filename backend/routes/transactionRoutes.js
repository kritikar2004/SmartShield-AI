const express = require("express");


const router = express.Router();


const Transaction =
require("../models/Transaction");

const {spawn} = require("child_process");

/* =========================
   FRAUD ANALYSIS API
========================= */

router.post("/analyze", async (req, res) => {

  try {

    const {

      transactionId,
      amount,
      location

    } = req.body;

    /* =========================
       RUN PYTHON AI MODEL
    ========================= */

    const pythonProcess = spawn(

      "python",

      [

        "ai/predict.py",

        amount.toString(),
        location

      ]

    );

    let resultData = "";

    /* =========================
       RECEIVE PYTHON OUTPUT
    ========================= */

    pythonProcess.stdout.on(

      "data",

      (data) => {

        resultData += data.toString();

      }

    );

    /* =========================
       HANDLE ERRORS
    ========================= */

    pythonProcess.stderr.on(

      "data",

      (data) => {

        console.log(
          "Python Error:",
          data.toString()
        );

      }

    );

    /* =========================
       WHEN PYTHON PROCESS ENDS
    ========================= */

    pythonProcess.on(

      "close",

      async () => {

        console.log(
          "Python Output:",
          resultData
        );

        const predictionResult =
eval("(" + resultData + ")");




        //const predictionResult =
         //eval("(" + resultData + ")");

        /* =========================
           SAVE TRANSACTION
        ========================= */

        const newTransaction =
        new Transaction({

          transactionId,
          amount,
          location,

          status:
          predictionResult.prediction,

          risk_score:
          predictionResult.risk_score,

          confidence:
          predictionResult.confidence,
          risk_level:
          predictionResult.risk_level,
          recommended_action:
          predictionResult.recommended_action,
          risk_factors:
          predictionResult.risk_factors

        });

        await newTransaction.save();

/* =========================
   RISK LEVEL ENGINE
========================= */

let riskLevel = "";

if (
  predictionResult.risk_score <= 0.30
) {

  riskLevel =
  "LOW RISK";

}

else if (
  predictionResult.risk_score <= 0.60
) {

  riskLevel =
  "MEDIUM RISK";

}

else if (
  predictionResult.risk_score <= 0.85
) {

  riskLevel =
  "HIGH RISK";

}

else {

  riskLevel =
  "CRITICAL RISK";

}

        /* =========================
           SEND RESPONSE
        ========================= */

        res.json({

  status:
  predictionResult.prediction,

  risk_score:
  predictionResult.risk_score,

  confidence:
  predictionResult.confidence,

  risk_level:
  predictionResult.risk_level,

  risk_factors:
  predictionResult.risk_factors,

  recommended_action:
  predictionResult.recommended_action,

  risk_factors:
  predictionResult.risk_factors,

  color:

  predictionResult.prediction ===
  "Fraudulent"

  ? "red"

  : "lightgreen"

});

      }

    );

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Server Error"

    });

  }

});

/* =========================
   GET ALL TRANSACTIONS
========================= */

router.get("/transactions", async (req, res) => {

  const transactions =
    await Transaction.find().sort({
      createdAt: -1
    });

  res.json(transactions);

});

/* =========================
   GET FRAUD ALERTS
========================= */

router.get("/alerts", async (req, res) => {

  try {

    const alerts =
  await Transaction.find({

    risk_level: {

      $in: [

        "HIGH RISK",
        "CRITICAL RISK"

      ]

    }

  }).sort({

    createdAt: -1

  });

    res.json(alerts);

  }

  catch (error) {

    res.status(500).json({

      message: "Error fetching alerts"

    });

  }

});

/* =========================
   DASHBOARD STATS API
========================= */

router.get("/dashboard-stats", async (req, res) => {

  try {

    const transactions =
      await Transaction.find();

    const totalTransactions =
      transactions.length;

    const fraudAlerts =
      transactions.filter(

        transaction =>

          transaction.risk_level ===
          "HIGH RISK"

          ||

          transaction.risk_level ===
          "CRITICAL RISK"

      ).length;

    let totalConfidence = 0;

    transactions.forEach(

      transaction => {

        totalConfidence +=

          transaction.confidence || 0;

      }

    );

    const averageConfidence =

      transactions.length > 0

      ? Math.round(

          totalConfidence /

          transactions.length

        )

      : 0;

    res.json({

      totalTransactions,

      fraudAlerts,

      accuracyRate:
      averageConfidence

    });

  }

  catch (error) {

  console.log(
    "DASHBOARD ERROR:",
    error
  );

  res.status(500).json({

    message:
    "Error fetching dashboard stats"

  });

}
});

/* =========================
   CHART DATA API
========================= */

router.get("/chart-data", async (req, res) => {

  try {

    const transactions =
      await Transaction.find();

    const lowRiskCount =
  transactions.filter(

    (transaction) =>

      transaction.risk_level ===
      "LOW RISK"

  ).length;

const mediumRiskCount =
  transactions.filter(

    (transaction) =>

      transaction.risk_level ===
      "MEDIUM RISK"

  ).length;

const highRiskCount =
  transactions.filter(

    (transaction) =>

      transaction.risk_level ===
      "HIGH RISK"

  ).length;

const criticalRiskCount =
  transactions.filter(

    (transaction) =>

      transaction.risk_level ===
      "CRITICAL RISK"

  ).length;

res.json({

  lowRiskCount,

  mediumRiskCount,

  highRiskCount,

  criticalRiskCount,

  totalTransactions:
  transactions.length

});

  }

  catch (error) {

    res.status(500).json({

      message:
      "Error fetching chart data"

    });

  }

});

router.get("/fraud-intelligence", async (req, res) => {

  try {

    const transactions =
      await Transaction.find();

    /* =====================
       TOP LOCATIONS
    ===================== */

    const locationCounts = {};

    transactions.forEach((transaction) => {

      if (!transaction.location) return;

      locationCounts[
        transaction.location
      ] =
        (locationCounts[
          transaction.location
        ] || 0) + 1;

    });

    const topLocations =
      Object.entries(
        locationCounts
      )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 5);

    /* =====================
       RISK FACTORS
    ===================== */

    const factorCounts = {};

    transactions.forEach((transaction) => {

      if (
        !transaction.risk_factors
      ) return;

      transaction.risk_factors
        .forEach((factor) => {

          factorCounts[factor] =
            (factorCounts[factor] || 0) + 1;

        });

    });

    const topRiskFactors =
      Object.entries(
        factorCounts
      )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 5);

    /* =====================
       HIGHEST RISK TXN
    ===================== */

    const highestRiskTransaction =
      transactions.sort(

        (a, b) =>

          b.risk_score -
          a.risk_score

      )[0];

    res.json({

      topLocations,

      topRiskFactors,

      highestRiskTransaction

    });

  }

  catch (error) {

    res.status(500).json({

      message:
      "Error generating intelligence"

    });

  }

});

/* =========================
   RESET DASHBOARD
========================= */

router.delete("/reset-dashboard", async (req, res) => {

  try {

    await Transaction.deleteMany({});

    res.json({

      message:
      "Dashboard Reset Successful"

    });

  }

  catch (error) {

    res.status(500).json({

      message:
      "Reset Failed"

    });

  }

});

module.exports = router;