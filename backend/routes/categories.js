import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getMenuCategories,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/menu', getMenuCategories);
router.get('/id/:id', getCategoryById);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/reorder', protect, admin, reorderCategories);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
