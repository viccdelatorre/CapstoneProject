const ROOT =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000/api";

const PAYMENTS =
  import.meta.env.VITE_PAYMENTS_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api";

const BASE = ROOT.endsWith("/api") ? ROOT : `${ROOT}/api`;
const PAYMENTS_BASE = PAYMENTS.endsWith("/api") ? PAYMENTS : `${PAYMENTS}/api`;

async function http(base, path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(
      data?.error || data?.message || `Request failed ${res.status}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => http(BASE, p, { method: "GET" }),
  post: (p, body) => http(BASE, p, { method: "POST", body }),
};

export const paymentsApi = {
  post: (p, body) => http(PAYMENTS_BASE, p, { method: "POST", body }),
};
