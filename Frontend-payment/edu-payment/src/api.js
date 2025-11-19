const ROOT =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api";
const BASE = ROOT.endsWith("/api") ? ROOT : `${ROOT}/api`;

async function http(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
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

export default {
  post: (p, body) => http(p, { method: "POST", body }),
};
