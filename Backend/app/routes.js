const express = require("express");
const router = express.Router();

const stripeRoutes = require("./routes.stripe");
const paypalRoutes = require("./routes.paypal");

router.use("/stripe", stripeRoutes);
router.use("/paypal", paypalRoutes);

module.exports = router;
