import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

const router = Router();

router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

export default router;
