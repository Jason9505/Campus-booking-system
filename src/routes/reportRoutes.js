const { Router } = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get(
  '/',
  authMiddleware,
  reportController.generateReport
);

router.get(
"/departments",
authMiddleware,
reportController.getDepartments
);

router.get(
    "/pdf",
    authMiddleware,
    reportController.exportPdf
);
router.get(
  "/csv",
  authMiddleware,
  reportController.exportCsv
);

module.exports = router;