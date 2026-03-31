const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const upload = require('../middleware/upload');

router.post('/submit-price', upload.single('image'), priceController.submitPrice);
router.get('/analytics/:id', priceController.getAnalytics);
router.get('/system-stats', priceController.getSystemStats);
router.get('/suggestions', priceController.getSuggestions);

module.exports = router;
