import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  aiCompleteTask,
  // Checklist Controllers
  getChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  // Acceptance Criteria Controllers
  getAcceptanceCriteria,
  addAcceptanceCriterion,
  updateAcceptanceCriterion,
  deleteAcceptanceCriterion,
  // Attachment Controllers
  getAttachments,
  uploadAttachment,
  downloadAttachment,
  deleteAttachment,
} from '../controllers/taskController';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadTaskAttachment } from '../middleware/uploadMiddleware';

const router = Router();

// Protect all task endpoints with session token verification
router.use(protect);

// Base Tasks CRUD
router.route('/').get(getTasks).post(createTask);
router.post('/:id/ai-complete', aiCompleteTask);
router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(authorize('admin', 'manager', 'company_owner', 'super_admin'), deleteTask);

// Checklist REST Endpoints
router.route('/:taskId/checklist').get(getChecklist).post(addChecklistItem);
router
  .route('/:taskId/checklist/:itemId')
  .put(updateChecklistItem)
  .delete(deleteChecklistItem);

// Acceptance Criteria REST Endpoints
router.route('/:taskId/acceptance-criteria').get(getAcceptanceCriteria).post(addAcceptanceCriterion);
router
  .route('/:taskId/acceptance-criteria/:criteriaId')
  .put(updateAcceptanceCriterion)
  .delete(deleteAcceptanceCriterion);

// Attachments REST Endpoints
router
  .route('/:taskId/attachments')
  .get(getAttachments)
  .post(uploadTaskAttachment.single('file'), uploadAttachment);

router.get('/:taskId/attachments/:attachmentId/download', downloadAttachment);
router.delete('/:taskId/attachments/:attachmentId', deleteAttachment);

export default router;
