const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

// Feature flags
const ENABLE_KLARNA = process.env.ENABLE_KLARNA === "1";
const ENABLE_ACH = process.env.ENABLE_ACH === "1";
const ENABLE_ACSS = process.env.ENABLE_ACSS === "1";
const ENABLE_LINK = process.env.ENABLE_LINK !== "0";

router.post("/intent", async (req, res) => {
  try {
    const { amount, currency: rawCurrency = "usd" } = req.body || {};
    const currency = String(rawCurrency).toLowerCase();

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: "amount must be an integer in the smallest currency unit",
      });
    }

    if (!stripe) {
      // Return a fake client secret for frontend testing
      console.log("[PI create] Stripe not configured, returning fake clientSecret");
      return res.json({ clientSecret: "fake_client_secret_for_testing" });
    }

    // Start with card always
    const types = ["card"];
    if (ENABLE_LINK) types.push("link");
    if (currency === "usd") {
      if (ENABLE_KLARNA) types.push("klarna");
      if (ENABLE_ACH) types.push("us_bank_account");
    } else if (currency === "cad") {
      if (ENABLE_ACSS) types.push("acss_debit");
    }

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
    const msg = e?.raw?.message || e.message || "Stripe error";
    console.error("Stripe PI create error:", msg);
    return res.status(400).json({ error: msg });
  }
});

module.exports = router;
