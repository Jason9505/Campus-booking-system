const { Router } = require("express");

const router = Router();

const policyController =
require("../controllers/policyController");

const authMiddleware =
require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    policyController.get
);

router.put(
    "/",
    authMiddleware,
    policyController.update
);

router.get(
    "/logs",
    authMiddleware,
    policyController.logs
);

module.exports = router;