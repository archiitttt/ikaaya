const router = require('express').Router();
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../../Controllers/categoryController');
const { isAuth, isAdmin } = require('../../Middlewares/authMiddleware');

// Public routes
router.route('/')
  .get(getAllCategories);

router.route('/:id')
  .get(getCategoryById);

// Admin routes
router.route('/')
  .post(isAuth, isAdmin, createCategory);

router.route('/:id')
  .put(isAuth, isAdmin, updateCategory)
  .delete(isAuth, isAdmin, deleteCategory);

module.exports = router;
