import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { paymentsApi as api } from "@/lib/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function WalletProbe({ amount = 1999, currency = "usd" }) {
  const stripe = useStripe();
  const [pr, setPr] = useState(null);
  const booted = useRef(false);

  useEffect(() => {
    booted.current = false;
    setPr(null);
  }, [currency]);

  useEffect(() => {
    if (!stripe || booted.current) return;
    booted.current = true;

    const req = stripe.paymentRequest({
      country: currency === "cad" ? "CA" : "US",
      currency,
      total: { label: "Checkout", amount },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    req.canMakePayment().then((result) => {
      if (result) setPr(req);
    });

    req.on("paymentmethod", async (ev) => {
      try {
        const { clientSecret } = await api.post("/stripe/intent", {
          amount,
          currency,
        });
        const { error } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: true }
        );
        ev.complete(error ? "fail" : "success");
      } catch {
        ev.complete("fail");
      }
    });
  }, [stripe, amount, currency]);

  if (!pr) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <PaymentRequestButtonElement
        options={{
          paymentRequest: pr,
          style: { paymentRequestButton: { height: "44px" } },
        }}
      />
    </div>
  );
}

function CheckoutForm({ amount, currency }) {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stripe) return;
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("payment_intent_client_secret");
    if (!secret) return;

    stripe.retrievePaymentIntent(secret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded.");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Payment failed. Please try another method.");
          break;
        default:
          setMessage("");
      }
    });
  }, [stripe]);

  async function pay() {
    if (!stripe || !elements || !complete) return;
    setSubmitting(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Payment failed");
      setSubmitting(false);
    } else {
      setSubmitting(false);
    }
  }

  const methodOrder =
    currency === "cad"
      ? ["google_pay", "apple_pay", "link", "acss_debit", "card"]
      : [
          "google_pay",
          "apple_pay",
          "link",
          "klarna",
          "us_bank_account",
          "card",
        ];

  return (
    <div>
      {message && (
        <div
          style={{
            marginBottom: 8,
            padding: 8,
            borderRadius: 6,
            background: "#f3f4f6",
          }}
        >
          {message}
        </div>
      )}

      <WalletProbe amount={amount} currency={currency} />

      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: methodOrder,
          wallets: { googlePay: "auto", applePay: "auto", link: "auto" },
        }}
        onReady={() => setReady(true)}
        onChange={(e) => setComplete(!!e.complete)}
      />

      <button
        type="button"
        onClick={pay}
        disabled={!ready || !complete || submitting || !stripe || !elements}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: !ready || !complete || submitting ? "#e5e7eb" : "#111827",
          color: !ready || !complete || submitting ? "#6b7280" : "#ffffff",
          cursor: !ready || !complete || submitting ? "not-allowed" : "pointer",
          fontWeight: 600,
          width: 140,
          textAlign: "center",
        }}
      >
        {submitting ? "Processing..." : "Pay"}
      </button>
    </div>
  );
}

// A tidy toolbar that sits above the PaymentElement, right aligned
function CurrencyToolbar({ currency, setCurrency }) {
  const id = "currency-select";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 8,
      }}
    >
      <label
        htmlFor={id}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 8px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          color: "#374151", // ensure label text is visible
          fontSize: 12,
        }}
      >
        <span>Currency</span>
        <select
          id={id}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827", // force visible text color
            fontWeight: 600,
            minWidth: 96, // avoid looking empty
            appearance: "auto", // let browsers render native arrow
          }}
          aria-label="Currency"
        >
          <option value="usd">USD</option>
          <option value="cad">CAD</option>
        </select>
      </label>
    </div>
  );
}

export default function StripeCheckout({ amount = 1999 }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [err, setErr] = useState("");
  const [currency, setCurrency] = useState("usd");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { clientSecret } = await api.post("/stripe/intent", {
          amount,
          currency,
        });
        if (alive) setClientSecret(clientSecret);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to init Stripe");
      }
    })();
    return () => {
      alive = false;
    };
  }, [amount, currency]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: "stripe" },
      loader: "never",
    }),
    [clientSecret]
  );

  if (err) return <div className="error">{err}</div>;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <CurrencyToolbar currency={currency} setCurrency={setCurrency} />

      {!clientSecret ? (
        <p>Loading checkout…</p>
      ) : (
        <Elements stripe={stripePromise} options={options} key={clientSecret}>
          <CheckoutForm amount={amount} currency={currency} />
        </Elements>
      )}
    </div>
  );
}
