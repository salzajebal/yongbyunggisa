import { Router, type IRouter } from "express";
import healthRouter from "./health";
import articleRouter from "./article";
import commentsRouter from "./comments";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(articleRouter);
router.use(commentsRouter);
router.use(storageRouter);

export default router;
