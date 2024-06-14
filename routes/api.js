const express = require('express');
const router = express.Router();

// Controllers
const voteController = require('../controllers/vote_controller');

router.post('/vote', voteController.vote);

module.exports = router;
