import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

export default router;
