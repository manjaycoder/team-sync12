import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  aiCompleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.route('/').get(getTasks).post(createTask);
router.post('/:id/ai-complete', aiCompleteTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
