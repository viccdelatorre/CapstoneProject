const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV } = process.env;
const base =
  PAYPAL_ENV === "live"
    ? "https://api.paypal.com"
    : "https://api.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const resp = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PayPal token error ${resp.status} ${text}`);
  }
  const data = await resp.json();
  return data.access_token;
}

router.post("/order", async (req, res) => {
  try {
    const { amount, currency = "USD" } = req.body || {};
    if (!amount) return res.status(400).json({ error: "amount required" });

    const token = await getAccessToken();
    const resp = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: String((amount / 100).toFixed(2)),
            },
          },
        ],
      }),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data });
    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message || "PayPal order failed" });
  }
});

router.post("/capture", async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ error: "orderId required" });

    const token = await getAccessToken();
    const resp = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data });
    res.json({ status: data.status });
  } catch (err) {
    res.status(500).json({ error: err.message || "PayPal capture failed" });
  }
});

module.exports = router;
