import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paymentsApi as api } from "@/lib/api";
import { useState } from "react";

export default function PayPalCheckout({ amount = 1999 }) {
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  return (
    <PayPalScriptProvider
      options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      {ok ? (
        <p className="ok">PayPal payment successful</p>
      ) : (
        <>
          {err && <div className="error">{err}</div>}
          <PayPalButtons
            createOrder={async () => {
              try {
                const { id } = await api.post("/paypal/order", {
                  amount,
                  currency: "USD",
                });
                return id;
              } catch (e) {
                setErr(e.message);
                throw e;
              }
            }}
            onApprove={async (data) => {
              try {
                await api.post("/paypal/capture", { orderId: data.orderID });
                setOk(true);
              } catch (e) {
                setErr(e.message);
              }
            }}
            onError={(e) => setErr(e.message || "PayPal error")}
            style={{ layout: "vertical" }}
          />
        </>
      )}
    </PayPalScriptProvider>
  );
}
