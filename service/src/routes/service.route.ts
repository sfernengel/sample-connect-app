import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { post } from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res) => {
  post(req, res);
  // logger.info('Cart update extension executed');
  // res.status(200);
  // res.send();
});

export default serviceRouter;
