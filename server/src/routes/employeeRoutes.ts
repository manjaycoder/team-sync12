import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.route('/').get(getEmployees).post(authorize('admin', 'manager', 'company_owner'), createEmployee);
router
  .route('/:id')
  .get(getEmployeeById)
  .put(authorize('admin', 'manager', 'company_owner'), updateEmployee)
  .delete(authorize('admin', 'company_owner', 'super_admin'), deleteEmployee);

export default router;
