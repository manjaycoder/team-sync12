import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.route('/').get(getDepartments).post(createDepartment);
router.route('/:id').get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

export default router;
