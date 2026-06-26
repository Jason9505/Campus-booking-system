const { Router } = require("express");

const router = Router();

const dashboardController =
require("../controllers/dashboardController");

const authMiddleware =
require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    dashboardController.getDashboard
);

module.exports = router;