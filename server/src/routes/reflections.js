const express = require('express');
const router = express.Router();
const { getMyReflections, createReflection, updateReflection, deleteReflection } = require('../controllers/reflectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMyReflections);
router.post('/', createReflection);
router.put('/:id', updateReflection);
router.delete('/:id', deleteReflection);

module.exports = router;
