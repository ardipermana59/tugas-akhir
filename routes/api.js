const express = require('express');
const router = express.Router();

// Admin Controllers
const adminUserController = require('../controllers/admin/admin_user_controller');

// Controllers
const voteController = require('../controllers/vote_controller');

router.get('/admin/users', adminUserController.getUser);
router.post('/vote', voteController.vote);

module.exports = router;
