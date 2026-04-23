const express = require('express');
const router = express.Router();
const cashbackController = require('../controllers/cashbackController');

router.get('/', cashbackController.getAllCategories);
router.get('/:id', cashbackController.getCategoryById);
router.post('/', cashbackController.createCategory);
router.patch('/:id', cashbackController.updateCategory);
router.delete('/:id', cashbackController.deleteCategory);

module.exports = router;
