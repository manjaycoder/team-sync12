import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

const router = Router();

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

export default router;
