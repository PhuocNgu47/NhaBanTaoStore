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
  syncProductCounts,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';
import { activityLogger } from '../middleware/activityLogger.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/menu', getMenuCategories);
router.get('/id/:id', getCategoryById);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, admin, activityLogger, createCategory);
router.post('/sync-counts', protect, admin, activityLogger, syncProductCounts);
router.put('/reorder', protect, admin, activityLogger, reorderCategories);
router.put('/:id', protect, admin, activityLogger, updateCategory);
router.delete('/:id', protect, admin, activityLogger, deleteCategory);

export default router;
