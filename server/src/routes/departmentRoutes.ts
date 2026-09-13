import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController';

const router = Router();

router.route('/').get(getDepartments).post(createDepartment);
router.route('/:id').get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

export default router;
