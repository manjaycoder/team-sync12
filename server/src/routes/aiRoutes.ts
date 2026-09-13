import { Router } from 'express';
import {
  getSyncBriefing,
  getStandup,
  askAssistant,
  getActivities,
} from '../controllers/aiController';

const router = Router();

router.post('/sync-briefing', getSyncBriefing);
router.post('/standup', getStandup);
router.post('/assistant', askAssistant);
router.get('/activities', getActivities);

export default router;
