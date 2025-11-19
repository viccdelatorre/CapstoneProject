import StripeCheckout from "./StripeCheckout.jsx";
import PayPalCheckout from "./PayPalCheckout.jsx";
import "./app.css";

export default function App() {
  return (
    <div className="wrap">
      <h1>Sandbox checkouts</h1>

      <section className="card">
        <h2
          style={{
            color: "#635BFF",
          }}
        >
          Stripe
        </h2>
        <StripeCheckout amount={1999} />
        <p className="hint">
          Test card: 4242 4242 4242 4242 • any future exp • any CVC
        </p>
      </section>

      <section className="card">
        <h2 style={{ fontWeight: "bold" }}>
          <span style={{ color: "#003087" }}>Pay</span>
          <span style={{ color: "#009CDE" }}>Pal</span>
        </h2>
        <PayPalCheckout amount={1999} />
        <p className="hint">Use a PayPal sandbox buyer account</p>
      </section>
    </div>
  );
}
