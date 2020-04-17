const express = require('express');

const UserCompanyRelationshipController = require('../controllers/user-company-relationship');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, UserCompanyRelationshipController.joinCompany);
router.get('', UserCompanyRelationshipController.getRelationships);
router.get('/:id', checkAuth, UserCompanyRelationshipController.getRelation);
router.put('/:id', checkAuth, UserCompanyRelationshipController.updatePoints);
//router.delete('/:id', checkAuth, UserCompanyRelationshipController.deleteCompany);

module.exports = router;