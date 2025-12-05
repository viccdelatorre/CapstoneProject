import Stripe from "stripe";

let stripe;

/** Lazy singleton with clear error if env is missing. */
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY in backend .env (set STRIPE_SECRET_KEY=sk_test_...)"
      );
    }
    stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return stripe;
}

export async function createPaymentIntent({
  amount,
  currency = "usd",
  metadata = {},
}) {
  const s = getStripe();
  const intent = await s.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
  return intent;
}
