require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(null, true);
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api", routes);
const port = Number(process.env.PORT || 8000);
app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
