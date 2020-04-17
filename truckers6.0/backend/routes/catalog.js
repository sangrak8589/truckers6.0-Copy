const express = require('express');

const CatalogController = require('../controllers/catalog');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, CatalogController.createCatalog);
router.get('', CatalogController.getCatalogs);
router.delete('/:id', checkAuth, CatalogController.deleteCatalog);

module.exports = router;