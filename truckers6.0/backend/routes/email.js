const express = require('express');

const EmailController = require('../controllers/email');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', EmailController.sendEmail);
//router.get('', EmailController.getCompanies);
//router.delete('/:id', checkAuth, CompanyController.deleteCompany);

module.exports = router;