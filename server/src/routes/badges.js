const express = require('express');
const router = express.Router();
const { getBadges, createBadge } = require('../services/badgeService');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getBadges);
router.post('/', protect, authorize('admin'), createBadge);

module.exports = router;
