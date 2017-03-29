const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

router.route('/:id')
.get(User.protected, (req, res, next) => res.status(200).json(JSON.stringify(req.currentUser)))
.put(User.protected, (req, res, next) => res.status(200).end('PUT user'))
.delete(User.protected, (req, res, next) => res.status(200).end('DELETE user'));

module.exports = router;