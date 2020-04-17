const express = require('express');

const CompanyController = require('../controllers/company');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, CompanyController.createCompany);
router.get('', CompanyController.getCompanies);
router.delete('/:id', checkAuth, CompanyController.deleteCompany);

module.exports = router;