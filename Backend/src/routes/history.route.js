import {Router} from 'express'



import { addToHistory,getUserHistory } from '../controllers/history.controller.js';

import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();


router.get('/',jwtVerify,getUserHistory);
router.post('/add',jwtVerify,addToHistory);


export default router;