const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/:userId', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.delete('/:userId/item/:productId', cartController.deleteItemFromCart);
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
