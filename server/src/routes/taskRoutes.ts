import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  aiCompleteTask,
} from '../controllers/taskController';

const router = Router();

router.route('/').get(getTasks).post(createTask);
router.post('/:id/ai-complete', aiCompleteTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
