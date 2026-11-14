import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.route('/').get(getDepartments).post(authorize('admin', 'manager', 'company_owner'), createDepartment);
router
  .route('/:id')
  .get(getDepartmentById)
  .put(authorize('admin', 'manager', 'company_owner'), updateDepartment)
  .delete(authorize('admin', 'company_owner', 'super_admin'), deleteDepartment);

export default router;
