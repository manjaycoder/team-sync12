import { Router } from 'express';
import {
  getSyncBriefing,
  getStandup,
  askAssistant,
  getActivities,
} from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/sync-briefing', getSyncBriefing);
router.post('/standup', getStandup);
router.post('/assistant', askAssistant);
router.get('/activities', getActivities);

export default router;
