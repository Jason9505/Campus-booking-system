const { Router } = require('express');

const resourceController =
  require('../controllers/resourceController');

const authMiddleware =
  require('../middlewares/authMiddleware');

const router = Router();

router.get(
    "/search",
    authMiddleware,
    resourceController.searchResources
);

router.get(
  '/',
  authMiddleware,
  resourceController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  resourceController.getById
);

router.post(
  '/',
  authMiddleware,
  resourceController.create
);

router.put(
  '/:id',
  authMiddleware,
  resourceController.update
);

router.delete(
  '/:id',
  authMiddleware,
  resourceController.delete
);

module.exports = router;