// Simple in memory mock provider
// You can replace this with a JSON file later if you want persistence

const db = {
  methods: [],
  preferredId: null,
  invoices: [],
};

function uid() {
  return "mock_" + Math.random().toString(36).slice(2, 10);
}

function listMethods() {
  return db.methods.map((m) => ({
    id: m.id,
    brand: m.brand,
    last4: m.last4,
    exp_month: m.exp_month,
    exp_year: m.exp_year,
    isPreferred: db.preferredId === m.id,
    provider: "mock",
  }));
}

function linkMethod({ number, exp_month, exp_year, cvc, label }) {
  // Very basic validation
  if (!number || !exp_month || !exp_year || !cvc) {
    const err = new Error("Missing card fields");
    err.status = 400;
    throw err;
  }

  const brand = number.startsWith("4")
    ? "Visa"
    : number.startsWith("5")
    ? "Mastercard"
    : number.startsWith("3")
    ? "Amex"
    : "Card";

  const newMethod = {
    id: uid(),
    brand,
    last4: number.slice(-4),
    exp_month: String(exp_month).padStart(2, "0"),
    exp_year: String(exp_year),
    label: label || `${brand} •••• ${number.slice(-4)}`,
  };

  db.methods.push(newMethod);
  if (!db.preferredId) db.preferredId = newMethod.id;

  return {
    id: newMethod.id,
    brand: newMethod.brand,
    last4: newMethod.last4,
    exp_month: newMethod.exp_month,
    exp_year: newMethod.exp_year,
    isPreferred: db.preferredId === newMethod.id,
    provider: "mock",
  };
}

function setPreferred(id) {
  const found = db.methods.find((m) => m.id === id);
  if (!found) {
    const err = new Error("Payment method not found");
    err.status = 404;
    throw err;
  }
  db.preferredId = id;
  return { ok: true, preferredId: id };
}

function charge({ amount, currency, methodId, description }) {
  const found = db.methods.find((m) => m.id === methodId);
  if (!found) {
    const err = new Error("Payment method not found");
    err.status = 404;
    throw err;
  }
  const invoice = {
    id: "inv_" + uid(),
    amount,
    currency: currency || "usd",
    methodId,
    description: description || "Mock charge",
    created: Date.now(),
    status: "succeeded",
    provider: "mock",
  };
  db.invoices.push(invoice);
  return invoice;
}

module.exports = {
  listMethods,
  linkMethod,
  setPreferred,
  charge,
};
