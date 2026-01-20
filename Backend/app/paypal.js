// Uses global fetch (Node 18+)
const PAYPAL_BASE =
  (process.env.PAYPAL_ENV || "sandbox").toLowerCase() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function getCreds() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in backend .env"
    );
  }
  return { id, secret };
}

async function getAccessToken() {
  const { id, secret } = getCreds();
  const resp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString(
        "base64"
      )}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PayPal OAuth failed: ${resp.status} ${text}`);
  }
  const json = await resp.json();
  return json.access_token;
}

export async function createOrder({ amount, currency = "USD" }) {
  const access = await getAccessToken();
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: `${amount}`, // expect "10.00"
        },
      },
    ],
  };

  const resp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PayPal create order failed: ${resp.status} ${text}`);
  }
  const json = await resp.json();
  const approve = json.links?.find((l) => l.rel === "approve")?.href;
  return { id: json.id, approve_url: approve };
}

export async function captureOrder(orderId) {
  const access = await getAccessToken();
  const resp = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PayPal capture failed: ${resp.status} ${text}`);
  }
  return await resp.json();
}
