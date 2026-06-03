const mongoose = require("mongoose");

/* =========================
   TRANSACTION SCHEMA
========================= */

const transactionSchema =
new mongoose.Schema({

  transactionId: String,

  amount: Number,

  location: String,

  status: String,

  risk_score: Number,
  confidence: Number,
  risk_level: String,
  recommended_action: String,
  risk_factors: [String],

  createdAt: {

    type: Date,

    default: Date.now

  }

});

/* =========================
   EXPORT MODEL
========================= */

module.exports =
mongoose.model(
  "Transaction",
  transactionSchema
);