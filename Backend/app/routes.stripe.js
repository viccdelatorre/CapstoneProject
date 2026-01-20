const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Feature flags (turn on after you enable them in Dashboard > Test mode)
const ENABLE_KLARNA = process.env.ENABLE_KLARNA === "1";
const ENABLE_ACH = process.env.ENABLE_ACH === "1"; // us_bank_account
const ENABLE_ACSS = process.env.ENABLE_ACSS === "1"; // acss_debit
const ENABLE_LINK = process.env.ENABLE_LINK !== "0"; // Link is on by default

router.post("/intent", async (req, res) => {
  try {
    const { amount, currency: rawCurrency = "usd" } = req.body || {};
    const currency = String(rawCurrency || "usd").toLowerCase();

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: "amount must be an integer in the smallest currency unit",
      });
    }

    // Start with card always
    const types = ["card"];

    // Link if enabled
    if (ENABLE_LINK) types.push("link");

    // Currency-specific methods
    if (currency === "usd") {
      if (ENABLE_KLARNA) types.push("klarna"); // Klarna only supports USD (for you)
      if (ENABLE_ACH) types.push("us_bank_account"); // ACH
    } else if (currency === "cad") {
      // IMPORTANT: no Klarna in CAD
      if (ENABLE_ACSS) types.push("acss_debit"); // Canadian PAD
    }

    // Log what we're sending to Stripe to make debugging obvious
    console.log("[PI create]", { amount, currency, types });

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: types,
      automatic_payment_methods: { enabled: false },
      payment_method_options: {
        us_bank_account: { verification_method: "automatic" },
        acss_debit: {
          mandate_options: {
            payment_schedule: "sporadic",
            transaction_type: "personal",
          },
        },
      },
    });

    return res.json({ clientSecret: pi.client_secret });
  } catch (e) {
    // Surface Stripe's real message
    const msg = e?.raw?.message || e.message || "Stripe error";
    console.error("Stripe PI create error:", msg);
    return res.status(400).json({ error: msg });
  }
});

module.exports = router;
