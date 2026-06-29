const { Router } = require("express");

const router = Router();

const policyController =
require("../controllers/policyController");

const authMiddleware =
require("../middlewares/authMiddleware");

const roleMiddleware =
require("../middlewares/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    policyController.get
);

router.put(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    policyController.update
);

router.get(
    "/logs",
    authMiddleware,
    policyController.logs
);

module.exports = router;